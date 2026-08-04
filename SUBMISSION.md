# Drips Wave / Stellar Community Fund Submission

## Project Overview
*   **Project Name:** AttestFlow
*   **Tagline:** Verifiable On-Chain Attestation & Credential Protocol for Soroban
*   **Category:** Identity / Developer Tooling / Infrastructure

## Description
AttestFlow is a comprehensive, full-stack protocol enabling the creation, issuance, and verification of digital credentials on the Stellar Soroban network. By storing immutable hashes of data on-chain and preserving actual PII off-chain, AttestFlow provides a GDPR-compliant, unforgeable identity and attestation layer for Web3 applications.

The project consists of three core pillars:
1.  **Soroban Smart Contracts:** `SchemaRegistry` and `Attester` for managing the lifecycle of attestations.
2.  **AttestFlow SDK & Indexer:** A robust TypeScript SDK and an Express-based Indexer for rapid off-chain querying and transaction building.
3.  **Zero-Friction Web Interface:** A highly polished, mobile-responsive Next.js application that allows non-technical users to build schemas and issue credentials instantly.

## Live Deployments & Links
*   **Web Application (Live Demo):** https://attestflow-app-web.vercel.app
*   **Indexer API Endpoint:** https://attestflow-indexer.onrender.com/health
*   **GitHub Repository:** https://github.com/Femology/attestflow-app
*   **Soroban Testnet Contracts:**
    *   Schema Registry: `CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH`
    *   Attester: `CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO`

## Demo Video Checklist (2 Minutes)
When recording the submission demo video, ensure you capture the following flow:
- [ ] **0:00 - 0:20 | Introduction:** Show the landing page. Explain what AttestFlow solves (on-chain verification without PII).
- [ ] **0:20 - 0:50 | Create Schema:** Connect Freighter wallet. Go to "Create Schema", build a custom schema (e.g., "Event Ticket" with Name and Class), and submit to Soroban. Show the success toast/hash.
- [ ] **0:50 - 1:20 | Issue Attestation:** Navigate to "Issue". Select the newly created schema. Fill in a recipient wallet address and the dynamic form fields. Click Issue.
- [ ] **1:20 - 1:50 | Verification:** Copy the generated `UID`. Go to the "Verify" tab, paste the UID and the exact JSON data. Show the cryptographically verified checkmark.
- [ ] **1:50 - 2:00 | Conclusion:** Show the "Explore" tab populated by the Indexer, proving data is successfully tracked off-chain.

## Documentation Reference
Full technical documentation is located in the `/docs` directory:
*   [Protocol Mechanics](./docs/protocol-mechanics.md)
*   [Smart Contract Reference](./docs/smart-contract-reference.md)
*   [SDK Guide](./docs/sdk-guide.md)
*   [API Reference](./docs/api-reference.md)
