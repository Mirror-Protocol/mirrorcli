import { Command } from 'commander';
import { parseAsset } from '../../parse-input';
import { getClient } from '../../client';

const exec = new Command('mint');
exec.description('Mirror Mint contract functions');
exec.option('--from <keyname>', 'use this key');

const openPosition = exec
  .command('open-position <col> <asset> <col_ratio> [col_token]')
  .description('Open a new collateralized debt position (CDP)', {
    col: 'initial collateral to deposit',
    asset: 'asset to be minted by CDP',
    col_ratio: 'initial collateral ratio',
    col_token: 'collateral token',
  })
  .action((_col: string, _asset: string, __: string, _: string) => {
    const client = getClient(exec.from);
    console.log(client);
  });

const query = new Command('mint');
query.description('Mirror Mint contract queries');
query.command('config');

export default {
  exec,
  query,
};
