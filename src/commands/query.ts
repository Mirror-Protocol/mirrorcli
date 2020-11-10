import { Command } from 'commander';
import * as contracts from './contracts';
import * as _ from 'lodash';

const command = new Command('query');

// short form
command.alias('q');
command.description(`Run a smart contract query function`);

_.each(contracts.mirror, contract => {
  command.addCommand(contract.query);
});

_.each(contracts.terraswap, contract => {
  command.addCommand(contract.query);
});

export default command;
