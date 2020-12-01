import { homedir } from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { AccAddress } from '@terra-money/terra.js';

import { Validator } from 'jsonschema';
import * as _ from 'lodash';

import * as logger from './logger';

import configSchema from '../data/configSchema';
import DEFAULT_MIRRORCLI_CONFIG from '../data/mirrorclirc';

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export namespace MirrorCLIConfig {
  export const SCHEMA = configSchema;
}

export interface AssetConfig {
  name: string;
  token: AccAddress;
  pair: AccAddress;
  lpToken: AccAddress;
}

export interface MirrorCLINetworkConfig {
  lcd: {
    chainId: string;
    url: string;
    gasPrices?: {
      [denom: string]: number;
    };
    gasAdjustment?: number;
  };

  contracts: {
    collector: AccAddress;
    community: AccAddress;
    factory: AccAddress;
    gov: AccAddress;
    mint: AccAddress;
    oracle: AccAddress;
    staking: AccAddress;
    'mirror-token': AccAddress;
    terraswap: AccAddress;
  };
  assets: {
    [symbol: string]: AssetConfig;
  };
}

export interface MirrorCLIConfig {
  networks: {
    [networkName: string]: MirrorCLINetworkConfig;
  };
}

export const configFilePath = path.join(homedir(), '.mirrorclirc.json');

export function validateConfig(
  config: DeepPartial<MirrorCLIConfig>
): DeepPartial<MirrorCLIConfig> {
  const v = new Validator();
  const r = v.validate(config, MirrorCLIConfig.SCHEMA);
  if (r.valid) {
    return config;
  } else {
    for (const err of r.errors) {
      logger.error(err.toString());
    }
    throw new Error(`improper format.`);
  }
}

export function saveConfig(config: DeepPartial<MirrorCLIConfig>) {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(validateConfig(config), null, 2)
  );
}

export function loadConfig(): MirrorCLIConfig {
  if (!fs.existsSync(configFilePath)) {
    saveConfig(DEFAULT_MIRRORCLI_CONFIG);
    return DEFAULT_MIRRORCLI_CONFIG;
  } else {
    try {
      const loadedConfig: DeepPartial<MirrorCLIConfig> = JSON.parse(
        fs.readFileSync(configFilePath).toString()
      );
      saveConfig(loadedConfig);
      return {
        ...DEFAULT_MIRRORCLI_CONFIG,
        ...loadedConfig,
      } as MirrorCLIConfig;
    } catch (e) {
      throw new Error(
        `Could not parse config file ${configFilePath}: ${e.message}`
      );
    }
  }
}

export const activeNetwork = process.env.MIRRORCLI_NETWORK || 'columbus-4';

export const config = (() => {
  try {
    const c = loadConfig().networks[activeNetwork];
    if (c === undefined) {
      throw new Error(
        `Could not find configuration for MIRRORCLI_NETWORK=${activeNetwork}`
      );
    }
    return c;
  } catch (e) {
    logger.error(e.message);
    process.exit();
  }
})();
