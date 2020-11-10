// Mirror contracts
import Collector from './collector';
import Factory from './factory';
import Gov from './gov';
import Mint from './mint';
import Oracle from './oracle';
import Staking from './staking';

// Terraswap contracts
import TSToken from './ts-token';
import TSPair from './ts-pair';
import TSFactory from './ts-factory';

export const mirror = [Collector, Factory, Gov, Mint, Oracle, Staking];
export const terraswap = [TSFactory, TSPair, TSToken];
