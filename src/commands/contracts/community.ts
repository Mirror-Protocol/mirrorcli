import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('community', 'Mirror Community contract functions');

const updateConfig = exec
  .command('update-config')
  .description(`Update Mirror Community contract config`)
  .option('--owner <AccAddress>', 'new owner')
  .option('--spend-limit <Uint128>', 'new MIR spend limit')
  .action(async () => {
    await handleExecCommand(exec, mirror =>
      mirror.community.updateConfig({
        owner: Parse.accAddress(updateConfig.owner),
        spend_limit: updateConfig.spendLimit
          ? Parse.uint128(updateConfig.spendLimit).toString()
          : undefined,
      })
    );
  });

const spend = exec
  .command('spend <recipient> <amount>')
  .description(`Spend community pool funds`, {
    recipient: '(AccAddress) account to send funds to',
    amount: '(Uint128) amount of MIR tokens to send',
  })
  .action(async (recipient: string, amount: string) => {
    await handleExecCommand(exec, mirror =>
      mirror.community.spend(Parse.accAddress(recipient), Parse.uint128(amount))
    );
  });

const query = createQueryMenu('community', 'Mirror Community contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Community contract config')
  .action(async () => {
    await handleQueryCommand(query, mirror => mirror.community.getConfig());
  });

export default {
  exec,
  query,
};
