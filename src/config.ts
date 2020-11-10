import { homedir } from 'os';
import * as fs from 'fs';
import * as path from 'path';

import { Validator } from 'jsonschema';
const { error } = require('prettycli');

export namespace MirrorCLIConfig {
  export const SCHEMA = {
    type: 'object',
  };
}

export interface ContractConfig {
  contractAddress: string;
  codeId: number;
}

export interface MirrorCLIConfig {
  lcdConfig: {
    chainId: string;
    url: string;
  };
  contracts?: {
    mirror: {
      collector: ContractConfig;
      factory: ContractConfig;
      gov: ContractConfig;
      mint: ContractConfig;
      oracle: ContractConfig;
      staking: ContractConfig;
    };
    terraswap: {
      factory: ContractConfig;
      pair: ContractConfig;
      token: ContractConfig;
    };
  };
}

export const configFilePath = path.join(homedir(), '.mirrorclirc.json');

export const DEFAULT_MIRRORCLI_CONFIG: Partial<MirrorCLIConfig> = {
  lcdConfig: {
    chainId: 'columbus-4',
    url: 'https://lcd.terra.dev',
  },
};

export function validateConfig(
  config: Partial<MirrorCLIConfig>
): Partial<MirrorCLIConfig> {
  const v = new Validator();
  const data = {
    ...DEFAULT_MIRRORCLI_CONFIG,
    ...config,
  };
  const r = v.validate(data, MirrorCLIConfig.SCHEMA);
  if (r.valid) {
    return data;
  } else {
    for (const err of r.errors) {
      console.error(err.toString());
    }
    error(`Config file ${configFilePath} is invalid.`);
    throw new Error('Config file .mirrorclirc.json is invalid');
  }
}

export function saveConfig(config: Partial<MirrorCLIConfig>) {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(validateConfig(config), null, 2)
  );
}

export function loadConfig(): Partial<MirrorCLIConfig> {
  if (!fs.existsSync(configFilePath)) {
    saveConfig({});
    return DEFAULT_MIRRORCLI_CONFIG;
  } else {
    const loadedConfig = JSON.parse(fs.readFileSync(configFilePath).toString());
    // first, perform validation & reformat
    saveConfig(loadedConfig);
    return {
      ...DEFAULT_MIRRORCLI_CONFIG,
      ...loadedConfig,
    };
  }
}
