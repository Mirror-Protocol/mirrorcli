import { MirrorCLINetworkConfig } from 'util/config';

const defaultConfig: {
  networks: { [network: string]: MirrorCLINetworkConfig };
} = {
  networks: {
    'tequila-0004': {
      lcd: {
        chainId: 'tequila-0004',
        url: 'https://tequila-lcd.terra.dev',
        gasPrices: {
          uluna: 0.15,
          usdr: 0.1018,
          uusd: 0.15,
          ukrw: 178.05,
          umnt: 431.6259,
        },
        gasAdjustment: 1.2,
      },
      contracts: {
        collector: 'terra1v046ktavwzlyct5gh8ls767fh7hc4gxc95grxy',
        community: 'terra10qm80sfht0zhh3gaeej7sd4f92tswc44fn000q',
        factory: 'terra10l9xc9eyrpxd5tqjgy6uxrw7dd9cv897cw8wdr',
        gov: 'terra12r5ghc6ppewcdcs3hkewrz24ey6xl7mmpk478s',
        mint: 'terra1s9ehcjv0dqj2gsl72xrpp0ga5fql7fj7y3kq3w',
        oracle: 'terra1uvxhec74deupp47enh7z5pk55f3cvcz8nj4ww9',
        staking: 'terra1a06dgl27rhujjphsn4drl242ufws267qxypptx',
        terraswap: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf',
      },
      assets: {
        terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u: {
          symbol: 'MIR',
          name: 'Mirror',
          token: 'terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u',
          pair: 'terra1cz6qp8lfwht83fh9xm9n94kj04qc35ulga5dl0',
          lpToken: 'terra1zrryfhlrpg49quz37u90ck6f396l4xdjs5s08j',
          status: 'LISTED',
        },
        terra16vfxm98rxlc8erj4g0sj5932dvylgmdufnugk0: {
          symbol: 'mAAPL',
          name: 'Apple',
          token: 'terra16vfxm98rxlc8erj4g0sj5932dvylgmdufnugk0',
          pair: 'terra1yj892rl8edvk0y2ayf3h36t6uf89lzxg8jea4a',
          lpToken: 'terra1vth958fsn8zawllaqcdzswksjkv3dz2sqqmcu4',
          status: 'LISTED',
        },
        terra1qg9ugndl25567u03jrr79xur2yk9d632fke3h2: {
          symbol: 'mGOOGL',
          name: 'Google',
          token: 'terra1qg9ugndl25567u03jrr79xur2yk9d632fke3h2',
          pair: 'terra1z2734asgwhma8ma2fq4yu7ce2l3mrvj4qnz6ws',
          lpToken: 'terra1qxurxcgl30eu4ar34ltr5e9tqc2gjl4atspvy3',
          status: 'LISTED',
        },
        terra1nslem9lgwx53rvgqwd8hgq7pepsry6yr3wsen4: {
          symbol: 'mTSLA',
          name: 'Tesla',
          token: 'terra1nslem9lgwx53rvgqwd8hgq7pepsry6yr3wsen4',
          pair: 'terra1tsln42kfeq8edwscmw8njgter5dp8evn40znn9',
          lpToken: 'terra1utf7qw0uce42vqsh255hxgd3pvuzfvp6jcayk5',
          status: 'LISTED',
        },
        terra1djnlav60utj06kk9dl7defsv8xql5qpryzvm3h: {
          symbol: 'mNFLX',
          name: 'Netflix',
          token: 'terra1djnlav60utj06kk9dl7defsv8xql5qpryzvm3h',
          pair: 'terra18yl0z6wntjkustt9cckc9ptp7l5qh7kr0xrmav',
          lpToken: 'terra1e0njrqcsehxpt9due62x9zsxl7h9htl0xqdujv',
          status: 'LISTED',
        },
        terra18yx7ff8knc98p07pdkhm3u36wufaeacv47fuha: {
          symbol: 'mQQQ',
          name: 'Invesco QQQ Trust',
          token: 'terra18yx7ff8knc98p07pdkhm3u36wufaeacv47fuha',
          pair: 'terra1epxv8z6tzxezjfgw7tveytw5n3fuf6wvg6w8f5',
          lpToken: 'terra1h52zc9qmndczgru9vp2cvuwfclyykl5yt3qjk8',
          status: 'LISTED',
        },
        terra1ax7mhqahj6vcqnnl675nqq2g9wghzuecy923vy: {
          symbol: 'mTWTR',
          name: 'Twitter',
          token: 'terra1ax7mhqahj6vcqnnl675nqq2g9wghzuecy923vy',
          pair: 'terra1jv937296dy5c5dxglrzf05h0jlaaxp55tqlyh6',
          lpToken: 'terra10cugucjwn4hdtvavl0n2sh2ke64nx93luhj49k',
          status: 'LISTED',
        },
        terra12s2h8vlztjwu440khpc0063p34vm7nhu25w4p9: {
          symbol: 'mMSFT',
          name: 'Microsoft Corporation',
          token: 'terra12s2h8vlztjwu440khpc0063p34vm7nhu25w4p9',
          pair: 'terra1dt7ne6gwv23wg6chl89q95yj6999alagc6rqd9',
          lpToken: 'terra1f7azmktepw5rq35e2m6r6smtwl8wdrxp0dsvar',
          status: 'LISTED',
        },
        terra12saaecsqwxj04fn0jsv4jmdyp6gylptf5tksge: {
          symbol: 'mAMZN',
          name: 'Amazon.com',
          token: 'terra12saaecsqwxj04fn0jsv4jmdyp6gylptf5tksge',
          pair: 'terra1xs3vy9zs8agmnzyn7z9s7kqk392uu2h3x3l6er',
          lpToken: 'terra1kgvcrtupc8y4dgc9n08ud99ckdxp08j59zgccf',
          status: 'LISTED',
        },
        terra15dr4ah3kha68kam7a907pje9w6z2lpjpnrkd06: {
          symbol: 'mBABA',
          name: 'Alibaba Group Holdings Ltd ADR',
          token: 'terra15dr4ah3kha68kam7a907pje9w6z2lpjpnrkd06',
          pair: 'terra15qq59h2canrr2pf8ny7rw57nx3mcvw97tp3xj4',
          lpToken: 'terra1px2ya3e07aprfgc76e57r3nuvy3czssrvcxg9t',
          status: 'LISTED',
        },
        terra19dl29dpykvzej8rg86mjqg8h63s9cqvkknpclr: {
          symbol: 'mIAU',
          name: 'iShares Gold Trust',
          token: 'terra19dl29dpykvzej8rg86mjqg8h63s9cqvkknpclr',
          pair: 'terra1tq6w7rl4ryrk458k57dstelx54eylph5zwnpf9',
          lpToken: 'terra193c2xvuzswct8qtsg4e6qhe3hyt3l6fac9cy79',
          status: 'LISTED',
        },
        terra1fdkfhgk433tar72t4edh6p6y9rmjulzc83ljuw: {
          symbol: 'mSLV',
          name: 'iShares Silver Trust',
          token: 'terra1fdkfhgk433tar72t4edh6p6y9rmjulzc83ljuw',
          pair: 'terra1tyzsl0dw4pltlqey5v6g646hm22pql8vy3yh2g',
          lpToken: 'terra16cn5cgwaktrzczda0c6ux0e2quudh4vn3t8jjm',
          status: 'LISTED',
        },
        terra1fucmfp8x4mpzsydjaxyv26hrkdg4vpdzdvf647: {
          symbol: 'mUSO',
          name: 'United States Oil Fund, LP',
          token: 'terra1fucmfp8x4mpzsydjaxyv26hrkdg4vpdzdvf647',
          pair: 'terra1llk7ycwwlj2zs2l2dvnvmsxrsrnucqwaltstcf',
          lpToken: 'terra1rag9w5ch0jrdxjffr6napqz0zsrpm6uz2zezmj',
          status: 'LISTED',
        },
        terra1z0k7nx0vl85hwpv3e3hu2cyfkwq07fl7nqchvd: {
          symbol: 'mVIXY',
          name: 'ProShares VIX',
          token: 'terra1z0k7nx0vl85hwpv3e3hu2cyfkwq07fl7nqchvd',
          pair: 'terra1xg2393l4s7n4z2r0cnu4rr55mkpp942f4d3qzr',
          lpToken: 'terra1ud750vcv39hd467sj2kk6s6nn8zf5xhgggf7uq',
          status: 'LISTED',
        },
      },
    },
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
        community: '',
        factory: 'terra1ndzjhjszw4pp8dkkt864drgmwhc59padjfccxg',
        gov: 'terra12pf2c9k7m2ag2893aa6sv75nmytr9uuxzv8vgx',
        mint: 'terra1ycsd7mlffq2ksmqdr20y4drtf6ctw3n8fmup5g',
        oracle: 'terra14nh9jzg6gx3qp2jnlg5lvkmky40uxu7w9mgevz',
        staking: 'terra1xxqqw7vysmh2wnq3y6hgh7d2ytmgazw62f28hh',
        terraswap: 'terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj',
      },

      assets: {
        MIR: undefined,
      },
    },
  },
};

export default defaultConfig;
