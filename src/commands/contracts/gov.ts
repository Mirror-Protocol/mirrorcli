import { MirrorGov } from '@mirror-protocol/mirror.js';
import * as _ from 'lodash';

import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';

const exec = createExecMenu('gov', 'Mirror Gov contract functions');

const castVote = exec
  .command('cast-vote <poll-id> <vote-option> <amount>')
  .description(`Vote in an active poll`, {
    'poll-id': '(int) Poll ID',
    'vote-option': `(string) 'yes' or 'no'`,
    amount: '(Uint128) amount of staked MIR voting power to allocate',
  })
  .action((pollId: string, voteOption: string, amount: string) => {
    if (voteOption !== 'yes' && voteOption !== 'no') {
      throw new Error(
        `invalid vote option '${voteOption}', MUST be 'yes' or 'no'`
      );
    }
    handleExecCommand(exec, mirror =>
      mirror.gov.castVote(Parse.int(pollId), voteOption, Parse.uint128(amount))
    );
  });

const createPoll = exec
  .command('create-poll')
  .description(`Create a new poll`)
  .requiredOption('--title <string>', '*Title of poll')
  .requiredOption('--desc <string>', '*Poll description')
  .requiredOption('--deposit <Uint128>', '*deposit amount of MIR tokens')
  .option('--link <url>', 'URL with more information')
  .option(
    '--execute-to <AccAddress>',
    'contract to execute on (specify message with --execute-msg)'
  )
  .option('--execute-msg <json>', 'message to execute')
  .action(() => {
    let executeMsg: MirrorGov.ExecuteMsg;

    if (createPoll.executeTo || createPoll.executeMsg) {
      if (
        createPoll.executeTo === undefined ||
        createPoll.executeMsg === undefined
      ) {
        throw new Error(
          'both --execute-to and --execute-msg must be supplied if either is'
        );
      }
      executeMsg = {
        contract: createPoll.executeTo,
        msg: Buffer.from(createPoll.executeMsg).toString('base64'),
      };
    }

    handleExecCommand(exec, mirror =>
      mirror.gov.createPoll(
        mirror.mirrorToken,
        Parse.uint128(createPoll.deposit),
        createPoll.title,
        createPoll.desc,
        createPoll.link,
        executeMsg
      )
    );
  });

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

const stake = exec
  .command('stake <amount>')
  .description(`Stake MIR tokens in governance`, {
    amount: '(Uint128) amount of MIR tokens to stake',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.gov.stakeVotingTokens(mirror.mirrorToken, Parse.uint128(amount))
    );
  });

const unstake = exec
  .command('unstake [amount]')
  .description(`Unstake MIR tokens in governance`, {
    amount: '(Uint128) amount of MIR tokens to unstake',
  })
  .action((amount: string) => {
    handleExecCommand(exec, mirror =>
      mirror.gov.withdrawVotingTokens(Parse.uint128(amount))
    );
  });

const query = createQueryMenu('gov', 'Mirror Gov contract queries');
const getConfig = query
  .command('config')
  .description('Query Mirror Gov contract config')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.gov.getConfig());
  });

const getPoll = query
  .command('poll <poll-id>')
  .description('Query poll')
  .action((pollId: string) => {
    handleQueryCommand(query, mirror => mirror.gov.getPoll(Parse.int(pollId)));
  });

const getPolls = query
  .command('polls')
  .description('Query all polls')
  .option(
    '--filter <string>',
    `poll state to filter ('in_progress', 'passed', 'rejected', 'executed')`
  )
  .option('--start-after <int>', 'poll ID to start query from')
  .option('--limit <int>', 'max results to return')
  .action(() => {
    handleQueryCommand(query, mirror => {
      if (
        getPolls.filter &&
        !['in_progress', 'passed', 'rejected', 'executed'].includes(
          getPolls.filter
        )
      ) {
        throw new Error(
          `invalid filter ${getPolls.filter}; MUST be one of: 'in_progress', 'passed', 'rejected', 'executed'`
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
    handleQueryCommand(query, mirror =>
      mirror.gov.getStaker(Parse.accAddress(address))
    );
  });

const getState = query
  .command('state')
  .description('Query Mirror Gov state')
  .action(() => {
    handleQueryCommand(query, mirror => mirror.gov.getState());
  });

const getVoters = query
  .command('voters <poll-id>')
  .description('Query voter for a poll')
  .option('--start-after <string>', 'voter prefix to start query from')
  .option('--limit <int>', 'max results to return')
  .action((pollId: string) => {
    handleQueryCommand(query, mirror =>
      mirror.gov.getVoters(
        Parse.int(pollId),
        getVoters.startAfter,
        Parse.int(getVoters.limit)
      )
    );
  });

export default {
  exec,
  query,
};
