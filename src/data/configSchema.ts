export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $ref: '#/definitions/MirrorCLIConfig',
  definitions: {
    AssetConfig: {
      title: 'AssetConfig',
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'name',
        },
        token: {
          type: 'string',
          title: 'token',
        },
        pair: {
          type: 'string',
          title: 'pair',
        },
        lpToken: {
          type: 'string',
          title: 'lpToken',
        },
      },
      required: ['lpToken', 'name', 'pair', 'token'],
    },
    MirrorCLINetworkConfig: {
      title: 'MirrorCLINetworkConfig',
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
            gasPrices: {
              type: 'object',
              additionalProperties: {
                type: 'number',
              },
              title: 'gasPrices',
            },
            gasAdjustment: {
              type: 'number',
              title: 'gasAdjustment',
            },
          },
          required: ['chainId', 'url'],
          title: 'lcd',
        },
        contracts: {
          type: 'object',
          properties: {
            collector: {
              type: 'string',
              title: 'collector',
            },
            factory: {
              type: 'string',
              title: 'factory',
            },
            gov: {
              type: 'string',
              title: 'gov',
            },
            mint: {
              type: 'string',
              title: 'mint',
            },
            oracle: {
              type: 'string',
              title: 'oracle',
            },
            staking: {
              type: 'string',
              title: 'staking',
            },
            'mirror-token': {
              type: 'string',
              title: 'mirror-token',
            },
            terraswap: {
              type: 'string',
              title: 'terraswap',
            },
          },
          required: [
            'collector',
            'factory',
            'gov',
            'mint',
            'mirror-token',
            'oracle',
            'staking',
            'terraswap',
          ],
          title: 'contracts',
        },
        assets: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
          title: 'assets',
        },
      },
      required: ['assets', 'contracts', 'lcd'],
    },
    MirrorCLIConfig: {
      title: 'MirrorCLIConfig',
      type: 'object',
      properties: {
        networks: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/MirrorCLINetworkConfig',
          },
          title: 'networks',
        },
      },
      required: ['networks'],
    },
  },
};
