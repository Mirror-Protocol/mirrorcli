import * as bluebird from 'bluebird';
import { program, Command } from 'commander';
import * as _ from 'lodash';

import commands from './commands';

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});

global.Promise = bluebird as any; // eslint-disable-line
process.on('unhandledRejection', error => console.error(error));

export function run(argv: string[]): void {
  program.name('mirrorcli').version('0.0.1');
  _.each(commands, (command: Command) => {
    program.addCommand(command);
  });
  program.parse(argv);
}
