import express from 'express';
import cors from 'cors';
import { db, getLastLedgerSynced } from './db';

export function startServer(port: number) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', lastLedgerSynced: getLastLedgerSynced() });
  });

  app.get('/api/schemas', (req, res) => {
    const schemas = db.prepare('SELECT * FROM schemas ORDER BY created_at DESC').all();
    res.json(schemas);
  });

  app.get('/api/schemas/:id', (req, res) => {
    const schema = db.prepare('SELECT * FROM schemas WHERE id = ?').get(req.params.id);
    if (schema) {
      res.json(schema);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.get('/api/attestations/uid/:uid', (req, res) => {
    const att = db.prepare('SELECT * FROM attestations WHERE uid = ?').get(req.params.uid);
    if (att) {
      res.json(att);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.get('/api/attestations/recipient/:address', (req, res) => {
    const atts = db.prepare('SELECT * FROM attestations WHERE recipient = ? ORDER BY issued_at DESC').all(req.params.address);
    res.json(atts);
  });

  app.get('/api/attestations/issuer/:address', (req, res) => {
    const atts = db.prepare('SELECT * FROM attestations WHERE issuer = ? ORDER BY issued_at DESC').all(req.params.address);
    res.json(atts);
  });

  app.listen(port, () => {
    console.log(`Indexer API server running on port ${port}`);
  });
}
