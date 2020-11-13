import { Command } from 'commander';
import * as fs from 'fs';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('factory', 'Mirror Factory contract functions');

const distribute = exec.command('distribute').action(() => {
  handleExecCommand(exec, mirror => mirror.factory.distribute());
});

const updateConfig = exec
  .command('update-config')
  .description(`Update Mirror Factory config`)
  .option('--owner <string>', 'New owner address')
  .option('--token-code-id <int>', 'New CW20 token code ID')
  .option('--distribution-schedule <json>', 'New distribution schedule')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.factory.updateConfig({
        owner: updateConfig.owner,
        token_code_id: updateConfig.tokenCodeId,
        distribution_schedule: updateConfig.distributionSchedule,
      })
    );
  });

const postInitialize = exec
  .command(
    'post-initialize <owner> <terraswap> <mir-token> <staking> <oracle> <mint> <collector>'
  )
  .description('Post initialize', {
    owner: 'owner address',
    terraswap: 'Terrawap Factory contract address',
    'mir-token': 'MIR Token contract address',
    staking: 'Mirror Staking contract address',
    oracle: 'Mirror Oracle contract address',
    mint: 'Mirror Mint contract address',
    collector: 'Mirror Collector contract address',
  })
  .action(
    (
      owner: string,
      terraswap: string,
      mirToken: string,
      staking: string,
      oracle: string,
      mint: string,
      collector: string
    ) => {
      handleExecCommand(exec, mirror => {
        return mirror.factory.postInitialize(
          owner,
          terraswap,
          mirToken,
          staking,
          oracle,
          mint,
          collector
        );
      });
    }
  );

const whitelist = exec
  .command(
    'whitelist <name> <symbol> <oracle-feeder> <auction-discount> <min-col-ratio>'
  )
  .description(`Whitelist a new mAsset`, {
    name: '(string) Name of asset to be tracked (ex. Apple Inc. stock)',
    symbol: '(string) mAsset symbol (ex. mAAPL)',
    'oracle-feeder': '(AccAddress) Address of oracle feeder',
    'auction-discount': '(Dec) auction discount rate of mAsset',
    'min-col-ratio': '(Dec) min. collateral ratio of mAsset',
  })
  .action(
    (
      name: string,
      symbol: string,
      oracleFeeder: string,
      auctionDiscount: string,
      minColRatio: string
    ) => {
      handleExecCommand(exec, mirror =>
        mirror.factory.whitelist(name, symbol, oracleFeeder, {
          auction_discount: Parse.dec(auctionDiscount),
          min_collateral_ratio: Parse.dec(minColRatio),
        })
      );
    }
  );

const terraswapCreationHook = exec
  .command('terraswap-creation-hook <asset-token>')
  .description(`Terraswap Creation Hook`, {
    'asset-token': '(AccAddress) asset token',
  })
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.factory.terraswapCreationHook(assetToken)
    );
  });

const migrateAsset = exec
  .command('migrate-asset <name> <symbol> <from-token> <end-price>')
  .description(`Migrate an mAsset`, {
    name: '(string) name of asset to track',
    symbol: '(string) name of mAsset symbol',
    'from-token': '(AccAddress) token address',
    'end-price': '(Dec) end price',
  })
  .action(
    (name: string, symbol: string, fromToken: string, endPrice: string) => {
      handleExecCommand(exec, mirror =>
        mirror.factory.migrateAsset(name, symbol, fromToken, endPrice)
      );
    }
  );

const passCommand = exec
  .command('pass-command <contract-address> <msg>')
  .description(`Execute command as Mirror Factory`, {
    'contract-address': '(AccAddress) address of contract to call',
    msg: '(path) file containing message to execute on specified contract',
  })
  .action((contractAddress: string, msg: string) => {
    handleExecCommand(exec, mirror => {
      const fileData = fs.readFileSync(msg).toString();
      return mirror.factory.passCommand(contractAddress, JSON.parse(fileData));
    });
  });

const query = new Command('factory');
query.description('Mirror Factory contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Factory contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.factory.getConfig());
  });

const getDistributionInfo = query
  .command('distribution-info')
  .description('Query Mirror Factory distribution info')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.factory.getDistributionInfo());
  });

export default {
  exec,
  query,
};
