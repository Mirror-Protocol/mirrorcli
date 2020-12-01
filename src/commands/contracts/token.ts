import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { Mirror, TerraswapToken } from '@mirror-protocol/mirror.js';

export function lookupTokenByAsset(
  mirror: Mirror,
  assetAmountString: string // expects: 1000MIR, 1000mAAPL, etc.
): TerraswapToken {
  const contractAddress = Parse.assetTokenAddress(assetAmountString);
  return new TerraswapToken({
    contractAddress,
    key: mirror.key,
    lcd: mirror.lcd,
  });
}

export function lookupTokenByAssetTokenOrAccAddress(
  mirror: Mirror,
  assetTokenOrAccAddress: string
): TerraswapToken {
  const contractAddress = Parse.assetTokenOrAccAddress(assetTokenOrAccAddress);
  return new TerraswapToken({
    contractAddress,
    key: mirror.key,
    lcd: mirror.lcd,
  });
}

const exec = createExecMenu('token', 'Terraswap CW20 Token contract functions');

const transfer = exec
  .command('transfer <recipient> <asset>')
  .description(`Send tokens to account`, {
    recipient: '(AccAddress) recipient',
    asset: '(Asset) amount of asset to send',
  })
  .action(async (recipient: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).transfer(
        recipient,
        Parse.asset(asset).amount
      )
    );
  });

const transferFrom = exec
  .command('transfer-from <owner> <recipient> <asset>')
  .description(`Send tokens to account using allowance`, {
    owner: '(AccAddress) owner to spend from',
    recipient: '(AccAddress) recipient',
    asset: '(Asset) amount of asset to send',
  })
  .action(async (owner: string, recipient: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).transferFrom(
        Parse.accAddress(owner),
        Parse.accAddress(recipient),
        Parse.asset(asset).amount
      )
    );
  });

const send = exec
  .command('send <contract> <asset>')
  .description(
    `Send tokens to contract account with possibility to execute message`,
    {
      contract: '(AccAddress) contract recipient',
      asset: '(Asset) amount of asset to send',
    }
  )
  .option('--msg <json>', 'string of JSON Receive hook to run')
  .action(async (contract: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).send(
        Parse.accAddress(contract),
        Parse.asset(asset).amount,
        send.msg
          ? Buffer.from(JSON.stringify(JSON.parse(send.msg))).toString('base64')
          : undefined
      )
    );
  });

const sendFrom = exec
  .command('send-from <owner> <contract> <asset>')
  .description(
    `Send tokens to contract account with possibility to execute message, from allowance`,
    {
      owner: '(AccAddress) owner to spend from',
      contract: '(AccAddress) contract recipient',
      asset: '(Asset) amount of asset to send',
    }
  )
  .option('--msg <json>', 'string of JSON Receive hook to run')
  .action(async (owner: string, contract: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).sendFrom(
        Parse.accAddress(owner),
        Parse.accAddress(contract),
        Parse.asset(asset).amount,
        sendFrom.msg
          ? Buffer.from(JSON.stringify(JSON.parse(sendFrom.msg))).toString(
              'base64'
            )
          : undefined
      )
    );
  });

const mint = exec
  .command('mint <recipient> <asset>')
  .description(`Mint and send tokens to account`, {
    recipient: '(AccAddress) recipient',
    asset: '(Asset) amount of asset to mint and send',
  })
  .action(async (recipient: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).mint(
        Parse.accAddress(recipient),
        Parse.asset(asset).amount
      )
    );
  });

const burn = exec
  .command('burn <asset>')
  .description(`Burns tokens`, {
    asset: '(Asset) amount of asset to burn',
  })
  .action(async (asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).burn(Parse.asset(asset).amount)
    );
  });

const burnFrom = exec
  .command('burn-from <owner> <asset>')
  .description(`Burns tokens from owner`, {
    owner: '(AccAddress) account to burn from',
    asset: '(Asset) amount of asset to burn',
  })
  .action(async (owner: string, asset: string) => {
    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).burnFrom(
        Parse.accAddress(owner),
        Parse.asset(asset).amount
      )
    );
  });

