export interface Schema {
  id: bigint;
  creator: string;
  schemaData: string;
  revocable: boolean;
}

export interface Attestation {
  uid: string;
  schemaId: bigint;
  issuer: string;
  recipient: string;
  dataHash: string;
  expirationTime: bigint;
  revoked: boolean;
  issuedAt: bigint;
}

export interface SDKConfig {
  rpcUrl: string;
  networkPassphrase: string;
  schemaRegistryContractId: string;
  attesterContractId: string;
}
