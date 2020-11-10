import { Command } from 'commander';

const exec = new Command('oracle');
exec.description('Mirror Oracle contract functions');
exec.command('open-position');

const query = new Command('oracle');
query.description('Mirror Oracle contract queries');
query.command('config');

export default {
  exec,
  query,
};
