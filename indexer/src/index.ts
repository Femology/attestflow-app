import dotenv from 'dotenv';
import { setupDb } from './db';
import { pollSorobanEvents } from './indexer';
import { startServer } from './server';

dotenv.config();

const RPC_URL = process.env.RPC_URL || 'https://soroban-testnet.stellar.org';
const ATTESTER_ID = process.env.ATTESTER_ID || 'C_DUMMY_ATTESTER_ID';
const SCHEMA_REGISTRY_ID = process.env.SCHEMA_REGISTRY_ID || 'C_DUMMY_SCHEMA_REGISTRY_ID';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

async function main() {
  console.log('Starting AttestFlow Indexer...');
  setupDb();
  
  pollSorobanEvents(RPC_URL, ATTESTER_ID, SCHEMA_REGISTRY_ID);
  startServer(PORT);
}

main().catch(console.error);
