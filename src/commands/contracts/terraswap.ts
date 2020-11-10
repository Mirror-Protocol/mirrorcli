import { Command } from 'commander';

const exec = new Command('terraswap');
exec.description('Terraswap Factory contract functions');
exec.command('open-position');

const query = new Command('terraswap');
query.description('Terraswap Factory contract queries');
query.command('config');

export default {
  exec,
  query,
};
