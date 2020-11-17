import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('mirror-token', 'Mirror Token contract functions');
exec.alias('MIR');

const transfer = exec
  .command('transfer <recipient> <amount>')
  .description(`Send tokens to account`, {
    recipient: '(AccAddress) recipient',
    amount: '(Uint128) amount to send',
  })
  .action((recipient: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.transfer(
        Parse.accAddress(recipient),
        Parse.uint128(amount)
      )
    );
  });

const transferFrom = exec
  .command('transfer-from <owner> <recipient> <amount>')
  .description(`Send tokens to account using allowance`, {
    owner: '(AccAddress) owner to spend from',
    recipient: '(AccAddress) recipient',
    amount: '(Uint128) amount to send',
  })
  .action((owner: string, recipient: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.transferFrom(
        Parse.accAddress(owner),
        Parse.accAddress(recipient),
        Parse.uint128(amount)
      )
    );
  });

const send = exec
  .command('send <contract> <amount>')
  .description(
    `Send tokens to contract account with possibility to execute message`,
    {
      contract: '(AccAddress) contract recipient',
      recipient: '(Uint128) amount to send',
    }
  )
  .option('--msg <string>', 'string of JSON Receive hook to run')
  .action((contract: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.send(
        Parse.accAddress(contract),
        Parse.uint128(amount),
        send.msg
      )
    );
  });

const sendFrom = exec
  .command('send-from <owner> <contract> <amount>')
  .description(
    `Send tokens to contract account with possibility to execute message, from allowance`,
    {
      owner: '(AccAddress) owner to spend from',
      contract: '(AccAddress) contract recipient',
      recipient: '(Uint128) amount to send',
    }
  )
  .option('--msg <string>', 'string of JSON Receive hook to run')
  .action((owner: string, contract: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.sendFrom(
        Parse.accAddress(owner),
        Parse.accAddress(contract),
        Parse.uint128(amount),
        sendFrom.msg
      )
    );
  });

const mint = exec
  .command('mint <recipient> <amount>')
  .description(`Mint and send tokens to account`, {
    recipient: '(AccAddress) recipient',
    amount: '(Uint128) amount to mint and send',
  })
  .action((recipient: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.mint(
        Parse.accAddress(recipient),
        Parse.uint128(amount)
      )
    );
  });

const burn = exec
  .command('burn <amount>')
  .description(`Burns MIR token`, {
    amount: '(Uint128) amount to burn',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.burn(Parse.uint128(amount))
    );
  });

const burnFrom = exec
  .command('burn-from <owner> <amount>')
  .description(`Burns MIR token from owner`, {
    owner: '(AccAddress) account to burn from',
    amount: '(Uint128) amount to burn',
  })
  .action((owner: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.burnFrom(
        Parse.accAddress(owner),
        Parse.uint128(amount)
      )
    );
  });

const increaseAllowance = exec
  .command('increase-allowance <spender> <amount>')
  .description(`Increase allowance for spender`, {
    spender: '(AccAddress) spender',
    amount: '(Uint128) amount to increase allowance by',
  })
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .action((spender: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.increaseAllowance(
        Parse.accAddress(spender),
        Parse.uint128(amount)
      )
    );
  });

const decreaseAllowance = exec
  .command('decrease-allowance <spender> <amount>')
  .description(`Decreases allowance for spender`, {
    spender: '(AccAddress) spender',
    amount: '(Uint128) amount to decrease allowance by',
  })
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .action((spender: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mirrorToken.decreaseAllowance(
        Parse.accAddress(spender),
        Parse.uint128(amount)
      )
    );
  });

const query = createQueryMenu('mirror-token', 'Mirror Token contract queries');
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
  .option('--start-after <string>', 'index of to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action((owner: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mirrorToken.getAllAllowances(
        Parse.accAddress(owner),
        getAllAllowances.startAfter,
        Parse.int(getAllAllowances.limit)
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
        Parse.int(getAllAccounts.limit)
      )
    );
  });

export default {
  exec,
  query,
};
