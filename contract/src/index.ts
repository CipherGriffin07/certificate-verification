import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/certificate-verification/contract/index.js";
export * from "./witnesses";

import * as CompiledCertificateVerificationContract from "./managed/certificate-verification/contract/index.js";
import * as Witnesses from "./witnesses";

export const CompiledCertificateVerificationContractContract =
  CompiledContract.make<
    CompiledCertificateVerificationContract.Contract<Witnesses.CertificateVerificationPrivateState>
  >(
    "CertificateVerification",
    CompiledCertificateVerificationContract.Contract<Witnesses.CertificateVerificationPrivateState>,
  ).pipe(
    CompiledContract.withWitnesses(Witnesses.witnesses),
    CompiledContract.withCompiledFileAssets(
      "./managed/certificate-verification",
    ),
  );