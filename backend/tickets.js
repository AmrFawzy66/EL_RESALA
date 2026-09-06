const express = require('express');
const { pool, runTransaction, nextCode } = require('../db');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { logAudit } = require('../services/audit');

const router = express.Router();
router.use(requireAuth);

// GET /api/tickets/board  (declared before the /:id-style routes below —
// there are none here, but kept first for readability/grouping)
router.get(
  '/board',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT rt.*, c.name AS customer_name, c.phone AS customer_phone, u.full_name AS technician_name
       FROM repair_tickets rt
       JOIN customers c ON c.id = rt.customer_id
       LEFT JOIN users u ON u.id = rt.technician_id
       WHERE rt.status != 'Delivered_Closed'
       ORDER BY rt.created_at DESC`
    );
    res.json(rows);
  })
);

// POST /api/tickets
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const ticket = req.body || {};
    try {
      const result = await runTransaction(async (client) => {
        const code = await nextCode(client, 'RS', 'repair_tickets');
        const info = await client.query(
          `INSERT INTO repair_tickets
             (code, customer_id, device, imei, pattern_lock, problem, condition_checklist_json, estimated_cost, advance_paid, technician_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [
            code, ticket.customerId, ticket.device, ticket.imei || null, ticket.patternLock || null,
            ticket.problem, JSON.stringify(ticket.conditionChecklist || {}), ticket.estimatedCost || 0,
            ticket.advancePaid || 0, ticket.technicianId || null,
          ]
        );

        if (ticket.advancePaid > 0) {
          await client.query(
            `INSERT INTO cash_transactions (drawer_id, shift_id, type, amount, note) VALUES (1, $1, 'repair_advance_in', $2, $3)`,
            [ticket.shiftId || null, ticket.advancePaid, `عربون تذكرة ${code}`]
          );
          await client.query('UPDATE cash_drawers SET current_balance = current_balance + $1 WHERE id = 1', [ticket.advancePaid]);
        }

        await logAudit(client, ticket.technicianId, 'TICKET_CREATED', { code });
        return { ok: true, id: info.rows[0].id, code };
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ أثناء إنشاء التذكرة' });
    }
  })
);

// PATCH /api/tickets/:id/status  { status, finalCost, userId }
router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status, finalCost, userId } = req.body || {};
    const id = req.params.id;
    const closedAtExpr = status === 'Delivered_Closed' ? 'NOW()' : 'NULL';
    await pool.query(
      `UPDATE repair_tickets SET status = $1, final_cost = COALESCE($2, final_cost), closed_at = ${closedAtExpr} WHERE id = $3`,
      [status, finalCost ?? null, id]
    );
    await logAudit(pool, userId, 'TICKET_STATUS_CHANGE', { id, status });
    res.json({ ok: true });
  })
);

// POST /api/tickets/consume-part  { ticketId, partId, qty }
router.post(
  '/consume-part',
  asyncHandler(async (req, res) => {
    const { ticketId, partId, qty } = req.body || {};
    try {
      const result = await runTransaction(async (client) => {
        const { rows } = await client.query('SELECT * FROM spare_parts WHERE id = $1', [partId]);
        const part = rows[0];
        if (!part || part.qty < qty) throw new Error('كمية قطعة الغيار غير كافية');

        await client.query('UPDATE spare_parts SET qty = qty - $1 WHERE id = $2', [qty, partId]);
        await client.query(
          `INSERT INTO ticket_consumed_parts (ticket_id, part_id, qty, cost, price) VALUES ($1,$2,$3,$4,$5)`,
          [ticketId, partId, qty, part.cost, part.price]
        );
        return { ok: true };
      });
      res.json(result);
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || 'حدث خطأ' });
    }
  })
);

module.exports = router;
