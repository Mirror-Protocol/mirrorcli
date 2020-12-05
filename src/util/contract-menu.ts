import * as commander from 'commander';
import * as _ from 'lodash';
const jsome = require('jsome');
const yesno = require('yesno');
import * as yaml from 'yaml';

import { Parse } from './parse-input';
import { Mirror } from '@mirror-protocol/mirror.js';
import {
  Msg,
  StdFee,
  StdSignMsg,
  Coins,
  MsgExecuteContract,
} from '@terra-money/terra.js';

import { getMirrorClient } from './client';

export function createExecMenu(
  name: string,
  description: string
): commander.Command {
  const exec = new commander.Command(name);
  exec
    .description(description)
    .option('--yaml', 'Encode result as YAML instead of JSON')
    .option('-y,--yes', 'Sign transaction without confirming (yes)')
    .option('--home <string>', 'Directory for config of terracli')
    .option('--from <key-name>', '*Name of key in terracli keyring')
    .option(
      '--generate-only',
      'Build an unsigned transaction and write it to stdout'
    )
    .option(
      '-G,--generate-msg',
      'Build an ExecuteMsg (good for including in poll)'
    )
    .option('--base64', 'For --generate-msg: returns msg as base64')
    .option(
      '-b,--broadcast-mode <string>',
      'Transaction broadcasting mode (sync|async|block) (default: sync)',
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
      '--gas <int|auto>',
      '*Gas limit to set per-transaction; set to "auto" to calculate required gas automatically'
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

export function createQueryMenu(
  name: string,
  description: string
): commander.Command {
  const query = new commander.Command(name);
  query
    .description(description)
    .option('--yaml', 'Encode result as YAML instead of JSON');
  return query;
}

export async function handleExecCommand(
  exec: commander.Command,
  createMsg: (mirror: Mirror) => Promise<MsgExecuteContract>
) {
  if (!exec.generateMsg) {
    if (exec.from === undefined) {
      throw new Error(
        `--from <key-name> must be provided if not --generate-msg`
      );
    }

    if (exec.gas === undefined) {
      throw new Error(
        `--gas <int|auto> must be provided if not --generate-msg`
      );
    }
  }

  const mirror = getMirrorClient(exec.from, exec.home);
  const wallet = mirror.lcd.wallet(mirror.key);
  const msg = await createMsg(mirror);
  const msgs = [msg];

  if (exec.generateMsg) {
    if (exec.base64) {
      return console.log(
        Buffer.from(JSON.stringify(msg.execute_msg)).toString('base64')
      );
    }
    return console.log(JSON.stringify(msg.execute_msg));
  }

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
        `both account-number and sequence must be provided if one is provided.`
      );
    }
    accountNumber = Parse.int(exec.accountNumber);
    sequence = Parse.int(exec.sequence);
  } else {
    // looks up wallet values from blockchain
    const accountInfo = await wallet.accountNumberAndSequence();
    accountNumber = accountInfo.account_number;
    sequence = accountInfo.sequence;
  }

  let gas: number;
  let feeAmount: Coins;

  if (exec.gas === 'auto') {
    // estimate gas
    const estimatedFee = (
      await mirror.lcd.tx.create(mirror.key.accAddress, {
        msgs,
        account_number: accountNumber,
        sequence,
        gasPrices: exec.gasPrices,
        gasAdjustment: exec.gasAdjustment,
        memo,
      })
    ).fee;

    gas = estimatedFee.gas;

    if (exec.fees === undefined) {
      feeAmount = estimatedFee.amount;
    }
  } else {
    if (exec.fees === undefined) {
      feeAmount = new Coins({});
    } else {
      feeAmount = Parse.coins(exec.fees);
    }

    gas = Parse.int(exec.gas);
  }

  const unsignedTx = new StdSignMsg(
    chainId,
    accountNumber,
    sequence,
    new StdFee(gas, feeAmount),
    msgs,
    memo
  );

  if (exec.generateOnly) {
    if (exec.yaml) {
      console.log(yaml.stringify(unsignedTx.toStdTx().toData()));
    } else {
      jsome(unsignedTx.toStdTx().toData());
    }
  } else {
    if (!exec.yes) {
      let msg = unsignedTx.msgs[0].toData() as any;
      msg.value.execute_msg = (unsignedTx
        .msgs[0] as MsgExecuteContract).execute_msg;

      console.log(
        yaml.stringify({
          chainId,
          msg,
          fee: unsignedTx.fee.toData(),
          memo,
        })
      );

      const ok = await yesno({
        question: `Confirm and sign transaction with key ${exec.from}? (y/N)`,
        defaultValue: false,
      });

      if (!ok) {
        console.log('Process aborted.');
        process.exit(1);
      }
    }
    const signedTx = await mirror.key.signTx(unsignedTx);
    let result;
    switch (exec.broadcastMode) {
      case 'sync':
        result = await mirror.lcd.tx.broadcastSync(signedTx);
        break;
      case 'async':
        result = await mirror.lcd.tx.broadcastAsync(signedTx);
        break;
      case 'block':
        result = await mirror.lcd.tx.broadcast(signedTx);
        break;
      default:
        throw new Error(
          `invalid broadcast-mode '${exec.broadcastMode}' - must be sync|async|block`
        );
    }
    if (exec.yaml) {
      console.log(yaml.stringify(result));
    } else {
      jsome(result);
    }
  }
}

export async function handleQueryCommand(
  query: commander.Command,
  run: (mirror: Mirror) => Promise<any>
) {
  const result = await run(getMirrorClient());
  if (query.yaml) {
    console.log(yaml.stringify(result));
  } else {
    jsome(result);
  }
}
