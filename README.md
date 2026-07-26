# 🛡️ CertiGuard

### Privacy-Preserving Certificate Verification on Midnight Network

CertiGuard is a decentralized certificate verification DApp built on the **Midnight Network**. It allows organizations to issue, verify, and revoke certificates while using cryptographic fingerprints instead of exposing complete certificate information on-chain.

The application combines a **Compact smart contract**, **Midnight.js**, **React**, **TypeScript**, and **Lace Wallet** to provide a privacy-focused certificate verification system.

---

## 📌 Problem Statement

Fake academic and professional certificates are difficult to detect using traditional verification systems.

Centralized certificate databases also introduce problems such as:

- Single points of failure
- Dependence on the issuing organization
- Manual verification processes
- Possibility of record manipulation
- Exposure of unnecessary personal information

CertiGuard addresses these problems by using blockchain-based verification while storing only a cryptographic fingerprint of certificate information on-chain.

---

## ✨ Features

- Issue certificates through a Midnight smart contract
- Verify certificate authenticity
- Revoke previously issued certificates
- SHA-256 certificate fingerprinting
- Midnight-compatible wallet integration
- Lace Wallet support
- Privacy-preserving issuer authentication
- Join an existing deployed verification contract
- Responsive React user interface
- Loading and error handling
- On-chain certificate status management

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Midnight Network | Privacy-preserving blockchain |
| Compact | Smart contract development |
| Midnight.js | DApp and blockchain integration |
| React | Frontend development |
| TypeScript | Application logic |
| Material UI | UI components and styling |
| Vite | Frontend build tooling |
| Lace Wallet | Midnight wallet integration |
| SHA-256 | Certificate fingerprint generation |
| Node.js | JavaScript runtime |
| npm | Package management |
| Git & GitHub | Version control |

---

## 🏗️ Architecture

CertiGuard is divided into four main components:

```text
                     ┌─────────────────────┐
                     │      CertiGuard     │
                     │      React UI       │
                     └──────────┬──────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Midnight.js API   │
                     └──────────┬──────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │   Lace Wallet   │       │ Compact Contract│
          │ Authentication  │       │ Issue / Verify  │
          └─────────────────┘       │    / Revoke     │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Midnight Network│
                                    └─────────────────┘
```

### Application Components

- `contract/` — Compact smart contract implementing certificate operations
- `api/` — Midnight.js integration between the contract and application
- `certificate-verification-cli/` — CLI and Midnight network utilities
- `certificate-verification-ui/` — React/TypeScript CertiGuard frontend

---

## 🔐 How CertiGuard Works

### 1. Certificate Input

The issuer enters certificate information such as:

```text
Student Name | Course | Certificate ID | Issue Date
```

### 2. SHA-256 Fingerprint

The frontend converts the certificate information into a SHA-256 fingerprint.

Conceptually:

```text
Certificate Information
        ↓
      SHA-256
        ↓
Cryptographic Fingerprint
```

The original certificate text does not need to be stored directly on the blockchain.

### 3. Issue Certificate

The certificate fingerprint is submitted to the Compact smart contract.

The contract records the certificate state as valid.

### 4. Verify Certificate

A verifier enters the certificate information.

CertiGuard generates the SHA-256 fingerprint again and checks it against the contract state.

If the information matches a valid certificate:

```text
✅ Genuine Certificate
```

Otherwise:

```text
❌ Fake, Revoked, or Incorrect Certificate
```

### 5. Revoke Certificate

An authorized issuer can revoke an issued certificate.

After revocation, the certificate will no longer be considered valid.

---

# 🚀 Installation and Setup

## Prerequisites

Before running CertiGuard, install:

- Git
- Node.js
- npm
- Midnight development dependencies
- A Chromium-based browser
- Lace Wallet with Midnight support

You should also have access to the Midnight Preprod environment when performing blockchain operations.

---

## 1. Clone the Repository

```bash
git clone https://github.com/CipherGriffin07/certificate-verification.git
```

Move into the project:

```bash
cd certificate-verification
```

---

## 2. Install Root Dependencies

```bash
npm install
```

---

## 3. Install Contract Dependencies

```bash
cd contract
npm install
cd ..
```

---

## 4. Install API Dependencies

```bash
cd api
npm install
cd ..
```

---

## 5. Install CLI Dependencies

```bash
cd certificate-verification-cli
npm install
cd ..
```

---

## 6. Install Frontend Dependencies

```bash
cd certificate-verification-ui
npm install
cd ..
```

---

# 💻 Running the Frontend

Move to the frontend:

```bash
cd certificate-verification-ui
```

Build the application:

```bash
npm run build
```

Start the production build locally:

```bash
npm run start
```

The terminal will display a local address similar to:

```text
http://127.0.0.1:8080
```

Open the displayed address in your browser.

> The exact port may vary depending on the local environment.

