import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { TerraswapToken } from '@mirror-protocol/mirror.js';

const exec = createExecMenu('staking', 'Mirror Staking contract functions');

const registerAsset = exec
  .command('register-asset <asset-token> <staking-token>')
  .description('Register asset with Mirror Staking contract', {
    'asset-token': '(AccAddress) mAsset or MIR token',
    'staking-token': '(AccAddress) Associated LP token',
  })
  .action((assetToken: string, stakingToken: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.registerAsset(assetToken, stakingToken)
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
  .command('bond <asset-token> <amount>')
  .description('Stakes LP token for asset', {
    'asset-token': '(AccAddress) mAsset or MIR token',
    amount: '(Uint128) amount of LP token to bond',
  })
  .action((assetToken: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.bond(assetToken, amount, new TerraswapToken({}))
    );
  });

const withdraw = exec
  .command('withdraw <asset-token>')
  .description('Withdraw asset from Mirror Staking contract', {
    'asset-token': '(AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror => mirror.staking.withdraw(assetToken));
  });

const depositReward = exec
  .command('deposit-reward <asset-token>')
  .description(`Adds MIR tokens to the rewards for the asset's staking pool`, {
    'asset-token': '(AccAddress) address of staking pool to reward',
    amount: '(Uint128) amount of MIR token to deposit',
  })
  .action((assetToken: string, amount: string) => {
    handleExecCommand(exec, mirror => {
      return mirror.staking.depositReward(
        assetToken,
        amount,
        mirror.mirrorToken
      );
    });
  });

const unbond = exec
  .command('unbond <asset-token> <amount>')
  .description(`Unstakes LP tokens from staking pool`, {
    'asset-token': '(AccAddress) mAsset or MIR token',
    amount: '(Uint128) amount of LP tokens to unbond',
  })
  .action((assetToken: string, amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.staking.unbond(assetToken, amount)
    );
  });

const query = new Command('staking');
query.description('Mirror staking contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Staking contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.staking.getConfig());
  });

const getPoolInfo = query
  .command('pool-info <asset-token>')
  .description('Query Mirror Staking pool info', {
    'asset-token': '(AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleQueryCommand(query, mirror => mirror.staking.getPoolInfo(assetToken));
  });

const getRewardInfo = query
  .command('reward-info <staker> [asset-token]')
  .description('Query reward info for staker', {
    staker: '(AccAddress) staker for whom to query rewards',
    'asset-token':
      '(AccAddress) mAsset or MIR token. If empty, returns all rewards.',
  })
  .action((staker: string, assetToken?: string) => {
    handleQueryCommand(query, mirror =>
      mirror.staking.getRewardInfo(staker, assetToken)
    );
  });

export default {
  exec,
  query,
};
