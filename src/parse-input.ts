import { Asset, AssetInfo } from '@mirror-protocol/mirror.js';
import { Coin } from '@terra-money/terra.js';

import { config } from './config';

export function parseAsset(input: string): Asset {
  if (input.endsWith('uusd')) {
    const c = Coin.fromString(input).toIntCoin();
    return {
      info: {
        native_token: {
          denom: 'uusd',
        },
      },
      amount: c.amount.toString(),
    };
  } else {
    return {
      info: {
        token: {
          contract_addr: 'terra1',
        },
      },
      amount: '10000',
    };
  }
}

export function parseAssetInfo(input: string): AssetInfo {
  if (input === 'uusd') {
    return {
      native_token: {
        denom: 'uusd',
      },
    };
  } else {
    return {
      token: {
        contract_addr: 'terra1...',
      },
    };
  }
}
