import { Command } from 'commander';

const exec = new Command('ts-pair');
exec.description('Terraswap Pair contract functions');
exec.command('open-position');

const query = new Command('ts-pair');
query.description('Terraswap Pair contract queries');
query.command('config');

export default {
  exec,
  query,
};
