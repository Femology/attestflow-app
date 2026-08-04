# AttestFlow SDK Guide

The `@attestflow/sdk` is a TypeScript library that provides a seamless interface for interacting with the AttestFlow Soroban smart contracts. It abstracts away XDR building, hashing, and TTL management.

## Installation

Install the SDK via your preferred package manager (ensure you are using Node 20+):

```bash
pnpm add @attestflow/sdk
# or
npm install @attestflow/sdk
# or
yarn add @attestflow/sdk
```

## Initialization

Import the SDK and instantiate it with your RPC and network configurations.

```typescript
import { AttestFlowSDK } from "@attestflow/sdk";

const sdk = new AttestFlowSDK({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  schemaRegistryContractId: "CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH",
  attesterContractId: "CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO",
});
```

## Creating a Schema Blueprint

To create a new schema, you must define the schema structure as a JSON object, convert it to a hex string, and build the transaction.

```typescript
// 1. Define schema
const schema = {
  name: "Event Ticket",
  description: "Proof of attendance for the Stellar Developer Summit",
  fields: [
    { name: "Event Name", type: "string" },
    { name: "Ticket Class", type: "string" }
  ]
};

// 2. Convert to Hex
const schemaJsonStr = JSON.stringify(schema);
const schemaHex = Buffer.from(schemaJsonStr).toString('hex');

// 3. Build Transaction (Requires Signature)
const issuerPublicKey = "G...";
const isRevocable = true;

const tx = await sdk.buildCreateSchemaTx(issuerPublicKey, schemaHex, isRevocable);
// Sign and submit 'tx' using Freighter or another wallet
```

## Issuing an Attestation

Issuing an attestation requires generating a deterministic UID, hashing the payload data off-chain, and invoking the attester contract.

```typescript
import { formatUid, hashData } from "@attestflow/sdk";

const recipientPublicKey = "G...";
const schemaId = 1n; 

// 1. Prepare data and hash it
const credentialData = {
  "Event Name": "Stellar Developer Summit",
  "Ticket Class": "VIP"
};
const dataPayload = JSON.stringify(credentialData);
const dataHashHex = hashData(dataPayload); // SHA-256 hash

// 2. Generate a Unique ID (UID)
const timestamp = Date.now().toString();
const uid = formatUid(issuerPublicKey, recipientPublicKey, schemaId, timestamp);

// 3. Set Expiration (0n for never expires)
const expirationTimestamp = 0n;

// 4. Build Transaction
const tx = await sdk.buildIssueAttestationTx(
  issuerPublicKey,
  recipientPublicKey,
  schemaId,
  dataHashHex,
  expirationTimestamp,
  uid
);
// Sign and submit 'tx' using Freighter
```

## Verifying an Attestation

To verify an attestation's existence and validity directly from the blockchain:

```typescript
try {
  const attestation = await sdk.verifyAttestation(uid);
  
  if (attestation.revoked) {
    console.log("Attestation is revoked!");
  } else if (attestation.expiration !== 0n && BigInt(Date.now()) > attestation.expiration) {
    console.log("Attestation is expired!");
  } else {
    console.log("Attestation is valid!", attestation);
  }
} catch (error) {
  console.log("Attestation not found or invalid UID.");
}
```
