import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

import type {
  CertificateState,
  CertificateVerificationPrivateState,
  Contract,
  Witnesses,
} from '../../contract/src/index';

export const certificateVerificationPrivateStateKey =
  'certificateVerificationPrivateState';

export type PrivateStateId =
  typeof certificateVerificationPrivateStateKey;

/**
 * Private state used by the Certificate Verification contract.
 */
export type PrivateStates = {
  readonly certificateVerificationPrivateState:
    CertificateVerificationPrivateState;
};

/**
 * Certificate Verification smart contract.
 */
export type CertificateVerificationContract = Contract<
  CertificateVerificationPrivateState,
  Witnesses<CertificateVerificationPrivateState>
>;

/**
 * Names of all circuits available in our contract:
 *
 * issueCertificate
 * verifyCertificate
 * revokeCertificate
 */
export type CertificateVerificationCircuitKeys = Exclude<
  keyof CertificateVerificationContract['impureCircuits'],
  number | symbol
>;

/**
 * Midnight providers required by our DApp.
 */
export type CertificateVerificationProviders = MidnightProviders<
  CertificateVerificationCircuitKeys,
  PrivateStateId,
  CertificateVerificationPrivateState
>;

/**
 * A deployed Certificate Verification contract.
 */
export type DeployedCertificateVerificationContract =
  FoundContract<CertificateVerificationContract>;

/**
 * Combined public + private state used by our frontend.
 */
export type CertificateVerificationDerivedState = {
  readonly state: CertificateState;

  readonly sequence: bigint;

  readonly certificateHash: Uint8Array | undefined;

  readonly issuer: Uint8Array;

  /**
   * True when the currently connected user is the issuer.
   */
  readonly isIssuer: boolean;
};