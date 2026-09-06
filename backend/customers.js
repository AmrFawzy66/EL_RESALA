const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth);

// GET /api/customers?query=&limit=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = req.query.query || '';
    const limit = Number(req.query.limit) || 30;
    const like = `%${query}%`;
    const { rows } = await pool.query(
      'SELECT * FROM customers WHERE name ILIKE $1 OR phone ILIKE $1 ORDER BY name ASC LIMIT $2',
      [like, limit]
    );
    res.json(rows);
  })
);

// POST /api/customers  (upsert)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const customer = req.body || {};
    if (customer.id) {
      await pool.query('UPDATE customers SET name=$1, phone=$2, notes=$3 WHERE id=$4', [
        customer.name, customer.phone || null, customer.notes || null, customer.id,
      ]);
      return res.json({ ok: true, id: customer.id });
    }
    const { rows } = await pool.query(
      'INSERT INTO customers (name, phone, notes) VALUES ($1,$2,$3) RETURNING id',
      [customer.name, customer.phone || null, customer.notes || null]
    );
    res.json({ ok: true, id: rows[0].id });
  })
);

module.exports = router;
