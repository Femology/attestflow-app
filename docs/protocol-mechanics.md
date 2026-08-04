# AttestFlow Protocol Mechanics

AttestFlow is a verifiable on-chain attestation and credential protocol designed for the Stellar Soroban network. This document outlines the core mechanics, data lifecycle, privacy model, and storage strategies utilized by the protocol.

## 1. Lifecycle of an Attestation

The AttestFlow protocol revolves around two primary concepts: **Schemas** and **Attestations**.

### Registration (Schema Creation)
1. **Definition:** An entity (issuer) defines a Schema Blueprint, representing a specific type of credential (e.g., University Degree, KYC Verification).
2. **On-Chain Persistence:** The schema is stored on the Soroban network via the `SchemaRegistry` contract. It is assigned an incremental, globally unique `schema_id`.
3. **Indexing:** The off-chain Indexer detects the `SchemaCreated` Soroban event and caches the schema definition for rapid querying.

### Issuance
1. **Off-Chain Processing:** The issuer constructs the credential data payload off-chain and hashes it using SHA-256.
2. **Transaction:** The issuer invokes the `issue_attestation` function on the `Attester` contract, providing the `schema_id`, recipient address, data hash, and expiration timestamp.
3. **UID Generation:** A unique `uid` is deterministically generated to identify the attestation.
4. **On-Chain Storage:** The attestation metadata (hash, recipient, timestamps, revocation status) is recorded on-chain.

### Verification
1. **Data Presentation:** The recipient shares their raw credential data (JSON) and the `uid` with a verifier.
2. **Hash Comparison:** The verifier hashes the provided JSON and compares it against the on-chain hash associated with the `uid`.
3. **Validity Check:** The verifier checks if the attestation is expired or revoked.

### Revocation
1. **Authorization:** If a schema is marked as `revocable`, the original issuer can revoke specific attestations.
2. **State Update:** The issuer calls `revoke_attestation` on the `Attester` contract. The `revoked` flag for the `uid` is set to `true`.
3. **Immutability:** If a schema is created as immutable, attestations cannot be revoked, ensuring permanent validity.

---

## 2. Identity & Privacy Model (GDPR Compliance)

A fundamental design principle of AttestFlow is prioritizing user privacy and ensuring compliance with regulations like GDPR and CCPA.

### Zero On-Chain PII
AttestFlow **never** stores Personally Identifiable Information (PII) on the blockchain. 
*   **The Problem:** Blockchains are public, immutable ledgers. Storing names, emails, or IDs directly violates the "Right to be Forgotten."
*   **The Solution:** AttestFlow strictly stores **SHA-256 Hashes** of the credential data. The actual JSON payload remains off-chain (e.g., in a private database, IPFS, or the user's local wallet).

### Privacy by Design
*   **Selective Disclosure:** Users decide who to share the raw JSON payload with. Without the raw data, the on-chain hash is completely opaque and mathematically impossible to reverse-engineer.
*   **Compliance:** If a user requests data deletion, the issuer simply deletes the off-chain JSON. The on-chain hash remains but becomes an orphaned, meaningless string of characters, fulfilling GDPR requirements.

---

## 3. TTL & Rent Management on Soroban

Soroban employs a state expiration model to prevent state bloat. Data stored on the network requires "rent" to be paid, and if the Time-To-Live (TTL) expires, the data can be archived or deleted.

### Persistent Storage Strategy
AttestFlow utilizes Soroban's `Persistent` storage for critical state:
*   **Schemas (`schema_id` -> `Schema`)**: Must be permanently available for historical verification.
*   **Attestations (`uid` -> `Attestation`)**: Must be queryable at any time.

### Rent Extension (Bumping)
To ensure long-term availability without constant manual intervention, AttestFlow employs automatic TTL bumping:
1.  **Write Operations:** During `create_schema` and `issue_attestation`, the contracts automatically invoke `env.storage().persistent().extend_ttl(...)` to secure the data's lifespan for a significant duration (e.g., thousands of ledgers).
2.  **Read Operations:** The `verify_attestation` function also bumps the TTL. This creates a self-sustaining ecosystem: as long as an attestation is actively being verified by third parties, its storage rent is automatically prolonged, preventing it from archiving.
