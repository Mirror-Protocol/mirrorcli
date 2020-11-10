import { Command } from 'commander';

const exec = new Command('collector');
exec.description('Mirror Gov contract functions');
exec.command('open-position');

const query = new Command('collector');
query.description('Mirror Gov contract queries');
query.command('config');

export default {
  exec,
  query,
};
