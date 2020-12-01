// Mirror contracts
import Collector from './collector';
import Factory from './factory';
import Gov from './gov';
import Mint from './mint';
import Oracle from './oracle';
import Staking from './staking';

// Terraswap contracts
import TerraswapFactory from './terraswap';
import TerraswapToken from './token';

export const mirror = [Collector, Factory, Gov, Mint, Oracle, Staking];

export const terraswap = [TerraswapFactory, TerraswapToken];
