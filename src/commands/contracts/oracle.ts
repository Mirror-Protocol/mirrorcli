import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
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
        owner: Parse.accAddress(updateConfig.owner),
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
      mirror.oracle.registerAsset(
        Parse.assetTokenOrAccAddress(assetToken),
        Parse.accAddress(feeder)
      )
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

const query = createQueryMenu('oracle', 'Mirror Oracle contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Oracle contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.oracle.getConfig());
  });

const getFeeder = query
  .command('feeder <asset-token>')
  .description('Query oracle feeder for asset', {
    'asset-token': '(symbol / AccAddress) asset to get feeder for',
  })
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror =>
      mirror.oracle.getFeeder(Parse.assetTokenOrAccAddress(assetToken))
    );
  });

const getPrice = query
  .command('price <base-asset> [quote-asset]')
  .description('Query current price of base asset denominated in quote asset', {
    'base-asset': '(symbol / AccAddress) asset to get price of',
    'quote-asset':
      '(symbol / AccAddress | uusd): asset in which returned price should be denominated (default. uusd)',
  })
  .action((baseAsset: string, quoteAsset: string = 'uusd') => {
    if (quoteAsset !== 'uusd') {
      quoteAsset = Parse.assetTokenOrAccAddress(quoteAsset);
    }
    handleQueryCommand(query, mirror => {
      return mirror.oracle.getPrice(
        Parse.assetTokenOrAccAddress(baseAsset),
        quoteAsset
      );
    });
  });

const getPrices = query
  .command('prices')
  .description('Query current prices of all registered assets')
  .option('--start-after <string>', 'index of to start query')
  .option('--limit <int>', 'max number of results to receive')
  .action(() => {
    handleQueryCommand(query, mirror => {
      return mirror.oracle.getPrices(
        getPrices.startAfter,
        Parse.int(getPrices.limit)
      );
    });
  });

export default {
  exec,
  query,
};
