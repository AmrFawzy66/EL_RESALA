const express = require('express');
const { pool, runTransaction } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { logAudit } = require('../services/audit');

const router = express.Router();
router.use(requireAuth);

// POST /api/shifts/open  { userId, startFloat }
router.post(
  '/open',
  asyncHandler(async (req, res) => {
    const { userId, startFloat } = req.body || {};
    const { rows } = await pool.query(
      `INSERT INTO shifts (user_id, start_float, status) VALUES ($1,$2,'open') RETURNING id`,
      [userId, startFloat]
    );
    await logAudit(pool, userId, 'SHIFT_OPEN', { startFloat });
    res.json({ ok: true, shiftId: rows[0].id });
  })
);

// POST /api/shifts/close  { shiftId, userId, endCounted }
router.post(
  '/close',
  asyncHandler(async (req, res) => {
    const { shiftId, userId, endCounted } = req.body || {};
    try {
      const result = await runTransaction(async (client) => {
        const { rows: shiftRows } = await client.query('SELECT * FROM shifts WHERE id = $1', [shiftId]);
        const shift = shiftRows[0];
        if (!shift) throw new Error('الوردية غير موجودة');

        const { rows: cashRows } = await client.query(
          'SELECT COALESCE(SUM(amount),0) AS total FROM cash_transactions WHERE shift_id = $1',
          [shiftId]
        );
        const expectedBalance = Number(shift.start_float) + Number(cashRows[0].total);
        const variance = endCounted - expectedBalance;

        await client.query(
          `UPDATE shifts SET closed_at = NOW(), end_counted = $1, expected_balance = $2, variance = $3, status = 'closed' WHERE id = $4`,
          [endCounted, expectedBalance, variance, shiftId]
        );

        await logAudit(client, userId, 'SHIFT_CLOSE', { shiftId, expectedBalance, endCounted, variance });
        return { ok: true, expectedBalance, variance };
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ' });
    }
  })
);

module.exports = router;
