/**
 * db.js
 * -----------------------------------------------------------------------
 * Central PostgreSQL connection pool for El-RESALA POS (web edition).
 * Replaces the original better-sqlite3 connection. Every query goes
 * through node-postgres (`pg`), which is async — unlike better-sqlite3 —
 * so every handler that touches the DB is now an async function.
 *
 * Schema bootstrap: schema.sql is executed once at startup. Every
 * statement in it is idempotent (IF NOT EXISTS), so this is safe to run
 * on every server boot.
 */

const fs = require('fs');
const path = require('path');
const { Pool, types } = require('pg');

// node-postgres returns NUMERIC/DECIMAL columns as strings by default
// (to avoid silent precision loss on very large numbers). Every money
// column in this schema (cost, price, balance, total, ...) is NUMERIC,
// and the frontend calls `.toFixed(2)` on these values exactly like it
// did with better-sqlite3's native REAL numbers — so we parse NUMERIC
// (OID 1700) back into a JS number for every query result, globally,
// once, here. Amounts in this app never approach the range where
// float precision loss would matter (retail prices/cash totals).
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));
// int8/bigint (e.g. an uncast COUNT(*)) also comes back as a string by
// default for the same reason — parse those to numbers too.
types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Add your Postgres connection string (e.g. from Supabase) to your .env file.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase/most managed Postgres providers require SSL; disable only
  // for a fully local/self-hosted Postgres without SSL configured.
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  // Unexpected error on an idle client — log, don't crash the process.
  console.error('Unexpected Postgres pool error:', err);
});

/** Runs a single query against the pool. */
function query(text, params) {
  return pool.query(text, params);
}

/**
 * Runs `fn(client)` inside a single Postgres transaction (BEGIN/COMMIT).
 * If `fn` throws, the transaction is rolled back and the error re-thrown
 * — mirrors the atomicity guarantee the original better-sqlite3
 * `runTransaction` gave for multi-table writes (sales checkout, wallet
 * cash movements, shift close, etc).
 */
async function runTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Generates a sequential, human-readable document code like INV-000123.
 * `executor` may be the pool or a transaction client — pass the client
 * when calling this from inside runTransaction so the count and the
 * insert that follows are consistent within the same transaction.
 */
async function nextCode(executor, prefix, tableName) {
  const { rows } = await executor.query(`SELECT COUNT(*)::int AS cnt FROM ${tableName}`);
  const seq = (rows[0].cnt + 1).toString().padStart(6, '0');
  return `${prefix}-${seq}`;
}

async function initDatabase() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf-8');
  await pool.query(schemaSql);
}

module.exports = {
  pool,
  query,
  runTransaction,
  nextCode,
  initDatabase,
};
