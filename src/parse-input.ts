import { Asset, AssetInfo } from '@mirror-protocol/mirror.js';

import { config } from './config';

export function parseAsset(input: string): Asset {
  const matches = input.match(/([0-9]+)(u[a-z]{3}|m[a-zA-Z]+|MIR)/);
  if (!matches) {
    throw new Error(
      `unable to parse asset string: '${input}', must match: /([0-9]+)(u[a-z]{3}|m[a-zA-Z]+|MIR)/`
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
      `could not find asset: ${matches[2]} -- please register it in your config file.`
    );
  }
}

export function parseAssetInfo(input: string): AssetInfo {
  if (input in config.assets) {
    return {
      token: {
        contract_addr: config.assets[input].token,
      },
    };
  }

  if (input in ['uusd', 'umnt', 'usdr', 'ukrw']) {
    return {
      native_token: {
        denom: input,
      },
    };
  }

  throw new Error(`could not parse AssetInfo: ${input}`);
}
