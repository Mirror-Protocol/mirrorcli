export default {
  networks: {
    'columbus-4': {
      lcd: {
        chainId: 'columbus-4',
        url: 'https://lcd.terra.dev',
        gasPrices: {
          uluna: 0.00506,
          uusd: 0.0015,
          usdr: 0.00102,
          ukrw: 1.7805,
          umnt: 4.31626,
        },
        gasAdjustment: 1.2,
      },

      contracts: {
        collector: 'terra1jmj39n0tfg6qu852fx0kr46gn4sewq6uyqyu8t',
        factory: 'terra1ndzjhjszw4pp8dkkt864drgmwhc59padjfccxg',
        gov: 'terra12pf2c9k7m2ag2893aa6sv75nmytr9uuxzv8vgx',
        mint: 'terra1ycsd7mlffq2ksmqdr20y4drtf6ctw3n8fmup5g',
        oracle: 'terra14nh9jzg6gx3qp2jnlg5lvkmky40uxu7w9mgevz',
        staking: 'terra1xxqqw7vysmh2wnq3y6hgh7d2ytmgazw62f28hh',
        'mirror-token': 'terra16y2ew6rmnehu9fn45jj55w4g37d62xgjz8zsx9',
        terraswap: 'terra10w3rtrs8fmgwy6rsh2xwq6x27ym4kpz3698dr4',
      },

      assets: {
        MIR: {
          name: 'Mirror',
          token: 'terra16y2ew6rmnehu9fn45jj55w4g37d62xgjz8zsx9',
          pair: 'terra1ck0ky4ad0ecmz7sksacejxf3rek8922n2302lh',
          lpToken: 'terra1xfm4k6qj3ryhpef4t4p9zgww6e3zuw6c0eqd05',
        },
        mAAPL: {
          name: 'Apple',
          token: 'terra17c3tsywm5h95j3z7hy62mvmyjct4euly4gj3kp',
          pair: 'terra1d6548cmpmugndjg650k0k66fhnvkeqxavv0z07',
          lpToken: 'terra1msdk05534hqupfed4v5q04f5y883ezqm0uukn7',
        },
        mGOOGL: {
          name: 'Google',
          token: 'terra1tz0c9uy0wwaaq4p57v8qzfx0g08l3zr3zcdtgl',
          pair: 'terra1t8m4cs4f32zqgsktu4pucwnlkz47dgql8crywn',
          lpToken: 'terra1wxh3lw9u3k7psmvqzraxpmscmpgp329kzg834m',
        },
        mTSLA: {
          name: 'Tesla',
          token: 'terra13fkuw7gh8r0mjswj8ckyt87m84azq43q3qldmj',
          pair: 'terra1uf29lrmpsmww4k3c9jcxdzet75c2pt353mx4tq',
          lpToken: 'terra1zccwcq7shh4yj8j2ynecd7pyyftxlhdd77fpu3',
        },
        mNFLX: {
          name: 'Netflix',
          token: 'terra1f9pk063a99g27l5nu83pd55x6rs649s3ax7pw3',
          pair: 'terra1t033f2r5phvuvysu50x2lj5ctshakcf45szn49',
          lpToken: 'terra1ch6d5kdenshk2zktap2s05arytpn8xhdffarvc',
        },
        mQQQ: {
          symbol: 'mQQQ',
          name: 'Invesco QQQ Trust',
          token: 'terra1hu7u866jla3vgckf4sd6vjdfxzuqvzvu0ekpc9',
          pair: 'terra19ujpfl5djdrp6w4w30vtx9cremz25gkg9nzcfa',
          lpToken: 'terra1cj8rcff3djz86rarg3uw3nzgdy2trgvj5egvdl',
        },
        mTWTR: {
          symbol: 'mTWTR',
          name: 'Twitter',
          token: 'terra1ua295n83qqm7kncn6g704d2a3hpmtjyx7f07u7',
          pair: 'terra14q8szcr0gy5pzksve5sp7e94kqqa0xlc3g2y9u',
          lpToken: 'terra1wunltsvvl2gfsnpwc4hf9pdxt6tnp7rt877ny8',
        },
        mBABA: {
          symbol: 'mBABA',
          name: 'Alibaba Group Holdings Ltd ADR',
          token: 'terra1vekqnp3tgukt90lqfumu5467jw9jy4eewzn2fu',
          pair: 'terra1q5gyld4cjr59fdk2rjuuzs200ks28lp08fudnt',
          lpToken: 'terra1vrkjzhs26qlg6863s7rcnkqlmp3ftsxfdc6l5r',
        },
        mIAU: {
          name: 'iShares Gold Trust',
          token: 'terra1cyrhd8m2hhvvrn3mrn29d4h6unzyp6deay6g2y',
          pair: 'terra1ygeltj9hg4tsshhx2m4et4nmhn2sqpmu2cv8qk',
          lpToken: 'terra1whql3f3vukrtu3qs363vj5a67xccydjz9lpg6t',
        },
        mSLV: {
          name: 'iShares Silver Trust',
          token: 'terra17szfxhpttyp6w5p8llpqcr72yegxtaqy6uarye',
          pair: 'terra1vh4e69jq20tdzldc49wwuz22qe4pdr0zlwpvsg',
          lpToken: 'terra1d2ujj007l2tp5r6mgp78hr0ecrtq4q9afvmlwh',
        },
        mUSO: {
          name: 'United States Oil Fund, LP',
          token: 'terra19sf42kkwn85dj8hzffcytvw6jx4g8g3nxfnrdu',
          pair: 'terra1yde9tsacetgrdzdm56s5dng2uc53wpnyf9dyds',
          lpToken: 'terra1pkv2skq9pqzpfe483dn6q2dskadrhyrqg2f5ya',
        },
        mVIXY: {
          name: 'ProShares VIX',
          token: 'terra1kmt8vekwu4aq6l9y50n8hg9zcdzd3tqdp8lgdr',
          pair: 'terra195fcntnznx4f676gf383g02yguhync2fsuk03x',
          lpToken: 'terra1svhet09r7ulhyr4vs4fl6j6lnam94q6natumck',
        },
      },
    },

    // for usage with LocalMirror
    localterra: {
      lcd: {
        chainId: 'localterra',
        url: 'http://127.0.0.1:1317',
        gasPrices: {
          uluna: 0.00506,
          uusd: 0.0015,
          usdr: 0.00102,
          ukrw: 1.7805,
          umnt: 4.31626,
        },
        gasAdjustment: 1.2,
      },

      contracts: {
        collector: 'terra18jfvthj7f6fxlxy3793xttd4kw492t4ku5yxau',
        factory: 'terra1qxxlalvsdjd07p07y3rc5fu6ll8k4tme7cye8y',
        gov: 'terra1sh36qn08g4cqg685cfzmyxqv2952q6r8gpczrt',
        mint: 'terra1z449mpul3pwkdd3892gv28ewv5l06w7895wewm',
        staking: 'terra138y2ppmkgq78wfp5mwj9jqu96vylgs3dpdn5ux',
        oracle: 'terra1plju286nnfj3z54wgcggd4enwaa9fgf5kgrgzl',
        terraswap: 'terra18dt935pdcn2ka6l0syy5gt20wa48n3mktvdvjj',
        'mirror-token': 'terra1g6uv2xzfcc4mae8mw6unhdzv9cdy5p62ck8ylr',
      },

      assets: {
        MIR: {
          name: 'Mirror Token',
          token: 'terra1g6uv2xzfcc4mae8mw6unhdzv9cdy5p62ck8ylr',
          pair: 'terra1sfga5c35trjwvgpfz8r7mh0zfecs3y2flf4khl',
          lpToken: 'terra15cv6vq9rn273p99hk0df5cc8z0kmjsevwlwjar',
        },

        mAAPL: {
          name: 'Apple Inc.',
          token: 'terra1y336dak40tf300jyamuq3trlxne9qajczc884s',
          pair: 'terra1edqzdggfclw6t5dg8y0n05kk0k7te3ra5n6yw9',
          lpToken: 'terra1pe72s6w69rdzrqyuu4eaf7sp8ushzf6w757gyf',
        },
      },
    },
  },
};
