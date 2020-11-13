import { Command } from 'commander';
import { Asset, Token } from '@mirror-protocol/mirror.js';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('mint', 'Mirror Mint contract functions');

const updateConfig = exec
  .command('update-config')
  .description('Update the Mirror Mint contract configuration')
  .option('--owner <string>', 'New owner')
  .option('--token-code-id <int>', 'New Terraswap CW20 Token code ID')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.mint.updateConfig({
        owner: updateConfig.owner,
        token_code_id: updateConfig.tokenCodeId,
      })
    );
  });

const updateAsset = exec
  .command('update-asset <asset-token>')
  .description('Update a registered asset')
  .option('--auction-discount <float>', 'New auction discount')
  .option('--min-col-ratio <float>', 'New min. collateral ratio')
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.updateAsset(
        assetToken,
        Parse.dec(updateAsset.auctionDiscount),
        Parse.dec(updateAsset.minColRatio)
      )
    );
  });
const registerAsset = exec
  .command('register-asset <asset-token> <auction-discount> <min-col-ratio>')
  .description('Register a new asset', {
    'asset-token': '(AccAddress) Address of token contract',
    'auction-discount': '(Dec) Auction discount rate',
    'min-col-ratio': '(Dec) Min. collateral ratio',
  })
  .action(
    (assetToken: string, auctionDiscount: string, minColRatio: string) => {
      handleExecCommand(exec, mirror =>
        mirror.mint.registerAsset(
          assetToken,
          Parse.dec(auctionDiscount),
          Parse.dec(minColRatio)
        )
      );
    }
  );

const registerMigration = exec
  .command('register-migration <asset-token> <end-price>')
  .description('Register a new migration');
const openPosition = exec
  .command('open-position <col> <asset> <col-ratio>')
  .description('Open a new collateralized debt position (CDP)', {
    col: '(Asset) initial collateral to deposit',
    asset: '(AssetInfo) asset to be minted by CDP',
    'col-ratio': '(Dec) initial collateral ratio',
  })
  .action((col: string, asset: string, colRatio: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.openPosition(
        Parse.asset(col),
        Parse.assetInfo(asset),
        Parse.dec(colRatio)
      )
    );
  });
const deposit = exec
  .command('deposit <position-idx> <col>')
  .description('Deposit collateral to a CDP')
  .action((positionIdx: string, col: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.deposit(Parse.int(positionIdx), Parse.asset(col))
    );
  });
const withdraw = exec
  .command('withdraw <position-idx> <col>')
  .description('Withdraw collateral from a CDP')
  .action((positionIdx: string, col: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.withdraw(Parse.int(positionIdx), Parse.asset(col))
    );
  });
const mint = exec
  .command('mint <position-idx> <asset>')
  .description('Mint more of an mAsset from a CDP')
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.mint(
        Parse.int(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });
const burn = exec
  .command('burn <position-idx> <asset>')
  .description('Burn mAsset tokens to deleverage CDP')
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.burn(
        Parse.int(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });
const auction = exec
  .command('auction <position-idx> <asset>')
  .description(`Liquidate a user's margin-called CDP`)
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.auction(
        Parse.int(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });

const query = new Command('mint');
query.description('Mirror Mint contract queries');
const getConfig = query
  .command('config')
  .description("Query the Mirror Mint contract's config")
  .action(() => {
    handleQueryCommand(query, mirror => mirror.mint.getConfig());
  });

const getAssetConfig = query
  .command('asset-config <asset-token>')
  .description('Query Asset configuration')
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror => mirror.mint.getAssetConfig(assetToken));
  });

const getPosition = query
  .command('position <postition-idx>')
  .description('Query individual CDP')
  .action((positionIdx: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mint.getPosition(Parse.int(positionIdx))
    );
  });

const getPositions = query
  .command('positions')
  .option('--owner <string>', 'Owner address')
  .option('--start-after <int>', 'Position index to start querying from')
  .option('--limit <int>', 'Max number of entries returned')
  .description('Query all CDPs')
  .action(() => {
    handleQueryCommand(query, mirror =>
      mirror.mint.getPositions(
        getPositions.owner,
        getPositions.startAfter,
        getPositions.limit
      )
    );
  });

export default {
  exec,
  query,
};
