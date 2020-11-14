import { Command } from 'commander';
import * as fs from 'fs';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { TerraswapFactory } from '@mirror-protocol/mirror.js';

const exec = createExecMenu(
  'terraswap',
  'Terraswap Factory contract functions'
);

const updateConfig = exec
  .command('update-config')
  .description(`Update Terraswap Factory contract config`)
  .option('--owner <string>', 'New contract owner')
  .option('--pair-code-id <int>', 'New pair code ID')
  .option('--token-code-id <int>', 'New token code ID')
  .action(() => {
    handleExecCommand(exec, mirror =>
      mirror.terraswapFactory.updateConfig({
        owner: updateConfig.owner,
        pair_code_id: updateConfig.pairCodeId,
        token_code_id: updateConfig.tokenCodeId,
      })
    );
  });

const createPair = exec
  .command('create-pair <asset1> <asset2>')
  .description(`Create new Terraswap pair`)
  .option('--hook <path>', 'File containing hook message to attach')
  .action((asset1: string, asset2: string) => {
    let hook: any;
    if (createPair.hook) {
      hook = JSON.parse(fs.readFileSync(createPair.hook).toString());
    }

    handleExecCommand(exec, mirror =>
      mirror.terraswapFactory.createPair(
        [Parse.assetInfo(asset1), Parse.assetInfo(asset2)],
        hook as TerraswapFactory.InitHook
      )
    );
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
