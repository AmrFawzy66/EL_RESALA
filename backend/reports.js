const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth);

// GET /api/reports/shift-detail/:shiftId
router.get(
  '/shift-detail/:shiftId',
  asyncHandler(async (req, res) => {
    const shiftId = req.params.shiftId;
    const { rows: shiftRows } = await pool.query(
      `SELECT s.*, u.full_name AS cashier_name FROM shifts s
       LEFT JOIN users u ON u.id = s.user_id WHERE s.id = $1`,
      [shiftId]
    );
    const shift = shiftRows[0];
    if (!shift) return res.json(null);

    const { rows: salesAgg } = await pool.query(
      `SELECT COUNT(*)::int AS cnt, COALESCE(SUM(total),0) AS total FROM sales WHERE shift_id = $1 AND status = 'completed'`,
      [shiftId]
    );
    const { rows: cashInAgg } = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total FROM cash_transactions
       WHERE shift_id = $1 AND type IN ('wallet_cash_in','manual_in','repair_advance_in')`,
      [shiftId]
    );
    const { rows: cashOutAgg } = await pool.query(
      `SELECT COALESCE(SUM(-amount),0) AS total FROM cash_transactions
       WHERE shift_id = $1 AND type IN ('wallet_cash_out','manual_out','expense_out','refund_out')`,
      [shiftId]
    );
    const { rows: walletFeesAgg } = await pool.query(
      `SELECT COALESCE(SUM(fee_earned),0) AS total FROM wallet_transactions WHERE shift_id = $1`,
      [shiftId]
    );
    const { rows: salesList } = await pool.query(
      `SELECT sa.code, sa.total, sa.paid_now, sa.debt_remaining, sa.payment_method, sa.created_at, c.name AS customer_name
       FROM sales sa LEFT JOIN customers c ON c.id = sa.customer_id
       WHERE sa.shift_id = $1 ORDER BY sa.created_at ASC`,
      [shiftId]
    );
    const { rows: cashTransactions } = await pool.query(
      'SELECT * FROM cash_transactions WHERE shift_id = $1 ORDER BY created_at ASC',
      [shiftId]
    );

    res.json({
      shiftId: shift.id,
      cashierName: shift.cashier_name,
      openedAt: shift.opened_at,
      closedAt: shift.closed_at,
      startFloat: Number(shift.start_float),
      endCounted: shift.end_counted !== null ? Number(shift.end_counted) : null,
      expectedBalance: shift.expected_balance !== null ? Number(shift.expected_balance) : null,
      variance: shift.variance !== null ? Number(shift.variance) : null,
      salesCount: salesAgg[0].cnt,
      salesTotal: Number(salesAgg[0].total),
      cashIn: Number(cashInAgg[0].total),
      cashOut: Number(cashOutAgg[0].total),
      walletFees: Number(walletFeesAgg[0].total),
      salesList,
      cashTransactions,
    });
  })
);

// GET /api/reports/shift-history?limit=
router.get(
  '/shift-history',
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 100;
    const { rows } = await pool.query(
      `SELECT s.*, u.full_name AS cashier_name FROM shifts s
       LEFT JOIN users u ON u.id = s.user_id
       ORDER BY s.opened_at DESC LIMIT $1`,
      [limit]
    );
    res.json(rows);
  })
);

// GET /api/reports/sales-range?startDate=&endDate=
router.get(
  '/sales-range',
  asyncHandler(async (req, res) => {
    const start = req.query.startDate || '0000-01-01';
    const end = req.query.endDate || '9999-12-31';
    const { rows } = await pool.query(
      `SELECT sa.code, sa.created_at, sa.subtotal, sa.discount, sa.total, sa.paid_now, sa.debt_remaining,
              sa.payment_method, sa.status, u.full_name AS cashier_name, c.name AS customer_name
       FROM sales sa
       LEFT JOIN users u ON u.id = sa.cashier_id
       LEFT JOIN customers c ON c.id = sa.customer_id
       WHERE sa.created_at::date BETWEEN $1::date AND $2::date
       ORDER BY sa.created_at DESC`,
      [start, end]
    );
    res.json(rows);
  })
);

// GET /api/reports/inventory-snapshot
router.get(
  '/inventory-snapshot',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT name, category, barcode, sku, qty, min_qty, cost, price,
              (qty * cost) AS stock_value_cost, (qty * price) AS stock_value_price
       FROM products WHERE is_active = TRUE ORDER BY category, name`
    );
    res.json(rows);
  })
);

// GET /api/reports/customers-debt
router.get(
  '/customers-debt',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT name, phone, debt_balance, notes FROM customers WHERE debt_balance > 0 ORDER BY debt_balance DESC`
    );
    res.json(rows);
  })
);

module.exports = router;
