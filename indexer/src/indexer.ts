import { rpc, xdr, scValToNative } from '@stellar/stellar-sdk';
import { getLastLedgerSynced, setLastLedgerSynced, insertSchema, insertAttestation, revokeAttestation } from './db';

const POLL_INTERVAL = 5000;

export async function pollSorobanEvents(rpcUrl: string, attesterContractId: string, schemaRegistryContractId: string) {
  const server = new rpc.Server(rpcUrl);

  const poll = async () => {
    try {
      const latestLedger = await server.getLatestLedger();
      const currentLedger = latestLedger.sequence;
      let lastSynced = getLastLedgerSynced();

      if (lastSynced === 0) {
        lastSynced = currentLedger - 100;
      }

      if (lastSynced < currentLedger) {
        const eventsRequest = {
          startLedger: lastSynced + 1,
          filters: [
            {
              type: "contract" as any,
              contractIds: [schemaRegistryContractId, attesterContractId]
            }
          ]
        };

        const response = await server.getEvents(eventsRequest);

        for (const evt of response.events) {
          if (evt.type !== 'contract') continue;
          
          const topics = evt.topic.map(t => scValToNative(t));
          
          if ((evt.contractId as unknown as string) === schemaRegistryContractId && topics[0] === 'schema') {
            if (topics[1] === 'created') {
              const value: any = scValToNative(evt.value);
              const schemaId = Number(value[0]);
              const creator = value[1].toString();
              const revocable = Boolean(value[2]);
              insertSchema(schemaId, creator, "", revocable);
            }
          }
          
          if ((evt.contractId as unknown as string) === attesterContractId && topics[0] === 'attest') {
            if (topics[1] === 'issued') {
              const value: any = scValToNative(evt.value);
              const uid = Buffer.from(value[0]).toString('hex');
              const schemaId = Number(value[1]);
              const issuer = value[2].toString();
              const recipient = value[3].toString();
              insertAttestation(uid, schemaId, issuer, recipient, "", 0, false, Date.now());
            } else if (topics[1] === 'revoked') {
              const value: any = scValToNative(evt.value);
              const uid = Buffer.from(value[0]).toString('hex');
              revokeAttestation(uid);
            }
          }
        }
        
        setLastLedgerSynced(currentLedger);
      }
    } catch (err) {
      console.error('Error polling events:', err);
    }
    
    setTimeout(poll, POLL_INTERVAL);
  };

  poll();
}
