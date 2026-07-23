# Drips Wave Grant Submission

**Project Name:** AttestFlow
**Tagline:** Verifiable On-Chain Attestation & Credential Protocol for Soroban

## One-Paragraph Description
AttestFlow is a comprehensive, privacy-preserving attestation protocol built on the Stellar Soroban smart contract platform. It solves the fragmentation of verifiable credentials in the Stellar ecosystem by providing a standardized Schema Registry and an Attester contract that stores unforgeable, GDPR-compliant data hashes on-chain. Together with a specialized TypeScript SDK, a high-concurrency event Indexer, and a seamless Next.js Web UI integrated with Freighter Wallet, AttestFlow empowers developers to instantly issue, explore, and verify credentials without building custom infrastructure from scratch.

## Repository Links
- **Smart Contracts:** [https://github.com/Femology/attestflow-contract](https://github.com/Femology/attestflow-contract)
- **App Monorepo (Web, SDK, Indexer):** [https://github.com/Femology/attestflow-app](https://github.com/Femology/attestflow-app)

## Repo Relationship Statement
The `attestflow-app` monorepo acts as the full-stack consumer of the `attestflow-contract` smart contracts. Specifically, the `@attestflow/sdk` dynamically maps TypeScript function calls to Soroban XDR payloads, bridging the Next.js frontend to the deployed Testnet contracts. Meanwhile, the `@attestflow/indexer` continuously polls the Soroban RPC to synchronize emitted contract events (like `SchemaCreated` and `AttestationIssued`) into a structured local database, powering the frontend's instant verification API.

## Deployed Contract Addresses (Soroban Testnet)
- **Schema Registry:** `CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH`
  - [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH)
- **Attester:** `CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO`
  - [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO)

## Demo Flow Checklist
- [ ] **Step 1:** Connect Freighter Wallet to the AttestFlow Next.js dashboard.
- [ ] **Step 2:** Navigate to "Create Schema", input a JSON schema definition, and sign the creation transaction.
- [ ] **Step 3:** Navigate to "Issue Attestation", select the newly minted Schema ID, input payload data, and sign the issuance transaction.
- [ ] **Step 4:** Navigate to the "Explorer" tab to view the synchronized data surfaced by the real-time Indexer.
- [ ] **Step 5:** Copy the generated `UID` and paste it into the "Verify" tab to demonstrate immediate cryptographic verification.
