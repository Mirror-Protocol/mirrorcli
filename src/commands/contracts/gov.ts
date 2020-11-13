import { Command } from 'commander';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('gov', 'Mirror Gov contract functions');

const castVote = exec
  .command('cast-vote <poll-id> <vote> <amount>')
  .description(`Vote in an active poll`, {
    'poll-id': '(int) Poll ID',
    vote: `(string) 'yes' or 'no'`,
    amount: '(Uint128) amount of staked MIR voting power to allocate',
  })
  .action((pollId: string, vote: string, amount: string) => {
    if (vote !== 'yes' && vote !== 'no') {
      throw new Error(`invalid vote option '${vote}', MUST be 'yes' or 'no'`);
    }
    handleExecCommand(exec, mirror =>
      mirror.gov.castVote(Parse.int(pollId), vote, amount)
    );
  });

const castVote = exec
  .command('cast-vote <poll-id> <vote> <amount>')
  .description(`Vote in an active poll`, {
    'poll-id': '(int) Poll ID',
    vote: `(string) 'yes' or 'no'`,
    amount: '(Uint128) amount of staked MIR voting power to allocate',
  })
  .action((pollId: string, vote: string, amount: string) => {
    if (vote !== 'yes' && vote !== 'no') {
      throw new Error(`invalid vote option '${vote}', MUST be 'yes' or 'no'`);
    }
    handleExecCommand(exec, mirror => mirror.gov.createPoll());
  });

const send = exec
  .command('send')
  .description(
    `Sends contract's balance of MIR to distribution (Mirror Gov) contract`
  )
  .action(() => {
    handleExecCommand(exec, mirror => mirror.collector.send());
  });

const query = new Command('collector');
query.description('Mirror Collector contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Collector contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.collector.getConfig());
  });

export default {
  exec,
  query,
};
