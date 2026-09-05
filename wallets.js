const express = require('express');
const { pool, runTransaction } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth);

// GET /api/wallets
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM wallets WHERE is_active = TRUE ORDER BY name');
    res.json(rows);
  })
);

// POST /api/wallets/cash-out — customer receives cash from drawer, wallet balance increases,
// service fee recorded as pure shift profit.
router.post(
  '/cash-out',
  asyncHandler(async (req, res) => {
    const { walletId, amount, fee, shiftId, note } = req.body || {};
    try {
      await runTransaction(async (client) => {
        await client.query('UPDATE wallets SET balance = balance + $1 WHERE id = $2', [amount, walletId]);
        await client.query('UPDATE cash_drawers SET current_balance = current_balance - $1 WHERE id = 1', [amount]);

        await client.query(
          `INSERT INTO wallet_transactions (wallet_id, shift_id, type, amount, fee_earned, note) VALUES ($1,$2,'cash_out',$3,$4,$5)`,
          [walletId, shiftId || null, amount, fee || 0, note || null]
        );
        await client.query(
          `INSERT INTO cash_transactions (drawer_id, shift_id, type, amount, note) VALUES (1, $1, 'wallet_cash_out', $2, $3)`,
          [shiftId || null, -amount, note || 'سحب كاش للعميل']
        );
      });
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ' });
    }
  })
);

// POST /api/wallets/cash-in — customer deposits cash into drawer, wallet balance decreases
// (store transfers wallet balance to the client), fee recorded as profit.
router.post(
  '/cash-in',
  asyncHandler(async (req, res) => {
    const { walletId, amount, fee, shiftId, note } = req.body || {};
    try {
      await runTransaction(async (client) => {
        await client.query('UPDATE wallets SET balance = balance - $1 WHERE id = $2', [amount, walletId]);
        await client.query('UPDATE cash_drawers SET current_balance = current_balance + $1 WHERE id = 1', [amount]);

        await client.query(
          `INSERT INTO wallet_transactions (wallet_id, shift_id, type, amount, fee_earned, note) VALUES ($1,$2,'cash_in',$3,$4,$5)`,
          [walletId, shiftId || null, amount, fee || 0, note || null]
        );
        await client.query(
          `INSERT INTO cash_transactions (drawer_id, shift_id, type, amount, note) VALUES (1, $1, 'wallet_cash_in', $2, $3)`,
          [shiftId || null, amount, note || 'إيداع كاش للعميل']
        );
      });
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ' });
    }
  })
);

module.exports = router;
