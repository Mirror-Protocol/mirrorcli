import { homedir } from 'os';
import * as fs from 'fs';
import * as path from 'path';

import { Validator } from 'jsonschema';
import * as _ from 'lodash';

import * as logger from './logger';

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export namespace MirrorCLIConfig {
  export const SCHEMA = require('./configSchema.json');
}

export interface MirrorCLIConfig {
  lcd: {
    chainId: string;
    url: string;
    gasPrices?: {
      [denom: string]: number;
    };
    gasAdjustment?: number;
  };
  contracts: {
    collector: string;
    factory: string;
    gov: string;
    mint: string;
    oracle: string;
    staking: string;
    'mirror-token': string;
    terraswap: string;
  };
  assets: {
    [symbol: string]: {
      name: string;
      token: string;
      pair: string;
      lpToken: string;
    };
  };
}

export const configFilePath = path.join(homedir(), '.mirrorclirc.json');

export const DEFAULT_MIRRORCLI_CONFIG: MirrorCLIConfig = require('./.mirrorclirc.default.json');

export function validateConfig(
  config: DeepPartial<MirrorCLIConfig>
): DeepPartial<MirrorCLIConfig> {
  const v = new Validator();
  const r = v.validate(config, MirrorCLIConfig.SCHEMA, {});
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
    saveConfig({});
    return DEFAULT_MIRRORCLI_CONFIG;
  } else {
    try {
      const loadedConfig: DeepPartial<MirrorCLIConfig> = JSON.parse(
        fs.readFileSync(configFilePath).toString()
      );
      saveConfig(loadedConfig);
      return _.merge(DEFAULT_MIRRORCLI_CONFIG, loadedConfig);
    } catch (e) {
      throw new Error(
        `Could not parse config file ${configFilePath}: ${e.message}`
      );
    }
  }
}

export const config = (() => {
  try {
    return loadConfig();
  } catch (e) {
    logger.error(e.message);
    process.exit();
  }
})();
