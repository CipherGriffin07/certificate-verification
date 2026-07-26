import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum CertificateState { EMPTY = 0, VALID = 1, REVOKED = 2 }

export type Witnesses<PS> = {
  issuerSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  issueCertificate(context: __compactRuntime.CircuitContext<PS>,
                   newCertificateHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    givenHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCertificate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  issueCertificate(context: __compactRuntime.CircuitContext<PS>,
                   newCertificateHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    givenHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCertificate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array, sequenceNumber_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  issueCertificate(context: __compactRuntime.CircuitContext<PS>,
                   newCertificateHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifyCertificate(context: __compactRuntime.CircuitContext<PS>,
                    givenHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCertificate(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  publicKey(context: __compactRuntime.CircuitContext<PS>,
            sk_0: Uint8Array,
            sequenceNumber_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly state: CertificateState;
  readonly certificateHash: { is_some: boolean, value: Uint8Array };
  readonly sequence: bigint;
  readonly issuer: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
