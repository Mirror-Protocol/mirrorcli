import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('mirror-token', 'Mirror Token contract functions');
exec.alias('MIR');

const burn = exec
  .command('burn <amount>')
  .description(`Burns MIR token`, {
    amount: '(Uint128) amount to burn',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.burn(Parse.int(amount))
    );
  });

const burnFrom = exec
  .command('burn-from <owner> <amount>')
  .description(`Burns MIR token`, {
    owner: '(AccAddress) account to burn from',
    amount: '(Uint128) amount to burn',
  })
  .action((owner: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.burnFrom(owner, amount)
    );
  });

const increaseAllowance = exec
  .command('increase-allowance <spender> <amount>')
  .description(`Burns MIR token`, {
    owner: '(AccAddress) account to burn from',
    amount: '(Uint128) amount to burn',
  })
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .action((spender: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.increaseAllowance(spender, Parse.int(amount))
    );
  });

const query = new Command('mirror-token');
query.alias('MIR');
query.description('Mirror Token contract queries');
const getTokenInfo = query
  .command('token-info')
  .description('Query Mirror Token contract info')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.mirrorToken.getTokenInfo());
  });

const getMinter = query
  .command('minter')
  .description('Query Mirror Token minter')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.mirrorToken.getMinter());
  });

const getBalance = query
  .command('balance [address]')
  .description('Query Mirror Token balance', {
    address: '(AccAddress) address to query',
  })
  .action((address?: string) => {
    handleQueryCommand(query, mirror => mirror.mirrorToken.getBalance(address));
  });

const getAllowance = query
  .command('allowance <owner> <spender>')
  .description('Query Mirror Token allowance', {
    owner: '(AccAddress) owner address',
    spender: '(AccAddress) spender address',
  })
  .action((owner: string, spender: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mirrorToken.getAllowance(owner, spender)
    );
  });

const getAllAllowances = query
  .command('allowances <owner>')
  .description('Query all Mirror Token allowances', {
    owner: '(AccAddress) owner address',
  })
  .option('--start-after <int>', 'index of to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action((owner: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mirrorToken.getAllAllowances(
        owner,
        getAllAllowances.startAfter,
        getAllAllowances.limit
      )
    );
  });

const getAllAccounts = query
  .command('accounts')
  .description('Query all Mirror Token accounts')
  .option('--start-after <string>', 'prfix to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action(() => {
    handleQueryCommand(query, mirror =>
      mirror.mirrorToken.getAllAccounts(
        getAllAccounts.startAfter,
        getAllAccounts.limit
      )
    );
  });

export default {
  exec,
  query,
};
