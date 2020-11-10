import { Command } from 'commander';

const exec = new Command('mint');
exec.command('open-position');

const query = new Command('mint');
query.command('config');

export default {
  exec,
  query,
};
