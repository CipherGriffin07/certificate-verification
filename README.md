# CertiGuard

A privacy-preserving certificate verification DApp built on the Midnight Network.

## What This Project Does

CertiGuard helps prevent fake certificates by creating a SHA-256 fingerprint of certificate information and verifying that fingerprint using a Midnight smart contract.

Users can:

- Issue a certificate
- Verify a certificate
- Revoke a certificate
- Connect using a Midnight-compatible wallet
- Join an existing deployed verification contract

## Contract Address

| Network | Contract Address |
|---|---|
| Preprod | `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` |

Deployment is intentionally left as the final manual step.

## Features

- Certificate issuance
- Certificate verification
- Certificate revocation
- SHA-256 certificate fingerprinting
- Midnight wallet integration
- Privacy-preserving issuer authentication
- Responsive web interface
- Loading and error states

## Privacy Model

### Public Information

The Midnight ledger stores:

- Certificate fingerprint/hash
- Certificate status
- Issuer public identifier
- Contract state

### Private Information

The issuer secret key remains in private state and is not stored publicly on the ledger.

### Privacy Guarantee

The issuer proves authorization using a private witness. The secret key itself is not publicly revealed.

## Smart Contract

The Compact contract contains three main circuits:

- `issueCertificate`
- `verifyCertificate`
- `revokeCertificate`

Contract source:

```text
contract/src/certificate-verification.compact