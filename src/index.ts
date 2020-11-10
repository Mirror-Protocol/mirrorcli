import { program, Command } from 'commander';
import * as _ from 'lodash';

process.on('unhandledRejection', error => {
  console.error(error);
  logger.error(error.toString());
});

import commands from './commands';
import * as logger from './logger';

export function run(argv: string[]): void {
  try {
    program.name('mirrorcli').version('0.0.1');
    _.each(commands, (command: Command) => {
      program.addCommand(command);
    });
    program.parse(argv);
  } catch (e) {
    logger.error(e.message);
  }
}
