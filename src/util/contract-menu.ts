import * as commander from 'commander';
import * as _ from 'lodash';
const jsome = require('jsome');

import { Mirror } from '@mirror-protocol/mirror.js';
import {
  LCDClient,
  Msg,
  StdFee,
  StdSignMsg,
  StdTx,
  Coins,
} from '@terra-money/terra.js';

import { getMirrorClient } from './client';

export function createExecMenu(
  name: string,
  description: string
): commander.Command {
  const exec = new commander.Command(name);
  exec
    .description(description)
    .option('--home <string>', 'Directory for config of terracli')
    .requiredOption('--from <string>', 'Name of key in terracli keyring')
    .option(
      '--generate-only',
      'Build an unsigned transaction and write it to stdout'
    )
    .option(
      '-b,--broadcast-mode <string>',
      'Transaction broadcasting mode (sync|async|block)',
      'sync'
    )
    // StdSignMsg
    .option('--chain-id <string>', 'Chain ID of Terra node')
    .option(
      '-a,--account-number <int>',
      'The account number of the signing account (offline mode)'
    )
    .option(
      '-s,--sequence <int>',
      'The sequence number of the signing account (offline mode)'
    )
    .option('--memo <string>', 'Memo to send along with transaction')
    // Fees & Gas
    .option('--fees <coins>', 'Fees to pay along with transaction')
    .option(
      '--gas <int>',
      'Gas limit to set per-transaction; set to "auto" or leave blank to calculate required gas automatically'
    )
    .option(
      '--gas-adjustment <float>',
      'Adjustment factor to be multiplied against the estimate returned by the tx simulation'
    )
    .option(
      '--gas-prices <coins>',
      'Gas prices to determine the transaction fee (e.g. 10uluna,12.5ukrw)'
    );

  return exec;
}

export async function handleExecCommand(
  exec: commander.Command,
  createMsg: (mirror: Mirror) => Msg
) {
  const mirror = getMirrorClient(exec.from, exec.home);
  const msgs = [createMsg(mirror)];

  const chainId: string = exec.chainId
    ? exec.chainId
    : mirror.lcd.config.chainID;

  const memo: string = exec.memo ? exec.memo : '';

  let accountNumber: number;
  let sequence: number;

  if (!!exec.accountNumber || !!exec.sequence) {
    // don't look up account-number and sequence values from blockchain
    // ensure that both account number and sequence number are set
    if (exec.accountNumber === undefined || exec.sequence == undefined) {
      throw new Error(
        `both account-number and sequence must be provided if one is provided (offline mode)`
      );
    }
    accountNumber = Number.parseInt(exec.accountNumber);
    sequence = Number.parseInt(exec.sequence);
  } else {
    // looks up wallet values from blockchain
    const wallet = mirror.lcd.wallet(mirror.key);
    const accountInfo = await wallet.accountNumberAndSequence();
    accountNumber = accountInfo.account_number;
    sequence = accountInfo.sequence;
  }

  const unsignedTx = new StdSignMsg(
    chainId,
    accountNumber,
    sequence,
    new StdFee(0, { uluna: 1 }),
    msgs,
    memo
  );

  if (exec.generateOnly) {
    jsome(unsignedTx.toStdTx().toData());
  } else {
    const signedTx = await mirror.key.signTx(unsignedTx);
    jsome(signedTx.toData());
  }
}
