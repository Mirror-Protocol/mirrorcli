import { Asset, Token } from '@mirror-protocol/mirror.js';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('mint', 'Mirror Mint contract functions');

const updateConfig = exec
  .command('update-config')
  .description('Update the Mirror Mint contract configuration')
  .option('--owner <AccAddress>', 'New owner')
  .option('--token-code-id <int>', 'New Terraswap CW20 Token code ID')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.mint.updateConfig({
        owner: Parse.accAddress(updateConfig.owner),
        token_code_id: Parse.int(updateConfig.tokenCodeId),
      })
    );
  });

const updateAsset = exec
  .command('update-asset <asset-token>')
  .description('Update a registered asset', {
    'asset-token': '(symbol / AccAddress) asset to update',
  })
  .option('--auction-discount <Dec>', 'New auction discount')
  .option('--min-col-ratio <Dec>', 'New min. collateral ratio')
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.updateAsset(
        Parse.assetTokenOrAccAddress(assetToken),
        Parse.dec(updateAsset.auctionDiscount),
        Parse.dec(updateAsset.minColRatio)
      )
    );
  });

const registerAsset = exec
  .command('register-asset')
  .requiredOption('--asset <symbol/AccAddress>', '*Address of mAsset token')
  .requiredOption('--auction-discount <Dec>', '*Auction discount rate')
  .requiredOption('--min-col-ratio <Dec>', '*Min. collateral ratio')
  .description('Register a new asset')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.mint.registerAsset(
        Parse.accAddress(registerAsset.asset),
        Parse.dec(registerAsset.auctionDiscount),
        Parse.dec(registerAsset.minColRatio)
      )
    );
  });

const registerMigration = exec
  .command('register-migration <asset-token> <end-price>')
  .description('Register a new migration');

const openPosition = exec
  .command('open-position')
  .description('Open a new collateralized debt position (CDP)')
  .requiredOption(
    '--collateral <Asset>',
    '*Initial collateral to deposit, e.g. 100000uusd'
  )
  .requiredOption(
    '--asset <symbol / AccAddress>',
    '*Asset to be minted by CDP, e.g. mAAPL'
  )
  .requiredOption('--col-ratio <Dec>', '*initial collateral ratio to use')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.mint.openPosition(
        Parse.asset(openPosition.collateral),
        Parse.assetInfo(Parse.assetTokenOrAccAddress(openPosition.asset)),
        Parse.dec(openPosition.colRatio)
      )
    );
  });

const deposit = exec
  .command('deposit <position-idx> <col>')
  .description('Deposit collateral to a CDP', {
    'position-idx': '(Uint128) position index',
    col: '(Asset) collateral to deposit',
  })
  .action((positionIdx: string, col: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.deposit(Parse.uint128(positionIdx), Parse.asset(col))
    );
  });

const withdraw = exec
  .command('withdraw <position-idx> <col>')
  .description('Withdraw collateral from a CDP', {
    'position-idx': '(Uint128) position index',
    col: '(Asset) collateral to withdraw',
  })
  .action((positionIdx: string, col: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.withdraw(Parse.uint128(positionIdx), Parse.asset(col))
    );
  });
const mint = exec
  .command('mint <position-idx> <asset>')
  .description('Mint more of an mAsset from a CDP', {
    'position-idx': '(Uint128) position index',
    asset: '(Asset) new mAsset tokens to mint',
  })
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.mint(
        Parse.uint128(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });
const burn = exec
  .command('burn <position-idx> <asset>')
  .description('Burn mAsset tokens to deleverage CDP', {
    'position-idx': '(Uint128) position index',
    asset: '(Asset) mAsset tokens to burn',
  })
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.burn(
        Parse.uint128(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });
const auction = exec
  .command('auction <position-idx> <asset>')
  .description(`Liquidate a user's margin-called CDP`, {
    'position-idx': '(Uint128) position index',
    asset: '(Asset) amount to liquidate',
  })
  .action((positionIdx: string, asset: string) => {
    handleExecCommand(exec, mirror =>
      mirror.mint.auction(
        Parse.uint128(positionIdx),
        Parse.asset(asset) as Asset<Token>
      )
    );
  });

const query = createQueryMenu('mint', 'Mirror Mint contract queries');
const getConfig = query
  .command('config')
  .description("Query the Mirror Mint contract's config")
  .action(() => {
    handleQueryCommand(query, mirror => mirror.mint.getConfig());
  });

const getAssetConfig = query
  .command('asset-config <asset-token>')
  .description('Query Asset configuration', {
    'asset-token': '(symbol / AccAdddress) asset to look up',
  })
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mint.getAssetConfig(Parse.assetTokenOrAccAddress(assetToken))
    );
  });

const getPosition = query
  .command('position <postition-idx>')
  .description('Query individual CDP', {
    'position-idx': '(Uint128) position index',
  })
  .action((positionIdx: string) => {
    handleQueryCommand(query, mirror =>
      mirror.mint.getPosition(Parse.uint128(positionIdx))
    );
  });

const getPositions = query
  .command('positions')
  .option('--owner <AccAddress>', 'Owner address')
  .option('--start-after <Uint128>', 'Position index to start querying from')
  .option('--limit <int>', 'Max number of entries returned')
  .description('Query all CDPs')
  .action(() => {
    handleQueryCommand(query, mirror =>
      mirror.mint.getPositions(
        Parse.accAddress(getPositions.owner),
        Parse.uint128(getPositions.startAfter),
        Parse.int(getPositions.limit)
      )
    );
  });

export default {
  exec,
  query,
};
