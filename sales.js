const express = require('express');
const { runTransaction, nextCode } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { logAudit } = require('../services/audit');

const router = express.Router();
router.use(requireAuth);

// POST /api/sales/checkout
// Wrapped in a single DB transaction: sale header, line items, stock
// decrements, IMEI status flips, and cash drawer crediting all succeed
// or all roll back together — no partial sale can ever be recorded.
// This mirrors the exact guarantee the original better-sqlite3
// `runTransaction` gave in Electron's main.js.
router.post(
  '/checkout',
  asyncHandler(async (req, res) => {
    const payload = req.body || {};
    const { cashierId, customerId, shiftId, items, discount = 0, paidNow, paymentMethod } = payload;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: 'السلة فارغة' });
    }

    try {
      const result = await runTransaction(async (client) => {
        let subtotal = 0;
        for (const item of items) subtotal += item.unitPrice * item.qty;
        const total = subtotal - discount;
        const debtRemaining = Math.max(0, total - paidNow);
        const code = await nextCode(client, 'INV', 'sales');

        const saleInfo = await client.query(
          `INSERT INTO sales (code, cashier_id, customer_id, shift_id, subtotal, discount, total, paid_now, debt_remaining, payment_method)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [code, cashierId, customerId || null, shiftId || null, subtotal, discount, total, paidNow, debtRemaining, paymentMethod]
        );
        const saleId = saleInfo.rows[0].id;

        for (const item of items) {
          await client.query(
            `INSERT INTO sale_items (sale_id, product_id, serial_id, qty, unit_price, unit_cost)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [saleId, item.productId || null, item.serialId || null, item.qty, item.unitPrice, item.unitCost]
          );

          if (item.serialId) {
            // Serialized phone: flip status, never decrement qty by more than 1
            await client.query(
              `UPDATE device_serials SET status='Sold', sale_id=$1 WHERE id=$2 AND status='In_Stock'`,
              [saleId, item.serialId]
            );
          } else if (item.productId) {
            const upd = await client.query(
              'UPDATE products SET qty = qty - $1 WHERE id = $2 AND qty >= $1',
              [item.qty, item.productId]
            );
            if (upd.rowCount === 0) {
              throw new Error(`رصيد غير كافٍ للمنتج رقم ${item.productId}`);
            }
          }
        }

        if (debtRemaining > 0 && customerId) {
          await client.query('UPDATE customers SET debt_balance = debt_balance + $1 WHERE id = $2', [debtRemaining, customerId]);
        }

        if (paidNow > 0) {
          await client.query(
            `INSERT INTO cash_transactions (drawer_id, shift_id, type, amount, note) VALUES (1, $1, 'sale_in', $2, $3)`,
            [shiftId || null, paidNow, `فاتورة ${code}`]
          );
          await client.query('UPDATE cash_drawers SET current_balance = current_balance + $1 WHERE id = 1', [paidNow]);
        }

        await logAudit(client, cashierId, 'SALE_CREATED', { code, total, saleId });

        return { ok: true, saleId, code, subtotal, total, debtRemaining };
      });

      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ أثناء إتمام البيع' });
    }
  })
);

module.exports = router;
