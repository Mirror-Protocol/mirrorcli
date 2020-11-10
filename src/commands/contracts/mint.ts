import { Command } from 'commander';

import { parseAsset, parseAssetInfo, parseDec } from '../../util/parse-input';
import { createExecMenu } from '../../util/contract-menu';

const exec = createExecMenu('mint', 'Mirror Mint contract functions');

const updateConfig = exec
  .command('update-config')
  .description('Update the Mirror Mint contract configuration')
  .option('--owner <string>', 'New owner')
  .option('--token-code-id <int>', 'New Terraswap CW20 Token code ID');
const updateAsset = exec
  .command('update-asset <asset-token>')
  .description('Update a registered asset')
  .option('--auction-discount <float>', 'New auction discount')
  .option('--min-col-ratio <float>', 'New min. collateral ratio');
const registerAsset = exec
  .command('register-asset <asset-token> <auction-discount> <min-col-ratio>')
  .description('Register a new asset');
const registerMigration = exec
  .command('register-migration <asset-token> <end-price>')
  .description('Register a new migration');
const openPosition = exec
  .command('open-position <col> <asset> <col-ratio>')
  .description('Open a new collateralized debt position (CDP)', {
    col: '(Asset) initial collateral to deposit',
    asset: '(AssetInfo) asset to be minted by CDP',
    'col-ratio': '(Dec) initial collateral ratio',
  });
const deposit = exec
  .command('deposit <position-idx> <col>')
  .description('Deposit collateral to a CDP');
const withdraw = exec
  .command('withdraw <position-idx> <col>')
  .description('Withdraw collateral from a CDP');
const mint = exec
  .command('mint <position-idx> <asset>')
  .description('Mint more of an mAsset from a CDP');
const burn = exec
  .command('burn <position-idx> <asset>')
  .description('Burn mAsset tokens to deleverage CDP');
const auction = exec
  .command('auction <position-idx> <asset>')
  .description(`Liquidate a user's margin-called CDP`);

const query = new Command('mint');
query.description('Mirror Mint contract queries');
const getConfig = query.command('config').action(async () => {});

export default {
  exec,
  query,
};
