import { Ledger } from "./managed/certificate-verification/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type CertificateVerificationPrivateState = {
  readonly secretKey: Uint8Array;
};

export const createCertificateVerificationPrivateState = (
  secretKey: Uint8Array,
): CertificateVerificationPrivateState => ({
  secretKey,
});

export const witnesses = {
  issuerSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, CertificateVerificationPrivateState>): [
    CertificateVerificationPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],
};