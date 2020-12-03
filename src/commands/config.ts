import { Command } from 'commander';
import { activeNetwork, config, saveNetworkConfig } from '../util/config';
import * as dotProp from 'dot-prop';

export const command = new Command('config');

// short form
command.alias('c');
command.description('Access configuration settings');

const get = command.command('get <path>');
get.description(`Gets the current configuration for ${activeNetwork}`, {
  path: `(string) config parameter path eg. 'lcd.chainId'`,
});
get.action((path: string) => {
  console.log(dotProp.get(config, path));
});

const set = command.command('set <path> <value>');
set.description(`Sets the configuration for ${activeNetwork}`, {
  path: `(string) config parameter path eg. 'lcd.chainId'`,
  value: '(JSON) value to set',
});
set.action((path: string, value: string) => {
  saveNetworkConfig(dotProp.set(config, path, JSON.parse(value)));
});

export default command;
