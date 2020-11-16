import * as fs from 'fs';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
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
  .option('--owner <AccAddress>', 'New owner address')
  .option('--token-code-id <int>', 'New CW20 token code ID')
  .option('--distribution-schedule <json>', 'New distribution schedule')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.factory.updateConfig({
        owner: Parse.accAddress(updateConfig.owner),
        token_code_id: updateConfig.tokenCodeId,
        // TODO: fix
        distribution_schedule: updateConfig.distributionSchedule,
      })
    );
  });

const postInitialize = exec
  .command('post-initialize')
  .description('Set contract addresses after initialization')
  .requiredOption('--owner <AccAddress>', '*owner address')
  .requiredOption('--terraswap <AccAddress>', '*Terraswap Factory address')
  .requiredOption('--mir-token <AccAddress>', '*MIR Token contract address')
  .requiredOption('--staking <AccAddress>', '*Mirror Staking contract address')
  .requiredOption('--oracle <AccAddress>', '*Mirror Oracle contract address')
  .requiredOption('--mint <AccAddress>', '*Mirror Mint contract address')
  .requiredOption(
    '--collector <AccAddress>',
    '*Mirror Collector contract address'
  )
  .action(() => {
    handleExecCommand(exec, mirror => {
      return mirror.factory.postInitialize(
        Parse.accAddress(postInitialize.owner),
        Parse.accAddress(postInitialize.terraswap),
        Parse.accAddress(postInitialize.mirToken),
        Parse.accAddress(postInitialize.staking),
        Parse.accAddress(postInitialize.oracle),
        Parse.accAddress(postInitialize.mint),
        Parse.accAddress(postInitialize.collector)
      );
    });
  });

const whitelist = exec
  .command('whitelist')
  .description(`Whitelist a new mAsset`)
  .requiredOption(
    '--asset-name <string>',
    '*Name of asset to be tracked (ex. Apple Inc. stock)'
  )
  .requiredOption('--symbol <string>', '*mAsset symbol (ex. mAAPL)')
  .requiredOption('--feeder <AccAddress>', '*Address of oracle feeder')
  .requiredOption(
    '--auction-discount <Dec>',
    '*auction discount rate of mAsset'
  )
  .requiredOption('--min-col-ratio <Dec>', '*min. collateral ratio of mAsset')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.factory.whitelist(
        whitelist.assetName,
        whitelist.symbol,
        Parse.accAddress(whitelist.feeder),
        {
          auction_discount: Parse.dec(whitelist.auctionDiscount),
          min_collateral_ratio: Parse.dec(whitelist.minColRatio),
        }
      )
    );
  });

const terraswapCreationHook = exec
  .command('terraswap-creation-hook <mir-token>')
  .description(`Terraswap Creation Hook for bootstrapping Mirror Token`, {
    'mir-token': '(symbol / AccAddress) MIR Token address',
  })
  .action((mirToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.factory.terraswapCreationHook(
        Parse.assetTokenOrAccAddress(mirToken)
      )
    );
  });

const migrateAsset = exec
  .command('migrate-asset')
  .description(`Migrate an mAsset`)
  .requiredOption(
    '--asset-name <string>',
    '*Name of asset to be tracked (ex. Apple Inc. stock)'
  )
  .requiredOption('--symbol <string>', '*mAsset symbol (ex. mAAPL)')
  .requiredOption('--from-token <symbol / AccAddress>', '*token address')
  .requiredOption('--end-price <Dec>', '*end price for asset')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.factory.migrateAsset(
        migrateAsset.assetName,
        migrateAsset.symbol,
        Parse.assetTokenOrAccAddress(migrateAsset.fromToken),
        Parse.dec(migrateAsset.endPrice)
      )
    );
  });

const passCommand = exec
  .command('pass-command <contract-address> <msg>')
  .description(`Execute command as Mirror Factory`, {
    'contract-address': '(AccAddress) address of contract to call',
    msg: '(path) file containing message to execute on specified contract',
  })
  .action((contractAddress: string, msg: string) => {
    handleExecCommand(exec, mirror => {
      const fileData = fs.readFileSync(msg).toString();
      return mirror.factory.passCommand(
        Parse.accAddress(contractAddress),
        JSON.parse(fileData)
      );
    });
  });

const query = createQueryMenu('factory', 'Mirror Factory contract queries');
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
