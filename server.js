/**
 * server.js — El-RESALA POS web backend entry point.
 * -----------------------------------------------------------------------
 * This replaces electron/main.js's `registerIpcHandlers()`. Every IPC
 * channel from the desktop app has a matching REST route here — see the
 * mapping table in README.md.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { initDatabase } = require('./db');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const devicesRoutes = require('./routes/devices');
const customersRoutes = require('./routes/customers');
const salesRoutes = require('./routes/sales');
const ticketsRoutes = require('./routes/tickets');
const walletsRoutes = require('./routes/wallets');
const shiftsRoutes = require('./routes/shifts');
const reportsRoutes = require('./routes/reports');
const printerRoutes = require('./routes/printer');
const whatsappRoutes = require('./routes/whatsapp');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 4000;

// FRONTEND_URL should be your Vercel deployment URL, e.g.
// https://el-resala-pos.vercel.app — set as an env var, comma-separated
// if you need more than one (e.g. production + preview URLs).
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow no-origin requests (curl, the print-agent) and any listed frontend origin.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

// Basic abuse protection on the login endpoint specifically.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', loginLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/wallets', walletsRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/print', printerRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/audit', auditRoutes);

// Centralized error handler — catches anything an async route handler
// throws that wasn't already caught locally, so the process never
// crashes on a bad request and the client always gets JSON back.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'حدث خطأ في السيرفر' });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`El-RESALA POS backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
