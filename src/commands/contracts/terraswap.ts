import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu(
  'terraswap',
  'Terraswap Factory contract functions'
);

const convert = exec
  .command('convert <asset-token>')
  .description(`Convert contract's balance of asset to UST or MIR`, {
    'asset-token': '(AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror => mirror.terraswapFactory.createPair());
  });

const send = exec
  .command('send')
  .description(
    `Sends contract's balance of MIR to distribution (Mirror Gov) contract`
  )
  .action(() => {
    handleExecCommand(exec, mirror => mirror.collector.send());
  });

const query = new Command('terraswap');
query.description('Terraswap Factory contract queries');
const getConfig = query
  .command('config')
  .description('Query Terraswap Factory contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.terraswapFactory.getConfig());
  });

const getPair = query
  .command('pair <asset1> <asset2>')
  .description('Query Terraswap pair')
  .action((asset1: string, asset2: string) => {
    handleQueryCommand(query, mirror =>
      mirror.terraswapFactory.getPair([asset1, asset2])
    );
  });

const getPairs = query
  .command('pairs')
  .description('Query all Terraswap pairs')
  .option('--start-after <asset1> <asset2>', 'pair after which to begin query')
  .option('--limit <int>', 'max results to return')
  .action((asset1: string, asset2: string) => {
    handleQueryCommand(query, mirror =>
      mirror.terraswapFactory.getPairs(getPairs.startAfter, getPairs.limit)
    );
  });

export default {
  exec,
  query,
};
