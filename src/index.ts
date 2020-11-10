import * as bluebird from 'bluebird';
import { program, Command } from 'commander';
import * as _ from 'lodash';

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});

global.Promise = bluebird as any; // eslint-disable-line
process.on('unhandledRejection', error => console.error(error));

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
