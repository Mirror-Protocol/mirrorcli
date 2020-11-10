import { Command } from 'commander';
import * as contracts from './contracts';
import * as _ from 'lodash';

export const command = new Command('exec');

// short form
command.alias('e');
command.description('Execute a function on a smart contract');

_.each(contracts.mirror, contract => {
  command.addCommand(contract.exec);
});

_.each(contracts.terraswap, contract => {
  command.addCommand(contract.exec);
});

export default command;
