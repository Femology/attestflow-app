# SDK Guide

The `@attestflow/sdk` is a TypeScript wrapper simplifying interaction with the Soroban RPC and AttestFlow smart contracts.

## Installation
```bash
pnpm add @attestflow/sdk @stellar/stellar-sdk
```

## Initialization
```typescript
import { AttestFlowSDK } from "@attestflow/sdk";

const sdk = new AttestFlowSDK({
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  schemaRegistryContractId: "CC4UT6NXLX7GP33XOKQKHQZTN3TTUQ3MCHVOD77U5EMH2FPRXACYY6JH",
  attesterContractId: "CB4B22G5BMGCQQTH3MPNFF4MGLH342OP7PBLBBVK2XY3LCVSMYK4WPDO",
});
```

## Fetching a Schema (Read-only)
```typescript
const schemaId = 1n;
try {
  const schema = await sdk.getSchema(schemaId);
  console.log("Schema retrieved:", schema);
} catch (e) {
  console.error("Schema not found!");
}
```

## Building Transactions (Write)
The SDK builds XDR objects which must be signed by a wallet (e.g., Freighter) before submission.

### Create Schema
```typescript
const tx = await sdk.buildCreateSchemaTx(
  "G_YOUR_PUBLIC_KEY",
  "7b2274797065223a22646567726565227d", // Hex encoded schema definition
  true // Revocable
);
// Sign and submit `tx.toXDR()` via wallet
```

### Issue Attestation
```typescript
import { hashData, formatUid } from "@attestflow/sdk";

const recipient = "G_RECIPIENT_KEY";
const schemaId = 1n;
const rawData = JSON.stringify({ degree: "BSc Computer Science", year: 2026 });

const dataHash = hashData(rawData);
const uid = formatUid("G_YOUR_PUBLIC_KEY", recipient, schemaId, Date.now().toString());
const expirationTime = 0n; // Does not expire

const tx = await sdk.buildIssueAttestationTx(
  "G_YOUR_PUBLIC_KEY",
  recipient,
  schemaId,
  dataHash,
  expirationTime,
  uid
);
// Sign and submit `tx.toXDR()` via wallet
```
