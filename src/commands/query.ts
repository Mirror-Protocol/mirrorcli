import { Command } from 'commander';
import contracts from './contracts';
import * as _ from 'lodash';

const command = new Command('query');

// short form
command.alias('q');

_.each(contracts, contract => {
  command.addCommand(contract.query);
});

export default command;
