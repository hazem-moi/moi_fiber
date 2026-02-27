import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL ?? '';
const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';
const PORT = parseInt(process.env.PORT ?? '1234', 10);

const pool = new Pool({ connectionString: DATABASE_URL });

// Ensure yjs_docs table exists
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS yjs_docs (
      doc_key   TEXT PRIMARY KEY,
      project_id UUID,
      page_id   UUID,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      state     BYTEA
    )
  `);
}

const server = Server.configure({
  port: PORT,
  name: 'moi-fiber-realtime',

  async onAuthenticate(data) {
    const { token } = data;
    if (!token) throw new Error('No token provided');
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error('Invalid token');
    }
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const result = await pool.query(
          'SELECT state FROM yjs_docs WHERE doc_key = $1',
          [documentName],
        );
        if (result.rows.length > 0 && result.rows[0].state) {
          return result.rows[0].state;
        }
        return null;
      },
      store: async ({ documentName, state }) => {
        // Parse document name: project:{projectId}:page:{pageId}
        const parts = documentName.split(':');
        const projectId = parts[1] ?? null;
        const pageId = parts[3] ?? null;
        await pool.query(
          `INSERT INTO yjs_docs (doc_key, project_id, page_id, updated_at, state)
           VALUES ($1, $2, $3, NOW(), $4)
           ON CONFLICT (doc_key) DO UPDATE SET state = $4, updated_at = NOW()`,
          [documentName, projectId, pageId, Buffer.from(state)],
        );
      },
    }),
  ],
});

ensureTable().then(() => {
  server.listen();
  console.log(`Realtime server running on port ${PORT}`);
}).catch(console.error);
