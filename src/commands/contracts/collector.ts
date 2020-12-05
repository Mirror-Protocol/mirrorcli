import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('collector', 'Mirror Collector contract functions');

const convert = exec
  .command('convert <asset-token>')
  .description(`Convert contract's balance of asset to UST or MIR`, {
    'asset-token': '(symbol / AccAddress) mAsset or MIR token',
  })
  .action(async (assetToken: string) => {
    await handleExecCommand(exec, async mirror =>
      mirror.collector.convert(Parse.assetTokenOrAccAddress(assetToken))
    );
  });

const send = exec
  .command('send')
  .description(
    `Sends contract's balance of MIR to distribution (Mirror Gov) contract`
  )
  .action(async () => {
    await handleExecCommand(exec, async mirror => mirror.collector.send());
  });

const query = createQueryMenu('collector', 'Mirror Collector contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Collector contract config')
  .action(async () => {
    await handleQueryCommand(query, async mirror =>
      mirror.collector.getConfig()
    );
  });

export default {
  exec,
  query,
};
