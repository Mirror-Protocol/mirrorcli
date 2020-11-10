import * as commander from 'commander';
import * as _ from 'lodash';

import { InputParser } from './parse-input';

export function createExecMenu(
  name: string,
  description: string
): commander.Command {
  const exec = new commander.Command(name);
  exec
    .description(description)
    .option('--home <string>', 'Directory for config of terracli')
    .option('--from <string>', 'Name of key in terracli keyring')
    .option(
      '--generate-only',
      'Build an unsigned transaction and write it to stdout'
    )
    .option(
      '-b,--broadcast-mode <string>',
      'Transaction broadcasting mode (sync|async|block)'
    )
    // StdSignMsg
    .option('--chain-id <string>', 'Chain ID of Terra node')
    .option(
      '-a,--account-number <int>',
      'The account number of the signing account (overrides)'
    )
    .option(
      '-s,--sequence <int>',
      'The sequence number of the signing account (overrides)'
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
