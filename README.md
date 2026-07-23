# AttestFlow

![Build Status](https://img.shields.io/github/actions/workflow/status/Femology/attestflow-app/ci.yml?branch=main)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban-purple.svg)

AttestFlow is a comprehensive schema and attestation protocol built on the Stellar Soroban smart contract platform. It provides a full-stack ecosystem for creating reusable schemas, issuing cryptographically secure attestations, and verifying them efficiently via a dedicated event indexer.

## Architecture

```text
+----------------+      +-------------------+      +-------------------------+
|    Web UI      | ---> |  @attestflow/sdk  | ---> |   Soroban RPC Network   |
| (Next.js App)  | <--- |  (TypeScript)     |      | (Schema & Attester SCs) |
+----------------+      +-------------------+      +-------------------------+
        |                                                       |
        |                                                       v
        |                                          +-------------------------+
        +----------------------------------------- | @attestflow/indexer     |
                (REST API Verification)            | (SQLite Event Database) |
                                                   +-------------------------+
```

## Monorepo Packages

| Package | Description |
|---------|-------------|
| **`packages/sdk`** (`@attestflow/sdk`) | TypeScript SDK for interacting with the Soroban Attestation Protocol. |
| **`indexer/`** (`@attestflow/indexer`) | Event indexer and REST API serving cached on-chain state. |
| **`apps/web/`** (`@attestflow/web`) | Next.js App Router Web UI featuring Freighter Wallet integration. |

## Quickstart Guide

### Prerequisites
- Node.js >= 20
- pnpm

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd attestflow-app

# Install dependencies
pnpm install

# Build all packages
pnpm --filter @attestflow/sdk build
pnpm --filter @attestflow/indexer build
pnpm --filter @attestflow/web build
```

### Environment Configuration
Create a `.env` file in the root or within specific packages based on `.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | Network Passphrase | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_SCHEMA_REGISTRY_ID` | Schema Registry Contract ID | `your_schema_registry_contract_id` |
| `NEXT_PUBLIC_ATTESTER_ID` | Attester Contract ID | `your_attester_contract_id` |
| `NEXT_PUBLIC_INDEXER_URL` | Local Indexer REST API URL | `http://localhost:3001` |

### Smart Contracts
The Soroban smart contracts (Schema Registry and Attester) are maintained in a separate repository:
[https://github.com/Femology/attestflow-contract](https://github.com/Femology/attestflow-contract)
