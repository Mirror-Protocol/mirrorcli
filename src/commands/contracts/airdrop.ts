import { Parse } from '../../util/parse-input';
import {
  createExecMenu,
  createQueryMenu,
  handleExecCommand,
  handleQueryCommand,
} from '../../util/contract-menu';
import { request, gql } from 'graphql-request';

const exec = createExecMenu(
  'airdrop',
  'Mirror Airdrop contract functions [mainnet only]'
);

const claim = exec
  .command('claim <stage> [amount]')
  .description(`Claim MIR airdrop reward`, {
    stage: '(int) stage of airdrop to claim',
    amount:
      '(Uint128) amount of MIR tokens to claim. If omitted, total amount will be fetched via Mirror API to claim all.',
  })
  .option(
    '--for-account <account>',
    `(AccAddress) - account address to claim for (if not provided, will use the specified key's account)`
  )
  .action(async (stage: string, amount?: string) => {
    await handleExecCommand(exec, async mirror => {
      let proof: string[];
      const { airdrop } = await request(
        'https://graph.mirror.finance/graphql',
        gql`
          query {
            airdrop(
              address: "${
                Parse.accAddress(claim.forAccount) || mirror.key.accAddress
              }"
              network: "TERRA"
            )
          }
        `
      );
      for (const stageData of airdrop) {
        if (stageData.stage === Parse.int(stage)) {
          if (amount === undefined) {
            amount = stageData.amount;
          }
          proof = JSON.parse(stageData.proof);
          break;
        }
        throw new Error(`Could not find stage ${stage} - ${airdrop}`);
      }
      return mirror.airdrop.claim(Parse.int(stage), amount, proof);
    });
  });

const query = createQueryMenu(
  'airdrop',
  'Mirror Airdrop contract queries [mainnet only]'
);
const getConfig = query
  .command('config')
  .description('Query Mirror Airdrop contract config')
  .action(async () => {
    await handleQueryCommand(query, mirror => mirror.airdrop.getConfig());
  });

const getIsClaimed = query
  .command('is-claimed <address> <stage>')
  .description('Query whether airdrop stage is claimed', {
    address: '(AccAddress) account to query',
    stage: '(int) stage of airdrop',
  })
  .action(async (address: string, stage: string) => {
    await handleQueryCommand(query, mirror =>
      mirror.airdrop.getIsClaimed(Parse.int(stage), Parse.accAddress(address))
    );
  });

const getLatestStage = query
  .command('latest-stage')
  .description('Query the latest stage of airdrop')
  .action(async () => {
    await handleQueryCommand(query, mirror => mirror.airdrop.getLatestStage());
  });

const getMerkleRoot = query
  .command('merkle-root <stage>')
  .description('Query merkle root of airdrop', {
    stage: '(int) stage of airdrop',
  })
  .action(async (stage: string) => {
    await handleQueryCommand(query, mirror =>
      mirror.airdrop.getMerkleRoot(Parse.int(stage))
    );
  });

export default {
  exec,
  query,
};
