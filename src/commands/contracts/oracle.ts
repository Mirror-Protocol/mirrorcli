import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('oracle', 'Mirror Oracle contract functions');

const updateConfig = exec
  .command('update-config')
  .description(`Update Mint Oracle contract config`)
  .option('--owner <string>', 'New owner address')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.oracle.updateConfig({
        owner: updateConfig.owner,
      })
    );
  });

const registerAsset = exec
  .command('register-asset <asset-token> <feeder>')
  .description(`Register new asset to be tracked`, {
    'asset-token': '(AccAddress) token address for asset',
    feeder: '(AccAddress) oracle feeder',
  })
  .action((assetToken: string, feeder: string) => {
    handleExecCommand(exec, mirror =>
      mirror.oracle.registerAsset(assetToken, feeder)
    );
  });

const feedPrice = exec
  .command('feed-price <...prices>')
  .description(`Report price to the oracle`, {
    '...prices': 'price information as list, ex: mAAPL:1232232 mNFLX:12321992',
  })
  .action((...args: any[]) => {
    args = args[1].args;
    const prices = Parse.prices(args);
    handleExecCommand(exec, mirror => mirror.oracle.feedPrice(prices));
  });

const query = new Command('oracle');
query.description('Mirror Oracle contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Oracle contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.oracle.getConfig());
  });

const getFeeder = query
  .command('feeder <asset-token>')
  .description('Query oracle feeder for asset', {
    'asset-token': '(AccAddress) contract address to use',
  })
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror => mirror.oracle.getFeeder(assetToken));
  });

const getPrice = query
  .command('price <base-asset> [quote-asset]')
  .description('Query current price of base asset denominated in quote asset', {
    'base-asset': '(AccAddress) asset to get price of',
    'quote-asset':
      '(AccAddress | uusd): asset in which returned price should be denominated (default. uusd)',
  })
  .action((baseAsset: string, quoteAsset?: string) => {
    handleQueryCommand(query, mirror => {
      return mirror.oracle.getPrice(baseAsset, quoteAsset || 'uusd');
    });
  });

const getPrices = query
  .command('prices')
  .description('Query current prices of all registered assets')
  .option('--start-after <int>', 'index of to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action(() => {
    handleQueryCommand(query, mirror => {
      return mirror.oracle.getPrices(getPrices.startAfter, getPrices.limit);
    });
  });

export default {
  exec,
  query,
};
