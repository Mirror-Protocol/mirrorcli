import { Command } from 'commander';

const exec = new Command('mirror-token');
exec.alias('MIR');
exec.description('Mirror Token (MIR) contract functions');
exec.command('open-position');

const query = new Command('mirror-token');
query.alias('MIR');
query.description('Mirror Token (MIR) contract queries');
query.command('config');

export default {
  exec,
  query,
};
