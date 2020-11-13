import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('collector', 'Mirror Collector contract functions');

const convert = exec
  .command('convert <asset-token>')
  .description(`Convert contract's balance of asset to UST or MIR`, {
    'asset-token': '(AccAddress) mAsset or MIR token',
  })
  .action((assetToken: string) => {
    handleExecCommand(exec, mirror => mirror.collector.convert(assetToken));
  });

const send = exec
  .command('send')
  .description(
    `Sends contract's balance of MIR to distribution (Mirror Gov) contract`
  )
  .action(() => {
    handleExecCommand(exec, mirror => mirror.collector.send());
  });

const query = new Command('collector');
query.description('Mirror Collector contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Collector contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.collector.getConfig());
  });

export default {
  exec,
  query,
};
