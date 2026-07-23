import { Contract, rpc, TransactionBuilder, Address, nativeToScVal, scValToNative, Account } from '@stellar/stellar-sdk';
import type { Schema, Attestation, SDKConfig } from './types';

export class AttestFlowSDK {
  private rpc: rpc.Server;
  private networkPassphrase: string;
  private schemaRegistryContract: Contract;
  private attesterContract: Contract;

  constructor(config: SDKConfig) {
    this.rpc = new rpc.Server(config.rpcUrl);
    this.networkPassphrase = config.networkPassphrase;
    this.schemaRegistryContract = new Contract(config.schemaRegistryContractId);
    this.attesterContract = new Contract(config.attesterContractId);
  }

  async getSchema(schemaId: bigint): Promise<Schema> {
    const args = [nativeToScVal(schemaId, { type: 'u64' })];
    const dummyAccount = new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
    
    const response: any = await this.rpc.simulateTransaction(
      new TransactionBuilder(dummyAccount, {
        fee: '100',
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.schemaRegistryContract.call('get_schema', ...args))
        .setTimeout(0)
        .build()
    );
    const result = response.result;

    if (!result || !result.retval) {
      throw new Error('Schema not found or RPC error');
    }

    const value: any = scValToNative(result.retval);
    return {
      id: BigInt(value.id),
      creator: value.creator.toString(),
      schemaData: value.schema_data.toString('hex'),
      revocable: value.revocable,
    };
  }

  async getAttestation(uid: string): Promise<Attestation> {
    const args = [nativeToScVal(Buffer.from(uid, 'hex'))];
    const dummyAccount = new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
    
    const response: any = await this.rpc.simulateTransaction(
      new TransactionBuilder(dummyAccount, {
        fee: '100',
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.attesterContract.call('get_attestation', ...args))
        .setTimeout(0)
        .build()
    );
    const result = response.result;

    if (!result || !result.retval) {
      throw new Error('Attestation not found or RPC error');
    }

    const value: any = scValToNative(result.retval);
    return {
      uid: value.uid.toString('hex'),
      schemaId: BigInt(value.schema_id),
      issuer: value.issuer.toString(),
      recipient: value.recipient.toString(),
      dataHash: value.data_hash.toString('hex'),
      expirationTime: BigInt(value.expiration_time),
      revoked: value.revoked,
      issuedAt: BigInt(value.issued_at),
    };
  }

  async verifyAttestation(uid: string): Promise<boolean> {
    const args = [nativeToScVal(Buffer.from(uid, 'hex'))];
    const dummyAccount = new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
    
    const response: any = await this.rpc.simulateTransaction(
      new TransactionBuilder(dummyAccount, {
        fee: '100',
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.attesterContract.call('verify_attestation', ...args))
        .setTimeout(0)
        .build()
    );
    const result = response.result;

    if (!result || !result.retval) {
      return false;
    }

    return scValToNative(result.retval) as boolean;
  }

  async buildCreateSchemaTx(creatorPublicKey: string, schemaData: string, revocable: boolean) {
    const sourceAccount = await this.rpc.getAccount(creatorPublicKey);
    const args = [
      nativeToScVal(Address.fromString(creatorPublicKey)),
      nativeToScVal(Buffer.from(schemaData, 'hex')),
      nativeToScVal(revocable, { type: 'bool' })
    ];

    return new TransactionBuilder(sourceAccount, {
      fee: '100', 
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(this.schemaRegistryContract.call('create_schema', ...args))
      .setTimeout(30)
      .build();
  }

  async buildIssueAttestationTx(
    issuerPublicKey: string,
    recipient: string,
    schemaId: bigint,
    dataHash: string,
    expirationTime: bigint,
    uid: string
  ) {
    const sourceAccount = await this.rpc.getAccount(issuerPublicKey);
    const args = [
      nativeToScVal(Address.fromString(issuerPublicKey)),
      nativeToScVal(Address.fromString(recipient)),
      nativeToScVal(schemaId, { type: 'u64' }),
      nativeToScVal(Buffer.from(dataHash, 'hex')),
      nativeToScVal(expirationTime, { type: 'u64' }),
      nativeToScVal(Buffer.from(uid, 'hex'))
    ];

    return new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(this.attesterContract.call('issue_attestation', ...args))
      .setTimeout(30)
      .build();
  }

  async buildRevokeAttestationTx(issuerPublicKey: string, uid: string) {
    const sourceAccount = await this.rpc.getAccount(issuerPublicKey);
    const args = [
      nativeToScVal(Address.fromString(issuerPublicKey)),
      nativeToScVal(Buffer.from(uid, 'hex'))
    ];

    return new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(this.attesterContract.call('revoke_attestation', ...args))
      .setTimeout(30)
      .build();
  }
}
