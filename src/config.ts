import { homedir } from 'os';
import * as fs from 'fs';
import * as path from 'path';

import { Validator } from 'jsonschema';
const { error } = require('prettycli');
import * as _ from 'lodash';

export namespace MirrorCLIConfig {
  export const SCHEMA = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $ref: '#/definitions/MirrorCLIConfig',
    definitions: {
      ContractConfig: {
        title: 'ContractConfig',
        type: 'object',
        properties: {
          contractAddress: {
            type: 'string',
            title: 'contractAddress',
          },
          codeId: {
            type: 'number',
            title: 'codeId',
          },
        },
      },
      MirrorCLIConfig: {
        title: 'MirrorCLIConfig',
        type: 'object',
        properties: {
          lcd: {
            type: 'object',
            properties: {
              chainId: {
                type: 'string',
                title: 'chainId',
              },
              url: {
                type: 'string',
                title: 'url',
              },
            },
            title: 'lcd',
          },
          contracts: {
            type: 'object',
            properties: {
              mirror: {
                type: 'object',
                properties: {
                  collector: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'collector',
                  },
                  factory: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'factory',
                  },
                  gov: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'gov',
                  },
                  mint: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'mint',
                  },
                  oracle: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'oracle',
                  },
                  staking: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'staking',
                  },
                },
                title: 'mirror',
              },
              terraswap: {
                type: 'object',
                properties: {
                  factory: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'factory',
                  },
                  pair: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'pair',
                  },
                  token: {
                    $ref: '#/definitions/ContractConfig',
                    title: 'token',
                  },
                },
                title: 'terraswap',
              },
            },
            title: 'contracts',
          },
        },
      },
    },
  };
}

export interface ContractConfig {
  contractAddress: string;
  codeId: number;
}

const defaultContractConfig = {
  contractAddress: '',
  codeId: 0,
};

export interface MirrorCLIConfig {
  lcd: {
    chainId: string;
    url: string;
  };
  contracts: {
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
  lcd: {
    chainId: 'columbus-4',
    url: 'https://lcd.terra.dev',
  },
  contracts: {
    mirror: {
      collector: defaultContractConfig,
      factory: defaultContractConfig,
      gov: defaultContractConfig,
      mint: defaultContractConfig,
      oracle: defaultContractConfig,
      staking: defaultContractConfig,
    },
    terraswap: {
      factory: defaultContractConfig,
      pair: defaultContractConfig,
      token: defaultContractConfig,
    },
  },
};

export function validateConfig(
  config: Partial<MirrorCLIConfig>
): Partial<MirrorCLIConfig> {
  const v = new Validator();
  const r = v.validate(config, MirrorCLIConfig.SCHEMA);
  if (r.valid) {
    return config;
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
    return _.merge(DEFAULT_MIRRORCLI_CONFIG, loadedConfig);
  }
}
