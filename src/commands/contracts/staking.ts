import { Command } from 'commander';

const exec = new Command('staking');
exec.description('Mirror Staking contract functions');
exec.command('open-position');

const query = new Command('staking');
query.description('Mirror Staking contract queries');
query.command('config');

export default {
  exec,
  query,
};
