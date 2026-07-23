import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'attestflow.db');
const db = new Database(dbPath);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schemas (
      id INTEGER PRIMARY KEY,
      creator TEXT,
      schema_data TEXT,
      revocable INTEGER,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS attestations (
      uid TEXT PRIMARY KEY,
      schema_id INTEGER,
      issuer TEXT,
      recipient TEXT,
      data_hash TEXT,
      expiration_time INTEGER,
      revoked INTEGER,
      issued_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS indexer_state (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

export function getLastLedgerSynced(): number {
  const row: any = db.prepare('SELECT value FROM indexer_state WHERE key = ?').get('lastLedgerSynced');
  return row ? parseInt(row.value, 10) : 0;
}

export function setLastLedgerSynced(ledger: number) {
  db.prepare(`
    INSERT INTO indexer_state (key, value) VALUES ('lastLedgerSynced', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(ledger.toString());
}

export function insertSchema(id: number, creator: string, schema_data: string, revocable: boolean) {
  db.prepare(`
    INSERT OR IGNORE INTO schemas (id, creator, schema_data, revocable, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, creator, schema_data, revocable ? 1 : 0, Date.now());
}

export function insertAttestation(
  uid: string,
  schema_id: number,
  issuer: string,
  recipient: string,
  data_hash: string,
  expiration_time: number,
  revoked: boolean,
  issued_at: number
) {
  db.prepare(`
    INSERT OR IGNORE INTO attestations (uid, schema_id, issuer, recipient, data_hash, expiration_time, revoked, issued_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(uid, schema_id, issuer, recipient, data_hash, expiration_time, revoked ? 1 : 0, issued_at);
}

export function revokeAttestation(uid: string) {
  db.prepare('UPDATE attestations SET revoked = 1 WHERE uid = ?').run(uid);
}

export { db };
