import { Command } from 'commander';
import contracts from './contracts';
import * as _ from 'lodash';

export const command = new Command('exec');

// short form
command.alias('e');

_.each(contracts, contract => {
  command.addCommand(contract.exec);
});

export default command;
