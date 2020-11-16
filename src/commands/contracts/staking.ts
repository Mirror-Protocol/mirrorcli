import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { TerraswapToken } from '@mirror-protocol/mirror.js';

const exec = createExecMenu('staking', 'Mirror Staking contract functions');

const registerAsset = exec
  .command('register-asset <asset-token> <staking-token>')
  .description('Register asset with Mirror Staking contract', {
    'asset-token': '(symbol / AccAddress) mAsset or MIR token',
    'staking-token': '(AccAddress) Associated LP token',
  })
  .action((assetToken: string, stakingToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.registerAsset(
        Parse.assetTokenOrAccAddress(assetToken),
        Parse.accAddress(stakingToken)
      )
    );
  });

const updateConfig = exec
  .command('update-config')
  .option('--owner <string>', 'New owner address')
  .description('Update Mirror Staking contract config')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.staking.updateConfig({
        // owner: updateConfig.owner,
      })
    );
  });

const bond = exec
  .command('bond <asset-token> <amount> [lp-token]')
  .description('Stakes LP token for asset', {
    'asset-token': '(symbol) mAsset or MIR token',
    amount: '(Uint128) amount of LP token to bond',
    'lp-token': '(AccAddress) LP Token address',
  })
  .action((assetToken: string, amount: string, lpToken?: string) => {
    handleExecCommand(exec, mirror => {
      let lpTokenInstance;
      if (lpToken !== undefined) {
        lpTokenInstance = new TerraswapToken({
          contractAddress: Parse.accAddress(lpToken),
          lcd: mirror.lcd,
          key: mirror.key,
        });
      } else {
        lpTokenInstance = new TerraswapToken({
          contractAddress: Parse.assetConfig(assetToken).lpToken,
          lcd: mirror.lcd,
          key: mirror.key,
        });
      }
      return mirror.staking.bond(
        Parse.assetTokenOrAccAddress(assetToken),
        Parse.uint128(amount),
        lpTokenInstance
      );
    });
  });

const withdraw = exec
  .command('withdraw <asset-token>')
  .description('Withdraw asset from Mirror Staking contract', {
    'asset-token': '(symbol / AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.withdraw(Parse.assetTokenOrAccAddress(assetToken))
    );
  });

const depositReward = exec
  .command('deposit-reward <asset-token>')
  .description(`Adds MIR tokens to the rewards for the asset's staking pool`, {
    'asset-token': '(symbol / AccAddress) address of staking pool to reward',
    amount: '(Uint128) amount of MIR token to deposit',
  })
  .action((assetToken: string, amount: string) => {
    handleExecCommand(exec, mirror => {
      return mirror.staking.depositReward(
        Parse.assetTokenOrAccAddress(assetToken),
        Parse.uint128(amount),
        mirror.mirrorToken
      );
    });
  });

const unbond = exec
  .command('unbond <asset-token> <amount>')
  .description(`Unstakes LP tokens from staking pool`, {
    'asset-token': '(symbol / AccAddress) mAsset or MIR token',
    amount: '(Uint128) amount of LP tokens to unbond',
  })
  .action((assetToken: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.unbond(Parse.assetTokenOrAccAddress(assetToken), amount)
    );
  });

const query = createQueryMenu('staking', 'Mirror Staking contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Staking contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.staking.getConfig());
  });

const getPoolInfo = query
  .command('pool-info <asset-token>')
  .description('Query Mirror Staking pool info', {
    'asset-token': '(symbol / AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror =>
      mirror.staking.getPoolInfo(Parse.assetTokenOrAccAddress(assetToken))
    );
  });

const getRewardInfo = query
  .command('reward-info <staker> [asset-token]')
  .description('Query reward info for staker', {
    staker: '(AccAddress) staker for whom to query rewards',
    'asset-token':
      '(symbol / AccAddress) mAsset or MIR token. If empty, returns all rewards.',
  })
  .action((staker: string, assetToken?: string) => {
    handleQueryCommand(query, mirror =>
      mirror.staking.getRewardInfo(
        staker,
        Parse.assetTokenOrAccAddress(assetToken)
      )
    );
  });

export default {
  exec,
  query,
};
