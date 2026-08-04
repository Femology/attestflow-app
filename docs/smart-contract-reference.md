# Smart Contract Reference

This document provides a technical overview of the two primary Soroban smart contracts that power the AttestFlow protocol: the `SchemaRegistry` and the `Attester`.

## Contract Deployments (Soroban Testnet)
*   **Schema Registry Contract ID:** `CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH`
*   **Attester Contract ID:** `CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO`

---

## 1. Schema Registry Contract (`schema_registry`)

The Schema Registry is responsible for storing and managing the blueprints for all attestations issued on the protocol.

### `create_schema(env: Env, creator: Address, schema_data: Bytes, revocable: bool)`
Registers a new attestation schema.
*   **Parameters:**
    *   `env` (Env): The Soroban environment.
    *   `creator` (Address): The address creating the schema.
    *   `schema_data` (Bytes): The hex-encoded JSON definition of the schema.
    *   `revocable` (bool): Whether attestations issued under this schema can be revoked.
*   **Returns:** `u64` (The newly generated `schema_id`).
*   **Authorization:** Requires `creator.require_auth()`.
*   **Events Emitted:**
    *   `topics: ["SchemaCreated", schema_id]`
    *   `data: [creator, schema_data, revocable]`

### `get_schema(env: Env, schema_id: u64)`
Retrieves a schema by its ID.
*   **Parameters:**
    *   `env` (Env): The Soroban environment.
    *   `schema_id` (u64): The unique identifier of the schema.
*   **Returns:** `Schema` (Struct containing `id`, `creator`, `schema_data`, `revocable`, `created_at`).
*   **Authorization:** None (Public read).

---

## 2. Attester Contract (`attester`)

The Attester contract manages the issuance, verification, and revocation of individual attestations.

### `issue_attestation(env: Env, issuer: Address, recipient: Address, schema_id: u64, data_hash: BytesN<32>, expiration: u64, uid: String)`
Issues a new attestation to a recipient.
*   **Parameters:**
    *   `env` (Env): The Soroban environment.
    *   `issuer` (Address): The address issuing the attestation. Must match the schema's creator.
    *   `recipient` (Address): The address receiving the attestation.
    *   `schema_id` (u64): The ID of the schema this attestation follows.
    *   `data_hash` (BytesN<32>): The SHA-256 hash of the off-chain credential data.
    *   `expiration` (u64): Timestamp (in milliseconds) when the attestation expires. Set to `0` for no expiration.
    *   `uid` (String): The deterministically generated unique identifier for the attestation.
*   **Returns:** `Void`.
*   **Authorization:** Requires `issuer.require_auth()`.
*   **Events Emitted:**
    *   `topics: ["AttestationIssued", uid]`
    *   `data: [issuer, recipient, schema_id, data_hash, expiration]`

### `revoke_attestation(env: Env, issuer: Address, uid: String)`
Revokes an existing attestation.
*   **Parameters:**
    *   `env` (Env): The Soroban environment.
    *   `issuer` (Address): The address requesting revocation. Must be the original issuer of the attestation.
    *   `uid` (String): The unique identifier of the attestation to revoke.
*   **Returns:** `Void`.
*   **Authorization:** Requires `issuer.require_auth()`.
*   **Events Emitted:**
    *   `topics: ["AttestationRevoked", uid]`
    *   `data: [issuer]`

### `verify_attestation(env: Env, uid: String)`
Verifies the current status of an attestation.
*   **Parameters:**
    *   `env` (Env): The Soroban environment.
    *   `uid` (String): The unique identifier of the attestation.
*   **Returns:** `Attestation` (Struct containing `uid`, `schema_id`, `issuer`, `recipient`, `data_hash`, `issued_at`, `expiration`, `revoked`).
*   **Authorization:** None (Public read).
*   **Notes:** Automatically bumps the TTL of the attestation record to ensure persistent availability.