---

# 👛 Lace Wallet Setup

CertiGuard requires a Midnight-compatible wallet for blockchain transactions.

1. Install the Lace browser extension.
2. Open Lace Wallet.
3. Configure Midnight.
4. Select the **Preprod** network.
5. Ensure the wallet is synchronized.
6. Open CertiGuard.
7. Click **Create Contract**.
8. Authorize the DApp when Lace requests permission.

The application can then communicate with the wallet through the Midnight wallet connector.

---

# 🌙 Midnight Configuration

For the current development configuration:

```text
Network: Preprod
```

The application communicates with Midnight infrastructure through the configured Midnight.js providers.

For proof generation, the environment may use either a local or remote proof server depending on configuration.

---

# 📜 Smart Contract

The primary Compact contract is located at:

```text
contract/src/certificate-verification.compact
```

The contract implements three principal certificate operations:

```text
issueCertificate
verifyCertificate
revokeCertificate
```

### `issueCertificate`

Registers the cryptographic fingerprint of a certificate.

### `verifyCertificate`

Checks whether the supplied certificate fingerprint corresponds to the currently valid certificate state.

### `revokeCertificate`

Allows the authorized issuer to revoke a certificate.

---

# 🔒 Privacy Model

Privacy is a core design goal of CertiGuard.

## Public Information

The blockchain may contain information required for certificate verification, including:

- Certificate fingerprint/hash
- Certificate status
- Issuer public identifier
- Contract state

## Private Information

Sensitive issuer information remains private.

The issuer's secret key is maintained in private state and is not intentionally stored publicly on the ledger.

## Privacy-Preserving Authorization

The issuer proves that they are authorized to perform protected contract operations using the application's private witness mechanism.

The secret itself does not need to be publicly revealed for authorization.

---

# 📁 Project Structure

```text
certificate-verification/
│
├── api/
│   └── src/
│       ├── common-types.ts
│       ├── index.ts
│       └── utils/
│
├── certificate-verification-cli/
│   ├── src/
│   │   ├── config.ts
│   │   ├── generate-dust.ts
│   │   ├── index.ts
│   │   ├── launcher/
│   │   ├── midnight-wallet-provider.ts
│   │   └── wallet-utils.ts
│   └── package.json
│
├── certificate-verification-ui/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── contract/
│   ├── src/
│   │   ├── certificate-verification.compact
│   │   ├── index.ts
│   │   ├── witnesses.ts
│   │   └── test/
│   └── package.json
│
├── README.md
├── package.json
└── package-lock.json
```

---

# 🖥️ Using CertiGuard

## Create a Verification Contract

Open the application and select:

```text
Create Contract
```

Authorize CertiGuard through the connected Lace wallet.

The application will attempt to deploy a new certificate verification contract.

---

## Join an Existing Contract

Select:

```text
Join Contract
```

Enter the address of an existing CertiGuard contract.

The frontend will connect to that deployed contract.

---

## Issue a Certificate

Enter the certificate information into the certificate details field.

Example:

```text
Snehali Dey | Blockchain Development | CERT-001 | 2026
```

Click:

```text
Issue Certificate
```

The application hashes the information and submits the fingerprint through the smart contract.

---

## Verify a Certificate

Enter exactly the same certificate information and click:

```text
Verify
```

A successful verification displays:

```text
✅ Genuine certificate
```

An invalid, changed, or revoked certificate displays:

```text
❌ Fake, revoked, or incorrect certificate
```

---

## Revoke a Certificate

When the connected wallet is authorized as the issuer and the certificate is currently valid, select:

```text
Revoke
```

The certificate state is changed to revoked.

---

# 🌐 Contract Address

| Network | Contract Address |
|---|---|
| Preprod | `<PENDING>` |

A final deployed contract address should be inserted here after successful Preprod deployment.

---

# ⚠️ Current Deployment Status

The application, smart contract integration, API, CLI, and frontend have been implemented.

Final successful Preprod contract deployment depends on the availability and configuration of the Midnight Preprod wallet, proof server, and required network resources.

Therefore, the repository does not include a fabricated deployment address.

---

# 🧪 Development

After making frontend changes:

```bash
cd certificate-verification-ui
npm run build
npm run start
```

For Git version control:

```bash
git add .
git commit -m "describe your changes"
git push
```

---

# 🎯 Future Improvements

Potential extensions include:

- Multiple certificates per issuer
- Institution dashboards
- QR-code certificate verification
- Certificate PDF upload and fingerprinting
- Batch certificate issuance
- Multiple issuer support
- Verification history
- Improved decentralized identity integration
- Public verification portal
- Production Midnight deployment

---

# 👩‍💻 Author

**Snehali Dey**

GitHub: **CipherGriffin07**

---

# 📄 License

This project is developed as a demonstration of privacy-preserving certificate verification using the Midnight Network.
