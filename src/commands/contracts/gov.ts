import { MirrorGov } from '@mirror-protocol/mirror.js';
import { Command } from 'commander';
import * as fs from 'fs';

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

const createPoll = exec
  .command('create-poll <title> <description> <deposit> [link]')
  .description(`Create a new poll`, {
    title: '(string) title of poll',
    description: '(string) poll description',
    deposit: '(Uint128) deposit amount of MIR tokens',
    link: '(URL) URL with more information',
  })
  .option('--execute-msg <path>', 'File containing ExecuteMsg')
  .action(
    (title: string, description: string, deposit: string, link?: string) => {
      let executeMsg: MirrorGov.ExecuteMsg | undefined;

      if (createPoll.executeMsg) {
        executeMsg = JSON.parse(
          fs.readFileSync(createPoll.executeMsg).toString()
        );
      }

      handleExecCommand(exec, mirror =>
        mirror.gov.createPoll(
          mirror.mirrorToken,
          Parse.int(deposit),
          title,
          description,
          link,
          executeMsg
        )
      );
    }
  );

const executePoll = exec
  .command('execute-poll <poll-id>')
  .description(`Executes the poll`, {
    pollId: '(int) poll id',
  })
  .action((pollId: string) => {
    handleExecCommand(exec, mirror =>
      mirror.gov.executePoll(Parse.int(pollId))
    );
  });

const endPoll = exec
  .command('end-poll <poll-id>')
  .description(`Ends a poll`, {
    pollId: '(int) poll id',
  })
  .action((pollId: string) => {
    handleExecCommand(exec, mirror => mirror.gov.endPoll(Parse.int(pollId)));
  });

const stakeVotingTokens = exec
  .command('stake-voting-tokens <amount>')
  .description(`Stake MIR tokens in governance`, {
    amount: '(Uint128) amount of MIR tokens to stake',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.gov.stakeVotingTokens(mirror.mirrorToken, Parse.int(amount))
    );
  });

const withdrawVotingTokens = exec
  .command('withdraw-voting-tokens <amount>')
  .description(`Unstake MIR tokens in governance`, {
    amount: '(Uint128) amount of MIR tokens to unstake',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.gov.withdrawVotingTokens(Parse.int(amount))
    );
  });

const query = new Command('gov');
query.description('Mirror Gov contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Gov contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.gov.getConfig());
  });

const getPoll = query
  .command('poll')
  .description('Query poll')
  .action((pollId: string) => {
    handleQueryCommand(query, mirror => mirror.gov.getPoll(Parse.int(pollId)));
  });

const getPolls = query
  .command('polls')
  .description('Query all polls')
  .option(
    '--filter <string>',
    `poll state to filter ('in progress', 'passed', 'rejected', 'executed')`
  )
  .option('--start-after <int>', 'poll ID to start query from')
  .option('--limit <int>', 'max results to return')
  .action(() => {
    handleQueryCommand(query, mirror => {
      if (
        getPolls.filter &&
        !(getPolls.filter in ['in_progress', 'passed', 'rejected', 'executed'])
      ) {
        throw new Error(
          `invalid filter ${getPolls.filter}; MUST be one of: 'in progress', 'passed', 'rejected', 'executed'`
        );
      }
      return mirror.gov.getPolls(
        getPolls.filter,
        Parse.int(getPolls.startAfter),
        Parse.int(getPolls.limit)
      );
    });
  });

const getStaker = query
  .command('staker <address>')
  .description('Query MIR staker', {
    staker: '(AccAddress) staker address to query',
  })
  .action((address: string) => {
    handleQueryCommand(query, mirror => mirror.gov.getStaker(address));
  });

const getState = query
  .command('state')
  .description('Query Mirror Gov state')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.gov.getState());
  });

export default {
  exec,
  query,
};
