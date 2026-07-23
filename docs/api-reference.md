# Indexer API Reference

The `@attestflow/indexer` continuously polls Soroban RPC events and caches schemas and attestations into a highly concurrent SQLite (or PostgreSQL) database, exposing the following endpoints:

## GET `/health`
Check indexer sync status.
**Response:**
```json
{
  "status": "ok",
  "lastLedgerSynced": 1254388
}
```

## GET `/api/schemas`
Returns all created schemas ordered by creation time.
**Response:**
```json
[
  {
    "id": 1,
    "creator": "GC...",
    "schema_data": "",
    "revocable": 1,
    "created_at": 1718002021000
  }
]
```

## GET `/api/attestations/uid/:uid`
Returns full attestation details for a specific 32-byte UID hex.
**Response:**
```json
{
  "uid": "1a2b3c...",
  "schema_id": 1,
  "issuer": "GC...",
  "recipient": "GD...",
  "data_hash": "",
  "expiration_time": 0,
  "revoked": 0,
  "issued_at": 1718002045000
}
```

## GET `/api/attestations/recipient/:address`
Returns an array of attestations belonging to a specific recipient address.