// TODO: Fix allowance expiration?
const increaseAllowance = exec
  .command('increase-allowance <spender> <asset>')
  .description(`Increase allowance for spender`, {
    spender: '(AccAddress) spender',
    asset: '(Asset) amount of asset to increase allowance by',
  })
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(async (spender: string, asset: string) => {
    let expiry: TerraswapToken.Expiration;
    if (
      +!!increaseAllowance.expiryHeight +
        +!!increaseAllowance.expiryTime +
        +!!increaseAllowance.expiryNever >=
      2
    ) {
      throw new Error(
        `can only use one option of --expiry-height, --expiry-time, --expiry-never`
      );
    }

    if (increaseAllowance.expiryHeight) {
      expiry = {
        at_height: Parse.int(increaseAllowance.expiryHeight),
      };
    }

    if (increaseAllowance.expiryTime) {
      expiry = {
        at_time: Parse.int(increaseAllowance.expiryTime),
      };
    }

    if (increaseAllowance.expiryNever) {
      expiry = {
        never: {},
      };
    }

    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).increaseAllowance(
        Parse.accAddress(spender),
        Parse.asset(asset).amount,
        expiry
      )
    );
  });

const decreaseAllowance = exec
  .command('decrease-allowance <spender> <asset>')
  .description(`Decreases allowance for spender`, {
    spender: '(AccAddress) spender',
    asset: '(Asset) amount of asset to decrease allowance by',
  })
  .option('--expiry-height <int>', 'block height expiration of allowance')
  .option('--expiry-time <int>', 'time expiration of allowance (seconds)')
  .option('--expiry-never', 'never expires')
  .action(async (spender: string, asset: string) => {
    let expiry: TerraswapToken.Expiration;
    if (
      +!!decreaseAllowance.expiryHeight +
        +!!decreaseAllowance.expiryTime +
        +!!decreaseAllowance.expiryNever >=
      2
    ) {
      throw new Error(
        `can only use one option of --expiry-height, --expiry-time, --expiry-never`
      );
    }

    if (decreaseAllowance.expiryHeight) {
      expiry = {
        at_height: Parse.int(decreaseAllowance.expiryHeight),
      };
    }

    if (decreaseAllowance.expiryTime) {
      expiry = {
        at_time: Parse.int(decreaseAllowance.expiryTime),
      };
    }

    if (decreaseAllowance.expiryNever) {
      expiry = {
        never: {},
      };
    }

    await handleExecCommand(exec, mirror =>
      lookupTokenByAsset(mirror, asset).decreaseAllowance(
        Parse.accAddress(spender),
        Parse.asset(asset).amount,
        expiry
      )
    );
  });

const query = createQueryMenu('token', 'Terraswap CW20 Token contract queries');
const getTokenInfo = query
  .command('info <symbol>')
  .description('Query token contract info', {
    symbol: '(symbol / AccAddress): token symbol or account address',
  })
  .action(async (symbol: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getTokenInfo()
    );
  });

const getMinter = query
  .command('minter <symbol>')
  .description('Query token minter', {
    symbol: '(symbol / AccAddress): token symbol or account address',
  })
  .action(async (symbol: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getMinter()
    );
  });

const getBalance = query
  .command('balance <symbol> [address]')
  .description('Query token balance', {
    symbol: '(symbol / AccAddress): token symbol or account address',
    address: '(AccAddress) address to query',
  })
  .action(async (symbol: string, address?: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getBalance(address)
    );
  });

const getAllowance = query
  .command('allowance <symbol> <owner> <spender>')
  .description('Query token allowance', {
    symbol: '(symbol / AccAddress): token symbol or account address',
    owner: '(AccAddress) owner address',
    spender: '(AccAddress) spender address',
  })
  .action(async (symbol: string, owner: string, spender: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getAllowance(
        Parse.accAddress(owner),
        Parse.accAddress(spender)
      )
    );
  });

const getAllAllowances = query
  .command('allowances <symbol> <owner>')
  .description('Query all token allowances', {
    symbol: '(symbol / AccAddress): token symbol or account address',
    owner: '(AccAddress) owner address',
  })
  .option('--start-after <string>', 'index of to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action(async (symbol: string, owner: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getAllAllowances(
        Parse.accAddress(owner),
        getAllAllowances.startAfter,
        Parse.int(getAllAllowances.limit)
      )
    );
  });

const getAllAccounts = query
  .command('accounts <symbol>')
  .description('Query all token accounts', {
    symbol: '(symbol / AccAddress): token symbol or account address',
  })
  .option('--start-after <string>', 'prefix to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action(async (symbol: string) => {
    await handleQueryCommand(query, mirror =>
      lookupTokenByAssetTokenOrAccAddress(mirror, symbol).getAllAccounts(
        getAllAccounts.startAfter,
        Parse.int(getAllAccounts.limit)
      )
    );
  });

export default {
  exec,
  query,
};
