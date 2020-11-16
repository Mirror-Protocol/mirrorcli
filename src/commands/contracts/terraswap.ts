import { Command, parse } from 'commander';
import * as fs from 'fs';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import {
  Mirror,
  TerraswapFactory,
  TerraswapPair,
  TerraswapToken,
} from '@mirror-protocol/mirror.js';
import { config } from '../../util/config';
import { Coin } from '@terra-money/terra.js';

const exec = createExecMenu('terraswap', 'Terraswap contract functions');
exec.alias('ts');

// factory

const updateConfig = exec
  .command('update-config')
  .description(`Update Terraswap Factory contract config`)
  .option('--owner <string>', 'New contract owner')
  .option('--pair-code-id <int>', 'New pair code ID')
  .option('--token-code-id <int>', 'New token code ID')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.terraswapFactory.updateConfig({
        owner: updateConfig.owner,
        pair_code_id: updateConfig.pairCodeId,
        token_code_id: updateConfig.tokenCodeId,
      })
    );
  });

const createPair = exec
  .command('create-pair <asset1> <asset2>')
  .description(`Create new Terraswap pair`)
  .option('--hook <path>', 'File containing hook message to attach')
  .action((asset1: string, asset2: string) => {
    let hook: any;
    if (createPair.hook) {
      hook = JSON.parse(fs.readFileSync(createPair.hook).toString());
    }

    handleExecCommand(exec, mirror =>
      mirror.terraswapFactory.createPair(
        [Parse.assetInfo(asset1), Parse.assetInfo(asset2)],
        hook as TerraswapFactory.InitHook
      )
    );
  });

// pair

export function lookupPair(
  mirror: Mirror,
  fromAsset: string,
  toAsset: string
): TerraswapPair {
  let contractAddress;

  if (fromAsset !== 'uusd' && toAsset !== 'uusd') {
    throw new Error('at least FROM or TO must be uusd');
  }

  if (fromAsset === 'uusd') {
    contractAddress = config.assets[toAsset].pair;
  } else {
    contractAddress = config.assets[fromAsset].pair;
  }

  return new TerraswapPair({
    contractAddress,
    lcd: mirror.lcd,
    key: mirror.key,
  });
}

const swap = exec
  .command('swap <from-asset> <to-asset-info>')
  .description(`Swap one asset for another using Terraswap`, {
    'from-asset': '(Asset) asset to swap from, e.g. 1000uusd, 1000mAAPL',
    'to-asset-info': '(AssetInfo) asset to swap into, e.g. uusd, MIR',
  })
  .option(
    '--belief-price <Dec>',
    'Base used for calculating max spread using --max-spread option'
  )
  .option(
    '--max-spread <Dec>',
    'Max % spread for transaction (if exceeded, tx will fail)'
  )
  .option('--send-to <string>', 'Account to send swapped funds to')
  .action((fromAsset: string, toAssetInfo: string) => {
    handleExecCommand(exec, mirror => {
      const offer = Coin.fromString(fromAsset);
      const pair = lookupPair(mirror, offer.denom, toAssetInfo);

      return pair.swap(Parse.asset(fromAsset), {
        belief_price: swap.beliefPrice,
        max_spread: swap.maxSpread,
        to: swap.sendTo,
      });
    });
  });

const provideLiquidity = exec
  .command('provide-liquidity <asset1> <asset2>')
  .description(`Provide liquidity to a Terraswap pool`, {
    asset1: '(Asset) first side of liquidity pool e.g. 1000mAAPL',
    asset2: '(Asset) second side of liquidity pool e.g. 1000uusd',
  })
  .action((asset1: string, asset2: string) => {
    handleExecCommand(exec, mirror => {
      let denom1 = Coin.fromString(asset1).denom;
      let denom2 = Coin.fromString(asset2).denom;
      const pair = lookupPair(mirror, denom1, denom2);
      return pair.provideLiquidity([Parse.asset(asset1), Parse.asset(asset2)]);
    });
  });

const withdrawLiquidity = exec
  .command('withdraw-liquidity <asset-info> <amount>')
  .description(`Withdraw liquidity from a Terraswap pool`, {
    'asset-info':
      '(AssetInfo) liquidity pool from which to withdraw from e.g. mAAPL',
    amount: '(Uint128) amount of LP tokens to burn',
  })
  .action((assetInfo: string, amount: string) => {
    handleExecCommand(exec, mirror => {
      const pair = lookupPair(mirror, assetInfo, 'uusd');
      const lpToken = new TerraswapToken({
        contractAddress: config.assets[assetInfo].lpToken,
        lcd: mirror.lcd,
        key: mirror.key,
      });
      return pair.withdrawLiquidity(Parse.uint128(amount), lpToken);
    });
  });

const query = createQueryMenu('terraswap', 'Terraswap contract queries');
query.alias('ts');
const getConfig = query
  .command('config')
  .description('Query Terraswap Factory contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.terraswapFactory.getConfig());
  });

const getPair = query
  .command('pair <asset1> <asset2>')
  .description('Query Terraswap pair', {
    asset1: '(AssetInfo) native coin or CW20 address',
    asset2: '(AssetInfo) native coin or CW20 address',
  })
  .action((asset1: string, asset2: string) => {
    handleQueryCommand(query, mirror =>
      mirror.terraswapFactory.getPair([
        Parse.assetInfo(asset1),
        Parse.assetInfo(asset2),
      ])
    );
  });

const getPairs = query
  .command('pairs')
  .description('Query all Terraswap pairs')
  .option('--start-after <asset1> <asset2>', 'pair after which to begin query')
  .option('--limit <int>', 'max results to return')
  .action(() => {
    handleQueryCommand(query, mirror =>
      mirror.terraswapFactory.getPairs(getPairs.startAfter, getPairs.limit)
    );
  });

const getSimulateSwap = query
  .command('simulate-swap <from-asset> <to-asset>')
  .description('Simulate and determine swap price', {
    'from-asset':
      '(Asset / AssetInfo) asset to swap from, e.g. 1000uusd, 1000mAAPL',
    'to-asset': '(Asset / AssetInfo) asset to swap into, e.g. uusd, MIR',
  })
  .option('--reverse', 'Reverse simulation (calculate from-asset)')
  .action((fromAsset: string, toAsset: string) => {
    handleQueryCommand(query, mirror => {
      if (getSimulateSwap.reverse) {
        const askDenom = Coin.fromString(toAsset).denom;
        const pair = lookupPair(mirror, fromAsset, askDenom);
        return pair.getReverseSimulation(Parse.asset(toAsset));
      } else {
        const offerDenom = Coin.fromString(fromAsset).denom;
        const pair = lookupPair(mirror, offerDenom, toAsset);
        return pair.getSimulation(Parse.asset(fromAsset));
      }
    });
  });

export default {
  exec,
  query,
};
