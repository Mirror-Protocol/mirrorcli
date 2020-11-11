import { Asset, AssetInfo } from '@mirror-protocol/mirror.js';
import { Dec } from '@terra-money/terra.js';

import { config } from './config';

export type InputParser<T> = (input: string) => T;

export function parseDec(input: string): Dec {
  return new Dec(input);
}

export function parseAsset(input: string): Asset<AssetInfo> {
  const matches = input.match(/([0-9]+)(u[a-z]{3}|m[a-zA-Z]+|MIR)/);
  if (matches === null) {
    throw new Error(
      `unable to parse Asset from '${input}'; must be like: 123uusd (native), 123mAAPL (mAsset), 123MIR (Mirror Token)`
    );
  }

  if (matches[2].startsWith('u')) {
    return {
      info: {
        native_token: {
          denom: matches[2],
        },
      },
      amount: matches[1],
    };
  } else if (matches[2] in config.assets) {
    return {
      info: {
        token: {
          contract_addr: config.assets[matches[2]].token,
        },
      },
      amount: matches[1],
    };
  } else {
    throw new Error(
      `could not find asset '${matches[2]}' -- please register it in your config file.`
    );
  }
}

export function parseAssetInfo(input: string): AssetInfo {
  if (input.match(/^(u[a-z]{3}|m[a-zA-Z]+|MIR)$/) === null) {
    throw new Error(
      `unable to parse AssetInfo from '${input}'; must be native (uusd), mAsset (mAPPL), or MIR (Mirror Token)`
    );
  }

  if (input.startsWith('u')) {
    return {
      native_token: {
        denom: input,
      },
    };
  } else if (input in config.assets) {
    return {
      token: {
        contract_addr: config.assets[input].token,
      },
    };
  } else {
    throw new Error(
      `could not find asset '${input}' -- please register it in your config file.`
    );
  }
}