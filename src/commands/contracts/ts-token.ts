import { Command } from 'commander';

const exec = new Command('ts-token');
exec.description('Terraswap Token contract functions');
exec.command('open-position');

const query = new Command('ts-token');
query.description('Terraswap Token contract queries');
query.command('config');

export default {
  exec,
  query,
};
