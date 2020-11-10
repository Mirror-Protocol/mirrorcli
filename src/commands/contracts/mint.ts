import { Command } from 'commander';

const exec = new Command('mint');
exec.description('Mirror Mint contract functions');
exec.command('open-position');

const query = new Command('mint');
query.description('Mirror Mint contract queries');
query.command('config');

export default {
  exec,
  query,
};