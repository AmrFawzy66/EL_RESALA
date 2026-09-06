/**
 * scripts/seed.js
 * -----------------------------------------------------------------------
 * One-time bootstrap: creates the first "owner" login and the standard
 * set of Egyptian e-wallet ledgers so the app isn't empty on first use.
 * Safe to re-run — every insert checks for existence first.
 *
 * Usage (from the backend/ folder, after `npm install` and with your
 * .env file's DATABASE_URL pointing at your Postgres database):
 *
 *   node scripts/seed.js --username admin --password "ChangeMe123!" --name "مدير المحل"
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, initDatabase } = require('../db');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { username: 'admin', password: 'ChangeMe123!', name: 'مدير المحل' };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--username') out.username = args[++i];
    if (args[i] === '--password') out.password = args[++i];
    if (args[i] === '--name') out.name = args[++i];
  }
  return out;
}

async function main() {
  const { username, password, name } = parseArgs();

  await initDatabase();

  const { rows: existingRows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (existingRows.length === 0) {
    const hash = bcrypt.hashSync(password, 10);
    await pool.query(
      `INSERT INTO users (username, password_hash, full_name, role, permissions_json, is_active)
       VALUES ($1, $2, $3, 'owner', '{"all":true}', TRUE)`,
      [username, hash, name]
    );
    console.log(`Created owner account "${username}". Store this password safely — it is not recoverable from the hash.`);
  } else {
    console.log(`User "${username}" already exists — skipped.`);
  }

  const defaultWallets = ['فودافون كاش', 'إنستاباي', 'أورانج كاش', 'وي كاش', 'فوري'];
  for (const walletName of defaultWallets) {
    await pool.query(
      `INSERT INTO wallets (name, balance)
       SELECT $1, 0 WHERE NOT EXISTS (SELECT 1 FROM wallets WHERE name = $1)`,
      [walletName]
    );
  }

  console.log('Database seeded successfully.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
