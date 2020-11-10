import { Command } from 'commander';
import { loadConfig } from '../../config';

const exec = new Command('mint');
exec.description('Mirror Mint contract functions');
exec.command('open-position').action(() => {
  console.log(loadConfig());
  console.log('oh no!');
});

const query = new Command('mint');
query.description('Mirror Mint contract queries');
query.command('config');

export default {
  exec,
  query,
};
