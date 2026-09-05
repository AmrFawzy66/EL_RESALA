const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { logAudit } = require('../services/audit');

const router = express.Router();

// POST /api/auth/login  { username, password }
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = TRUE',
      [username]
    );
    const user = rows[0];
    if (!user) {
      return res.json({ ok: false, error: 'المستخدم غير موجود' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.json({ ok: false, error: 'كلمة المرور غير صحيحة' });
    }

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    await logAudit(pool, user.id, 'LOGIN', { username });

    const { password_hash, ...safeUser } = user;
    const token = signToken(user);
    return res.json({ ok: true, user: safeUser, token });
  })
);

// POST /api/auth/logout  { userId }  (requires auth)
router.post(
  '/logout',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.body || {};
    await logAudit(pool, userId || req.user.id, 'LOGOUT', {});
    return res.json({ ok: true });
  })
);

module.exports = router;
