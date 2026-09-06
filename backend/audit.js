/**
 * audit.js — writes to the immutable audit_logs table.
 * Identical purpose to logAudit() in the original Electron main.js.
 */
async function logAudit(executor, userId, actionType, details) {
  await executor.query(
    'INSERT INTO audit_logs (user_id, action_type, details) VALUES ($1, $2, $3)',
    [userId || null, actionType, JSON.stringify(details || {})]
  );
}

module.exports = { logAudit };
