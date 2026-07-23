# Protocol Mechanics

## Lifecycle of an Attestation Schema

The AttestFlow protocol centers around the structured lifecycle of schemas and attestations:

1. **Registration (Schema Creation):** 
   - Entities or administrators broadcast a schema definition via the `create_schema` function on the Schema Registry contract.
   - The schema is issued a unique sequential `id` which is permanently stored in Soroban persistent storage.
2. **Issuance (Attestation):** 
   - Issuers utilize an existing schema `id` to grant an attestation to a `recipient` address. 
   - A unique identifier (`UID`) is generated off-chain using the issuer, recipient, schema ID, and timestamp.
   - The `attester` contract cross-calls the Schema Registry to ensure the schema exists before storing the attestation hash on-chain.
3. **Verification:**
   - Any verifier can pass a `UID` into the `verify_attestation` method to check if the attestation exists, has not expired, and has not been revoked.
   - Off-chain indexers provide REST API endpoints querying Soroban RPC for rapid, high-concurrency verification.
4. **Revocation:**
   - If a schema was marked as `revocable: true` at creation, the original issuer can revoke any specific `UID`.

## Identity & Privacy Model
AttestFlow natively complies with data privacy laws (e.g., GDPR). No Personally Identifiable Information (PII) is stored directly on the blockchain. Instead:
- Users construct their JSON payload off-chain.
- The payload is hashed (SHA-256) and only the 32-byte hash is published to the `attester` smart contract.
- If a user requests their data be deleted off-chain, the on-chain hash becomes useless for identifying individuals, completely mitigating PII leaks.

## TTL & Rent Management
To ensure state isn't pruned from the Soroban network due to rent expiration:
- **Instance Storage** is utilized for singleton administrative states and is bumped aggressively on every invocation.
- **Persistent Storage** is utilized for `Schema` and `Attestation` states. Whenever a new record is created, its TTL is artificially extended (e.g., 30+ days via `extend_ttl`) to ensure long-term survivability without needing immediate manual rent payments.
