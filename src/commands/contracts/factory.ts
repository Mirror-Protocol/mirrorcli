import { Command } from 'commander';

const exec = new Command('factory');
exec.description('Mirror Factory contract functions');
exec.command('open-position');

const query = new Command('factory');
query.description('Mirror Factory contract queries');
query.command('config');

export default {
  exec,
  query,
};
