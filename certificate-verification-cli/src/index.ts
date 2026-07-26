import { createInterface, type Interface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Buffer } from 'node:buffer';
import { WebSocket } from 'ws';

import {
  CertificateVerificationAPI,
  type CertificateVerificationDerivedState,
  certificateVerificationPrivateStateKey,
  type CertificateVerificationProviders,
  type DeployedCertificateVerificationContract,
  type PrivateStateId,
} from '../../api/src/index.js';

import { type WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';

import {
  ledger,
  type Ledger,
  CertificateState,
} from '../../contract/src/managed/certificate-verification/contract/index.js';

import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { type Logger } from 'pino';

import {
  type Config,
  StandaloneConfig,
} from './config.js';

import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

import {
  type ContractAddress,
} from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

import {
  assertIsContractAddress,
  toHex,
} from '@midnight-ntwrk/midnight-js-utils';

import { TestEnvironment } from '@midnight-ntwrk/testkit-js';

import { MidnightWalletProvider } from './midnight-wallet-provider.js';

import { randomBytes } from '../../api/src/utils/index.js';

import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';

import {
  syncWallet,
  waitForUnshieldedFunds,
} from './wallet-utils.js';

import { generateDust } from './generate-dust.js';

import {
  type CertificateVerificationPrivateState,
} from '../../contract/src/witnesses.js';


// Enables WebSocket support.
// @ts-expect-error Required by Apollo/WebSocket integration.
globalThis.WebSocket = WebSocket;


/**
 * Reads the current public ledger state of the
 * Certificate Verification contract.
 */
export const getCertificateLedgerState = async (
  providers: CertificateVerificationProviders,
  contractAddress: ContractAddress,
): Promise<Ledger | null> => {
  assertIsContractAddress(contractAddress);

  const contractState =
    await providers.publicDataProvider.queryContractState(
      contractAddress,
    );

  return contractState != null
    ? ledger(contractState.data)
    : null;
};


/**
 * Convert a 64-character hexadecimal certificate hash
 * into the Bytes<32> representation expected by Compact.
 */
const hexToBytes32 = (value: string): Uint8Array => {
  const cleaned = value.trim().replace(/^0x/, '');

  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    throw new Error(
      'Certificate hash must contain exactly 64 hexadecimal characters.',
    );
  }

  return new Uint8Array(Buffer.from(cleaned, 'hex'));
};


/**
 * Deploy or join a Certificate Verification contract.
 */
const DEPLOY_OR_JOIN_QUESTION = `
You can do one of the following:

  1. Deploy a new Certificate Verification contract
  2. Join an existing Certificate Verification contract
  3. Exit

Which would you like to do? `;


