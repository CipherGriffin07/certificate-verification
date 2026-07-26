import * as CertificateVerification from '../../contract/src/managed/certificate-verification/contract/index.js';

import {
  type ContractAddress,
  convertFieldToBytes,
} from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

import { type Logger } from 'pino';

import {
  type CertificateVerificationDerivedState,
  type CertificateVerificationContract,
  type CertificateVerificationProviders,
  type DeployedCertificateVerificationContract,
  certificateVerificationPrivateStateKey,
} from './common-types.js';

import { CompiledCertificateVerificationContractContract } from '../../contract/src/index.js';

import * as utils from './utils/index.js';

import {
  deployContract,
  findDeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';

import {
  combineLatest,
  map,
  tap,
  from,
  type Observable,
} from 'rxjs';

import { toHex } from '@midnight-ntwrk/midnight-js-utils';

import {
  type CertificateVerificationPrivateState,
  createCertificateVerificationPrivateState,
} from '../../contract/src/witnesses.js';


/**
 * API exposed by a deployed Certificate Verification contract.
 */
export interface DeployedCertificateVerificationAPI {
  readonly deployedContractAddress: ContractAddress;

  readonly state$: Observable<CertificateVerificationDerivedState>;

  issueCertificate: (
    certificateHash: Uint8Array,
  ) => Promise<void>;

  verifyCertificate: (
    certificateHash: Uint8Array,
  ) => Promise<void>;

  revokeCertificate: () => Promise<void>;
}


/**
 * API used by the application to interact with the
 * Certificate Verification smart contract.
 */
export class CertificateVerificationAPI
  implements DeployedCertificateVerificationAPI
{
  private constructor(
    public readonly deployedContract:
      DeployedCertificateVerificationContract,

    providers: CertificateVerificationProviders,

    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress =
      deployedContract.deployTxData.public.contractAddress;

    providers.privateStateProvider.setContractAddress(
      this.deployedContractAddress,
    );

    this.state$ = combineLatest(
      [
        /*
         * PUBLIC STATE
         *
         * Reads the information stored on the Midnight ledger.
         */
        providers.publicDataProvider
          .contractStateObservable(
            this.deployedContractAddress,
            { type: 'latest' },
          )
          .pipe(
            map((contractState) =>
              CertificateVerification.ledger(
                contractState.data,
              ),
            ),

            tap((ledgerState) =>
              logger?.trace({
                ledgerStateChanged: {
                  state: ledgerState.state,
                  sequence: ledgerState.sequence,
                  issuer: toHex(ledgerState.issuer),
                },
              }),
            ),
          ),

        /*
         * PRIVATE STATE
         *
         * Contains the issuer secret key.
         */
        from(
          providers.privateStateProvider.get(
            certificateVerificationPrivateStateKey,
          ) as Promise<CertificateVerificationPrivateState>,
        ),
      ],

      /*
       * Combine public ledger state with the user's
       * private state.
       */
      (ledgerState, privateState) => {
        const issuerPublicKey =
          CertificateVerification.pureCircuits.publicKey(
            privateState.secretKey,

            convertFieldToBytes(
              32,
              ledgerState.sequence,
              'api/src/index.ts',
            ),
          );

        return {
          state: ledgerState.state,

          sequence: ledgerState.sequence,

          certificateHash:
            ledgerState.certificateHash.value,

          issuer: ledgerState.issuer,

          isIssuer:
            toHex(ledgerState.issuer) ===
            toHex(issuerPublicKey),
        };
      },
    );
  }


  readonly deployedContractAddress: ContractAddress;

  readonly state$:
    Observable<CertificateVerificationDerivedState>;


  /**
   * Issues a new certificate.
   */
  async issueCertificate(
    certificateHash: Uint8Array,
  ): Promise<void> {
    this.logger?.info('Issuing certificate');

    const txData =
      await this.deployedContract.callTx.issueCertificate(
        certificateHash,
      );

    this.logger?.trace({
      transactionAdded: {
        circuit: 'issueCertificate',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }


  /**
   * Verifies that a supplied certificate hash matches
   * the certificate stored on Midnight.
   */
  async verifyCertificate(
    certificateHash: Uint8Array,
  ): Promise<void> {
    this.logger?.info('Verifying certificate');

    const txData =
      await this.deployedContract.callTx.verifyCertificate(
        certificateHash,
      );

    this.logger?.trace({
      transactionAdded: {
        circuit: 'verifyCertificate',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }


  /**
   * Revokes the currently issued certificate.
   */
  async revokeCertificate(): Promise<void> {
    this.logger?.info('Revoking certificate');

    const txData =
      await this.deployedContract.callTx.revokeCertificate();

    this.logger?.trace({
      transactionAdded: {
        circuit: 'revokeCertificate',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }


  /**
   * Deploy a new Certificate Verification contract.
   */
  static async deploy(
    providers: CertificateVerificationProviders,
    logger?: Logger,
  ): Promise<CertificateVerificationAPI> {
    logger?.info('Deploying Certificate Verification contract');

    const deployedContract =
      await deployContract(providers, {
        compiledContract:
          CompiledCertificateVerificationContractContract,

        privateStateId:
          certificateVerificationPrivateStateKey,

        initialPrivateState:
          createCertificateVerificationPrivateState(
            utils.randomBytes(32),
          ),
      });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData:
          deployedContract.deployTxData.public,
      },
    });

    return new CertificateVerificationAPI(
      deployedContract,
      providers,
      logger,
    );
  }


  /**
   * Join an already deployed Certificate Verification contract.
   */
  static async join(
    providers: CertificateVerificationProviders,
    contractAddress: ContractAddress,
    logger?: Logger,
  ): Promise<CertificateVerificationAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedContract =
      await findDeployedContract<
        CertificateVerificationContract
      >(providers, {
        contractAddress,

        compiledContract:
          CompiledCertificateVerificationContractContract,

        privateStateId:
          certificateVerificationPrivateStateKey,

        initialPrivateState:
          await CertificateVerificationAPI.getPrivateState(
            providers,
            contractAddress,
          ),
      });

    return new CertificateVerificationAPI(
      deployedContract,
      providers,
      logger,
    );
  }


  /**
   * Get existing private state or create a new issuer secret.
   */
  private static async getPrivateState(
    providers: CertificateVerificationProviders,
    contractAddress: ContractAddress,
  ): Promise<CertificateVerificationPrivateState> {
    providers.privateStateProvider.setContractAddress(
      contractAddress,
    );

    const existingPrivateState =
      await providers.privateStateProvider.get(
        certificateVerificationPrivateStateKey,
      );

    return (
      existingPrivateState ??
      createCertificateVerificationPrivateState(
        utils.randomBytes(32),
      )
    );
  }
}


export * as utils from './utils/index.js';

export * from './common-types.js';