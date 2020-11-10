import { Command } from 'commander';
import { Dec } from '@terra-money/terra.js';
const jsome = require('jsome');

import { parseAsset, parseAssetInfo } from '../../parse-input';
import { getMirrorClient, getLCDClient } from '../../client';

const exec = new Command('mint');
exec.description('Mirror Mint contract functions');
exec.requiredOption('--from <keyname>', 'name of key in terracli keyring');
exec.option('--generate-only', 'create just the transaction');

const openPosition = exec
  .command('open-position <col> <asset> <col_ratio>')
  .description('Open a new collateralized debt position (CDP)', {
    col: 'initial collateral to deposit',
    asset: 'asset to be minted by CDP',
    col_ratio: 'initial collateral ratio',
  })
  .action(async (col: string, asset: string, col_ratio: string) => {
    const mirror = getMirrorClient(exec.from);
    if (exec.generateOnly) {
      const wallet = mirror.mint.lcd.wallet(mirror.mint.key);
      jsome(
        (
          await wallet.createTx({
            msgs: [
              mirror.mint.openPosition(
                parseAsset(col),
                parseAssetInfo(asset),
                new Dec(col_ratio)
              ),
            ],
          })
        ).toData()
      );
    }
  });

const query = new Command('mint');
query.description('Mirror Mint contract queries');

const getConfig = query.command('config').action(async () => {
  const mirror = getMirrorClient();
  jsome(await mirror.mint.getConfig());
});

export default {
  exec,
  query,
};
