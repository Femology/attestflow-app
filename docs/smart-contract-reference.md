# Smart Contract Reference

## Live Testnet Addresses
- **Schema Registry:** `CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH`
- **Attester:** `CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO`

---

## Schema Registry (`schema_registry.wasm`)

### `initialize`
- **Parameters:** `env: Env`, `admin: Address`
- **Authorization:** None (singleton function).
- **Return:** `Result<(), Error>`
- **Events Emitted:** None.

### `create_schema`
- **Parameters:** `env: Env`, `creator: Address`, `schema_data: Bytes`, `revocable: bool`
- **Authorization:** `creator.require_auth()`
- **Return:** `u64` (Schema ID)
- **Events Emitted:** `[Symbol("schema"), Symbol("created")] -> (u64, Address, bool)`

### `get_schema`
- **Parameters:** `env: Env`, `schema_id: u64`
- **Authorization:** None.
- **Return:** `Result<Schema, Error>`

---

## Attester (`attester.wasm`)

### `init_attester`
- **Parameters:** `env: Env`, `admin: Address`, `schema_registry: Address`
- **Authorization:** None.
- **Return:** `Result<(), Error>`

### `issue_attestation`
- **Parameters:** `env: Env`, `issuer: Address`, `recipient: Address`, `schema_id: u64`, `data_hash: BytesN<32>`, `expiration_time: u64`, `uid: BytesN<32>`
- **Authorization:** `issuer.require_auth()`
- **Return:** `Result<(), Error>`
- **Events Emitted:** `[Symbol("attest"), Symbol("issued")] -> (BytesN<32>, u64, Address, Address)`

### `revoke_attestation`
- **Parameters:** `env: Env`, `issuer: Address`, `uid: BytesN<32>`
- **Authorization:** `issuer.require_auth()`
- **Return:** `Result<(), Error>`
- **Events Emitted:** `[Symbol("attest"), Symbol("revoked")] -> (BytesN<32>, Address)`

### `verify_attestation`
- **Parameters:** `env: Env`, `uid: BytesN<32>`
- **Authorization:** None.
- **Return:** `bool`
