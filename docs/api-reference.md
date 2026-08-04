# Indexer REST API Reference

The AttestFlow Indexer is a lightweight Node.js/Express service that polls the Soroban network for protocol events (`SchemaCreated`, `AttestationIssued`, `AttestationRevoked`) and caches them in a SQLite database. This provides a fast, read-optimized REST API for frontend applications to query historical data without overloading the RPC nodes.

**Base URL (Production):** `https://attestflow-indexer.onrender.com`

---

## Endpoints

### 1. Health Check
*   **Method:** `GET`
*   **Path:** `/health`
*   **Description:** Verifies the indexer is running and the database is connected.
*   **Response:**
    ```json
    {
      "status": "ok",
      "db": "connected"
    }
    ```

### 2. List Schemas
*   **Method:** `GET`
*   **Path:** `/api/schemas`
*   **Description:** Retrieves all schemas registered on the protocol.
*   **Response:** Array of Schema objects.
    ```json
    [
      {
        "id": 1,
        "creator": "CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO",
        "schema_data": "7b226e616d65223a2254657374227d",
        "revocable": 1,
        "created_at": "2026-08-04T12:00:00Z"
      }
    ]
    ```

### 3. Get Attestation by UID
*   **Method:** `GET`
*   **Path:** `/api/attestations/uid/:uid`
*   **Description:** Retrieves a specific attestation by its unique identifier.
*   **Response:**
    ```json
    {
      "uid": "CB4B...-CC4U...-1-1710000000",
      "issuer": "CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO",
      "recipient": "CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH",
      "schema_id": 1,
      "data_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "expiration": 0,
      "revoked": 0,
      "created_at": "2026-08-04T12:05:00Z"
    }
    ```
    *Returns 404 if not found.*

### 4. Get Attestations by Recipient
*   **Method:** `GET`
*   **Path:** `/api/attestations/recipient/:address`
*   **Description:** Retrieves all attestations issued to a specific public key.
*   **Response:** Array of Attestation objects.
    ```json
    [
      {
        "uid": "CB4B...-CC4U...-1-1710000000",
        "schema_id": 1,
        "data_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "revoked": 0
        // ...
      }
    ]
    ```