const deployOrJoin = async (
  providers: CertificateVerificationProviders,
  rli: Interface,
  logger: Logger,
): Promise<CertificateVerificationAPI | null> => {

  while (true) {
    const choice =
      await rli.question(DEPLOY_OR_JOIN_QUESTION);

    switch (choice) {

      case '1': {
        const api =
          await CertificateVerificationAPI.deploy(
            providers,
            logger,
          );

        logger.info(
          `Deployed contract at address: ${api.deployedContractAddress}`,
        );

        return api;
      }

      case '2': {
        const contractAddress =
          await rli.question(
            'What is the contract address (in hex)? ',
          );

        const api =
          await CertificateVerificationAPI.join(
            providers,
            contractAddress,
            logger,
          );

        logger.info(
          `Joined contract at address: ${api.deployedContractAddress}`,
        );

        return api;
      }

      case '3':
        logger.info('Exiting...');
        return null;

      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};


/**
 * Display public blockchain state.
 */
const displayLedgerState = async (
  providers: CertificateVerificationProviders,
  deployedContract: DeployedCertificateVerificationContract,
  logger: Logger,
): Promise<void> => {

  const contractAddress =
    deployedContract.deployTxData.public.contractAddress;

  const ledgerState =
    await getCertificateLedgerState(
      providers,
      contractAddress,
    );

  if (ledgerState === null) {
    logger.info(
      `No Certificate Verification contract found at ${contractAddress}`,
    );

    return;
  }

  let stateName = 'EMPTY';

  if (ledgerState.state === CertificateState.VALID) {
    stateName = 'VALID';
  }

  if (ledgerState.state === CertificateState.REVOKED) {
    stateName = 'REVOKED';
  }

  logger.info(`Certificate state: ${stateName}`);

  if (ledgerState.certificateHash.is_some) {
    logger.info(
      `Certificate hash: ${toHex(
        ledgerState.certificateHash.value,
      )}`,
    );
  } else {
    logger.info('Certificate hash: none');
  }

  logger.info(
    `Sequence: ${ledgerState.sequence}`,
  );

  logger.info(
    `Issuer public identifier: ${toHex(
      ledgerState.issuer,
    )}`,
  );
};


/**
 * Display private state.
 *
 * This secret key is local/private and is not stored
 * publicly on the Midnight ledger.
 */
const displayPrivateState = async (
  providers: CertificateVerificationProviders,
  logger: Logger,
): Promise<void> => {

  const privateState =
    await providers.privateStateProvider.get(
      certificateVerificationPrivateStateKey,
    );

  if (privateState === null) {
    logger.info(
      'No Certificate Verification private state exists.',
    );
  } else {
    logger.info(
      `Current issuer secret key: ${toHex(
        privateState.secretKey,
      )}`,
    );
  }
};


/**
 * Display combined public + private state.
 */
const displayDerivedState = (
  currentState:
    | CertificateVerificationDerivedState
    | undefined,

  logger: Logger,
): void => {

  if (currentState === undefined) {
    logger.info(
      'No Certificate Verification state is currently available.',
    );

    return;
  }

  let stateName = 'EMPTY';

  if (
    currentState.state ===
    CertificateState.VALID
  ) {
    stateName = 'VALID';
  }

  if (
    currentState.state ===
    CertificateState.REVOKED
  ) {
    stateName = 'REVOKED';
  }

  logger.info(
    `Certificate state: ${stateName}`,
  );

  logger.info(
    `Certificate hash: ${
      currentState.certificateHash
        ? toHex(currentState.certificateHash)
        : 'none'
    }`,
  );

  logger.info(
    `Sequence: ${currentState.sequence}`,
  );

  logger.info(
    `Issuer: ${
      currentState.isIssuer
        ? 'you'
        : 'another user'
    }`,
  );
};


/**
 * Main Certificate Verification CLI menu.
 */
const MAIN_LOOP_QUESTION = `
Certificate Verification DApp

You can do one of the following:

  1. Issue a certificate
  2. Verify a certificate
  3. Revoke certificate
  4. Display public ledger state
  5. Display private state
  6. Display derived state
  7. Exit

Which would you like to do? `;


const mainLoop = async (
  providers: CertificateVerificationProviders,
  rli: Interface,
  logger: Logger,
): Promise<void> => {

  const certificateApi =
    await deployOrJoin(
      providers,
      rli,
      logger,
    );

  if (certificateApi === null) {
    return;
  }

  let currentState:
    | CertificateVerificationDerivedState
    | undefined;

  const stateObserver = {
    next: (
      state: CertificateVerificationDerivedState,
    ) => {
      currentState = state;
    },
  };

  const subscription =
    certificateApi.state$.subscribe(
      stateObserver,
    );

  try {

    while (true) {

      const choice =
        await rli.question(
          MAIN_LOOP_QUESTION,
        );

      try {

        switch (choice) {

          case '1': {
            const hash =
              await rli.question(
                'Enter certificate hash (64 hex characters): ',
              );

            await certificateApi.issueCertificate(
              hexToBytes32(hash),
            );

            logger.info(
              'Certificate issued successfully.',
            );

            break;
          }

          case '2': {
            const hash =
              await rli.question(
                'Enter certificate hash to verify: ',
              );

            await certificateApi.verifyCertificate(
              hexToBytes32(hash),
            );

            logger.info(
              'Certificate is VALID.',
            );

            break;
          }

          case '3':
            await certificateApi.revokeCertificate();

            logger.info(
              'Certificate revoked successfully.',
            );

            break;

          case '4':
            await displayLedgerState(
              providers,
              certificateApi.deployedContract,
              logger,
            );

            break;

          case '5':
            await displayPrivateState(
              providers,
              logger,
            );

            break;

          case '6':
            displayDerivedState(
              currentState,
              logger,
            );

            break;

          case '7':
            logger.info('Exiting...');
            return;

          default:
            logger.error(
              `Invalid choice: ${choice}`,
            );
        }

      } catch (e) {
        logError(logger, e);

        logger.info(
          'Returning to main menu...',
        );
      }
    }

  } finally {
    subscription.unsubscribe();
  }
};


/**
 * Seed used only for local standalone development.
 */
const GENESIS_MINT_WALLET_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';


const WALLET_LOOP_QUESTION = `
You can do one of the following:

  1. Build a fresh wallet
  2. Build wallet from a seed
  3. Exit

Which would you like to do? `;


/**
 * Build or restore wallet.
 */
const buildWallet = async (
  config: Config,
  rli: Interface,
  logger: Logger,
): Promise<string | undefined> => {

  if (config instanceof StandaloneConfig) {
    return GENESIS_MINT_WALLET_SEED;
  }

  while (true) {

    const choice =
      await rli.question(
        WALLET_LOOP_QUESTION,
      );

    switch (choice) {

      case '1':
        return toHex(randomBytes(32));

      case '2':
        return await rli.question(
          'Enter your wallet seed: ',
        );

      case '3':
        logger.info('Exiting...');
        return undefined;

      default:
        logger.error(
          `Invalid choice: ${choice}`,
        );
    }
  }
};


/**
 * Main CLI application entry point.
 */
export const run = async (
  config: Config,
  testEnv: TestEnvironment,
  logger: Logger,
): Promise<void> => {

  const rli =
    createInterface({
      input,
      output,
      terminal: true,
    });

  const providersToBeStopped:
    MidnightWalletProvider[] = [];

  try {

    const envConfiguration =
      await testEnv.start();

    logger.info(
      `Environment started with configuration: ${JSON.stringify(
        envConfiguration,
      )}`,
    );

    const seed =
      await buildWallet(
        config,
        rli,
        logger,
      );

    if (seed === undefined) {
      return;
    }

    const walletProvider =
      await MidnightWalletProvider.build(
        logger,
        envConfiguration,
        seed,
      );

    providersToBeStopped.push(
      walletProvider,
    );

    const walletFacade:
      WalletFacade =
      walletProvider.wallet;

    await walletProvider.start();

    const unshieldedState =
      await waitForUnshieldedFunds(
        logger,
        walletFacade,
        envConfiguration,
        unshieldedToken(),
      );

    const nightBalance =
      unshieldedState.balances[
        unshieldedToken().raw
      ];

    if (nightBalance === undefined) {
      logger.info(
        'No funds received, exiting...',
      );

      return;
    }

    logger.info(
      `Your NIGHT wallet balance is: ${nightBalance}`,
    );

    if (config.generateDust) {

      const dustGeneration =
        await generateDust(
          logger,
          seed,
          unshieldedState,
          walletFacade,
        );

      if (dustGeneration) {

        logger.info(
          `Submitted dust generation registration transaction: ${dustGeneration}`,
        );

        await syncWallet(
          logger,
          walletFacade,
        );
      }
    }


    /**
     * These must exactly match the three circuit
     * names from certificate-verification.compact.
     */
    const zkConfigProvider =
      new NodeZkConfigProvider<
        | 'issueCertificate'
        | 'verifyCertificate'
        | 'revokeCertificate'
      >(config.zkConfigPath);


    const providers:
      CertificateVerificationProviders = {

      privateStateProvider:
        levelPrivateStateProvider<
          PrivateStateId,
          CertificateVerificationPrivateState
        >({
          privateStateStoreName:
            config.privateStateStoreName,

          signingKeyStoreName:
            `${config.privateStateStoreName}-signing-keys`,

          privateStoragePasswordProvider:
            () => {
              return 'Certificate-Verification-2026!';
            },

          accountId: seed,
        }),

      publicDataProvider:
        indexerPublicDataProvider(
          envConfiguration.indexer,
          envConfiguration.indexerWS,
        ),

      zkConfigProvider,

      proofProvider:
        httpClientProofProvider(
          envConfiguration.proofServer,
          zkConfigProvider,
        ),

      walletProvider,

      midnightProvider:
        walletProvider,
    };


    await mainLoop(
      providers,
      rli,
      logger,
    );

  } catch (e) {

    logError(logger, e);

    logger.info('Exiting...');

  } finally {

    try {

      rli.close();

      rli.removeAllListeners();

    } catch (e) {

      logError(logger, e);

    } finally {

      try {

        for (
          const wallet
          of providersToBeStopped
        ) {
          logger.info(
            'Stopping wallet...',
          );

          await wallet.stop();
        }

        if (testEnv) {

          logger.info(
            'Stopping test environment...',
          );

          await testEnv.shutdown();
        }

      } catch (e) {

        logError(logger, e);
      }
    }
  }
};


function logError(
  logger: Logger,
  e: unknown,
): void {

  if (e instanceof Error) {

    logger.error(
      `Found error '${e.message}'`,
    );

    logger.debug(
      `${e.stack}`,
    );

  } else {

    logger.error(
      'Found error (unknown type)',
    );
  }
}