const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth);

// GET /api/devices/imei/:imei
router.get(
  '/imei/:imei',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT ds.*, p.name AS product_name FROM device_serials ds
       JOIN products p ON p.id = ds.product_id
       WHERE ds.imei1 = $1 OR ds.imei2 = $1`,
      [req.params.imei]
    );
    res.json(rows[0] || null);
  })
);

// GET /api/devices/in-stock?query=
router.get(
  '/in-stock',
  asyncHandler(async (req, res) => {
    const query = req.query.query || '';
    const like = `%${query}%`;
    const { rows } = await pool.query(
      `SELECT ds.*, p.name AS product_name FROM device_serials ds
       JOIN products p ON p.id = ds.product_id
       WHERE ds.status = 'In_Stock'
         AND (ds.imei1 ILIKE $1 OR ds.device_model ILIKE $1)
       ORDER BY ds.created_at DESC`,
      [like]
    );
    res.json(rows);
  })
);

// POST /api/devices
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const device = req.body || {};
    const { rows } = await pool.query(
      `INSERT INTO device_serials
         (product_id, imei1, imei2, serial_no, device_model, color, storage, battery_health, condition, supplier, cost, price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'In_Stock') RETURNING id`,
      [
        device.product_id, device.imei1, device.imei2 || null, device.serial_no || null,
        device.device_model, device.color || null, device.storage || null,
        device.battery_health ?? null, device.condition, device.supplier || null,
        device.cost, device.price,
      ]
    );
    res.json({ ok: true, id: rows[0].id });
  })
);

module.exports = router;
