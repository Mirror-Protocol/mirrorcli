import { Command } from 'commander';

import { parseAsset, parseAssetInfo, parseDec } from '../../util/parse-input';
import { createExecMenu, handleExecCommand } from '../../util/contract-menu';

const exec = createExecMenu('collector', 'Mirror Collector contract functions');

const convert = exec
  .command('convert <asset-token>')
  .description(`Convert contract's balance of asset to UST or MIR`, {
    'asset-token': '(AccAddr) mAsset or MIR token',
  })
  .action(async (assetToken: string) => {
    handleExecCommand(exec, mirror => mirror.collector.convert(assetToken));
  });

const send = exec
  .command('send')
  .description(
    `Sends contract's balance of MIR to distribution (Mirror Gov) contract`
  );

const query = new Command('collector');
query.description('Mirror Collector contract queries');
const getConfig = query.command('config').action(async () => {});

export default {
  exec,
  query,
};
