const express = require('express');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();
router.use(requireAuth);

// GET /api/products?query=&category=&limit=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = req.query.query || '';
    const category = req.query.category || null;
    const limit = Number(req.query.limit) || 50;
    const like = `%${query}%`;

    const { rows } = await pool.query(
      `SELECT * FROM products
       WHERE is_active = TRUE
         AND (barcode = $1 OR name ILIKE $2 OR sku ILIKE $2)
         AND ($3::text IS NULL OR category = $3)
       ORDER BY name ASC LIMIT $4`,
      [query, like, category, limit]
    );
    res.json(rows);
  })
);

// GET /api/products/low-stock
router.get(
  '/low-stock',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE is_active = TRUE AND qty <= min_qty ORDER BY qty ASC'
    );
    res.json(rows);
  })
);

// POST /api/products  (upsert — same body shape as the old products:upsert IPC channel)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const product = req.body || {};
    if (product.id) {
      await pool.query(
        `UPDATE products SET barcode=$1, sku=$2, name=$3, category=$4, cost=$5, price=$6, wholesale_price=$7,
           qty=$8, min_qty=$9, image_path=$10, is_serialized=$11, updated_at=NOW()
         WHERE id=$12`,
        [
          product.barcode, product.sku, product.name, product.category, product.cost, product.price,
          product.wholesale_price || 0, product.qty, product.min_qty, product.image_path || null,
          Boolean(product.is_serialized), product.id,
        ]
      );
      return res.json({ ok: true, id: product.id });
    }

    const { rows } = await pool.query(
      `INSERT INTO products (barcode, sku, name, category, cost, price, wholesale_price, qty, min_qty, image_path, is_serialized)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [
        product.barcode, product.sku, product.name, product.category, product.cost, product.price,
        product.wholesale_price || 0, product.qty, product.min_qty, product.image_path || null,
        Boolean(product.is_serialized),
      ]
    );
    res.json({ ok: true, id: rows[0].id });
  })
);

module.exports = router;
