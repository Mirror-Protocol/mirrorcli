import { Asset, AssetInfo } from '@mirror-protocol/mirror.js';
import { AccAddress, Coins, Dec, Int } from '@terra-money/terra.js';
import * as _ from 'lodash';

import { config, AssetConfig, activeNetwork, configFilePath } from './config';

export type InputParser<T> = (input?: string) => T;

export namespace Parse {
  export function assetTokenOrAccAddress(input?: string): AccAddress {
    if (input === undefined) {
      return undefined;
    }

    if (AccAddress.validate(input)) {
      return input;
    } else {
      return Parse.assetConfig(input).token;
    }
  }

  export function accAddress(input?: string): AccAddress {
    {
      if (input === undefined) return undefined;
    }

    if (!AccAddress.validate(input)) {
      throw new Error(`Invalid Terra account address: ${input}`);
    }

    return input;
  }

  export function assetConfig(input?: string): AssetConfig {
    if (input === undefined) {
      return undefined;
    }

    if (config.assets[input] === undefined) {
      throw new Error(
        `Asset '${input}' not found in registry; please add info to networks[${activeNetwork}][assets][${input}] in ${configFilePath}`
      );
    }

    return config.assets[input];
  }

  export function prices(
    input?: string[]
  ): { asset_token: string; price: Dec }[] {
    if (input === undefined) {
      return undefined;
    }

    return _.map(input, p => {
      const data = p.split(':');
      return {
        asset_token: Parse.assetConfig(data[0]).token,
        price: Parse.dec(data[1]),
      };
    });
  }

  export function int(input?: string): number {
    if (input === undefined) {
      return undefined;
    }
    return Number.parseInt(input);
  }

  export function uint128(input?: string): Int {
    if (input === undefined) {
      return undefined;
    }
    return new Int(input);
  }

  export function coins(input?: string): Coins {
    if (input === undefined) {
      return undefined;
    }
    return Coins.fromString(input);
  }

  export function dec(input?: string): Dec {
    if (input === undefined) {
      return undefined;
    }
    return new Dec(input);
  }

  export function asset(input?: string): Asset<AssetInfo> {
    if (input === undefined) {
      return undefined;
    }

    const matches = input.match(/([0-9]+)(u[a-z]{3,4}|m[a-zA-Z]+|MIR)/);
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
    } else if (config.assets[matches[2]] !== undefined) {
      return {
        info: {
          token: {
            contract_addr: Parse.assetConfig(matches[2]).token,
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

  export function assetInfo(input?: string): AssetInfo {
    if (input === undefined) {
      return undefined;
    }

    if (input.startsWith('u')) {
      return {
        native_token: {
          denom: input,
        },
      };
    } else {
      return {
        token: {
          contract_addr: Parse.assetTokenOrAccAddress(input),
        },
      };
    }
  }
}
