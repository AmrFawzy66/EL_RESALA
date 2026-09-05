# El-RESALA POS — Web Edition

This is the web version of El-RESALA POS, converted from the original
Electron desktop app. It's split into three independent pieces:

```
el-resala-web/
├── backend/       Express + PostgreSQL API — deploy this to Render (or Railway)
├── frontend/      React app — deploy this to Vercel
└── print-agent/   Small script that runs on the shop's cashier PC and
                   talks to your actual thermal/label printers
```

## Why three pieces, not one?

A browser (or a cloud server) has no way to open a direct network
connection to a printer sitting on your shop's local WiFi/LAN — that
only works from a device that is physically on the same network. So:

- **frontend** — the UI everyone uses, from any device, anywhere.
- **backend** — the database + business logic (sales, stock, shifts,
  wallets, tickets...), reachable from the frontend over the internet.
- **print-agent** — a tiny always-on helper that runs on the one PC in
  the shop connected to your thermal receipt printer and barcode label
  printer. It asks the backend "any receipts waiting to print?" every
  few seconds and prints them the moment a sale happens anywhere.

Everything else (login, POS, inventory, tickets, wallets, reports,
Excel export, A4 report printing via your browser's own print dialog)
works directly between the frontend and backend — only the *silent
thermal receipt/label printing* needs the print-agent.

---

## 1. Set up the database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, go to **Project Settings → Database → Connection
   string**, and copy the **URI** (choose the "Transaction pooler" one
   if offered — it's the one meant for apps like this).
3. You don't need to run the schema manually — the backend does it
   automatically on first boot (see step 2). Keep the connection string
   handy for `DATABASE_URL`.

## 2. Deploy the backend (Render)

1. Push this whole `el-resala-web` folder to a GitHub repo (or just the
   `backend/` folder as its own repo — either works, just point Render
   at the right subfolder).
2. On [render.com](https://render.com), create a new **Web Service**,
   pointing at your repo. Set:
   - **Root directory**: `backend` (if you pushed the whole monorepo)
   - **Build command**: `npm install`
   - **Start command**: `npm start`
3. Add these environment variables in Render's dashboard (see
   `backend/.env.example` for the full list and explanations):
   - `DATABASE_URL` — from Supabase, step 1
   - `JWT_SECRET` — generate with:
     `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `AGENT_API_KEY` — generate the same way (a different value)
   - `FRONTEND_URL` — you'll fill this in after step 3 (your Vercel URL)
4. Deploy. Once it's live, note the backend's URL, e.g.
   `https://el-resala-api.onrender.com`.
5. Create your first login (the "owner" account) by running the seed
   script once, either via Render's shell/console feature or locally
   with the same `DATABASE_URL` in a `.env` file:
   ```
   cd backend
   npm install
   node scripts/seed.js --username admin --password "ChangeMe123!" --name "مدير المحل"
   ```
   **Change this password after your first login** — there's no
   "forgot password" flow yet, so store it safely.

## 3. Deploy the frontend (Vercel)

1. On [vercel.com](https://vercel.com), import the same repo, with
   **Root Directory** set to `frontend`.
2. Add an environment variable: `VITE_API_URL` = your Render backend
   URL from step 2 (no trailing slash).
3. Deploy. Vercel will give you a URL like
   `https://el-resala-pos.vercel.app`.
4. Go back to Render and set `FRONTEND_URL` to this Vercel URL (so CORS
   allows the frontend to talk to the backend), then redeploy the
   backend so the change takes effect.

## 4. Set up the print-agent (on the shop's cashier PC)

This is the one piece that stays a normal Node.js script running on a
physical Windows/Mac/Linux PC in the shop — not deployed to the cloud.

1. Copy the `print-agent/` folder onto the till PC (a USB stick or a
   `git clone` both work).
2. Install [Node.js](https://nodejs.org) (v18+) on that PC if it isn't
   already there.
3. Open a terminal in the `print-agent` folder and run:
   ```
   npm install
   copy .env.example .env      (Windows)
   cp .env.example .env        (Mac/Linux)
   ```
4. Edit `.env` and fill in:
   - `BACKEND_URL` — your Render backend URL
   - `AGENT_API_KEY` — **the exact same value** you set in the
     backend's `AGENT_API_KEY`
   - `RECEIPT_PRINTER_IP` / `RECEIPT_PRINTER_PORT` — your thermal
     receipt printer's network address (same as before, in the old
     desktop app's Settings screen)
   - `LABEL_PRINTER_IP` / `LABEL_PRINTER_PORT` — your barcode label
     printer's network address
5. Start it:
   ```
   npm start
   ```
   Leave this terminal/window running. For it to survive PC restarts,
   use a process manager like [pm2](https://pm2.keymetrics.io/)
   (`npm i -g pm2 && pm2 start agent.js --name el-resala-print-agent
   && pm2 save`) or a Windows Scheduled Task that runs `npm start` on
   login.

That's it — the whole system is live. Cashiers can log in from any
device/browser at your Vercel URL, and every receipt/label print
request will be picked up and printed within a couple of seconds by
the PC running the print-agent.

---

## What changed from the desktop version (read this before using it)

- **Printer IP settings**: the Settings screen in the app still has
  printer IP/port fields, but they're now just a reference — the
  values that actually matter are in `print-agent/.env` on the shop
  PC. Keep both in sync manually.
- **Login sessions**: the web version keeps you logged in across page
  refreshes (stored in the browser). Sessions expire after 12 hours
  by default (`JWT_EXPIRES_IN` in the backend's `.env`) — change this
  if you want cashiers to stay logged in longer.
- **Open shift after a refresh**: same as the original desktop app —
  refreshing the page (or restarting the app) clears the "currently
  open shift" indicator from the screen, even though the shift is
  still open in the database. If this happens, ask a manager to check
  **Reports → سجل الورديات** to find the still-open shift, or extend
  the app to restore it automatically if this becomes a pain point.
- **Invoice/ticket numbering** (`INV-000123`, `RS-000123`): still
  generated by counting existing rows, exactly like the original. With
  multiple cashiers hitting the API at the exact same instant from
  different devices, there's a small theoretical chance of a
  duplicate-number collision that didn't exist with a single-user
  desktop app. In practice, for a single shop this is extremely
  unlikely; if it ever becomes a real problem, this is the first thing
  to harden (e.g. a proper database sequence per document type).
- **WhatsApp**: clicking a WhatsApp button now opens a new browser tab
  to `wa.me` instead of your OS's default browser — same underlying
  link, just opened differently since there's no desktop "OS shell" to
  hand off to anymore.

## Local development

**Backend:**
```
cd backend
npm install
cp .env.example .env    # fill in DATABASE_URL, JWT_SECRET, AGENT_API_KEY
npm run dev
```

**Frontend:**
```
cd frontend
npm install
cp .env.example .env    # set VITE_API_URL=http://localhost:4000
npm run dev
```

**Print-agent** (optional locally — only needed to actually test
printing against a real printer):
```
cd print-agent
npm install
cp .env.example .env
npm start
```

## API reference (IPC channel → REST route mapping)

| Old Electron IPC channel      | New REST route                              |
|--------------------------------|----------------------------------------------|
| `auth:login`                  | `POST /api/auth/login`                       |
| `auth:logout`                 | `POST /api/auth/logout`                      |
| `products:search`             | `GET /api/products`                          |
| `products:lowStock`           | `GET /api/products/low-stock`                |
| `products:upsert`             | `POST /api/products`                         |
| `devices:findByImei`          | `GET /api/devices/imei/:imei`                |
| `devices:inStock`             | `GET /api/devices/in-stock`                  |
| `devices:create`              | `POST /api/devices`                          |
| `customers:search`            | `GET /api/customers`                         |
| `customers:upsert`            | `POST /api/customers`                        |
| `sales:checkout`              | `POST /api/sales/checkout`                   |
| `tickets:create`               | `POST /api/tickets`                          |
| `tickets:updateStatus`         | `PATCH /api/tickets/:id/status`              |
| `tickets:consumePart`          | `POST /api/tickets/consume-part`             |
| `tickets:board`                | `GET /api/tickets/board`                     |
| `wallets:list`                 | `GET /api/wallets`                           |
| `wallets:cashOut`              | `POST /api/wallets/cash-out`                 |
| `wallets:cashIn`               | `POST /api/wallets/cash-in`                  |
| `shifts:open`                  | `POST /api/shifts/open`                      |
| `shifts:close`                 | `POST /api/shifts/close`                     |
| `reports:shiftDetail`          | `GET /api/reports/shift-detail/:shiftId`     |
| `reports:shiftHistory`         | `GET /api/reports/shift-history`             |
| `reports:salesRange`           | `GET /api/reports/sales-range`               |
| `reports:inventorySnapshot`    | `GET /api/reports/inventory-snapshot`        |
| `reports:customersDebt`        | `GET /api/reports/customers-debt`            |
| `printer:printSaleReceipt`     | `POST /api/print/sale-receipt` (queued)      |
| `printer:printRepairIntake`    | `POST /api/print/repair-intake` (queued)     |
| `printer:printShiftReport`     | `POST /api/print/shift-report` (queued)      |
| `printer:kickDrawer`           | `POST /api/print/kick-drawer` (queued)       |
| `printer:printLabel`           | `POST /api/print/label` (queued)             |
| `whatsapp:getLink`             | `POST /api/whatsapp/link`                    |
| `whatsapp:openChat`            | `POST /api/whatsapp/link` + browser opens it |
| `audit:recent`                 | `GET /api/audit/recent`                      |

All routes above (except `/api/auth/login`) require
`Authorization: Bearer <token>` from a successful login. The
`/api/print/pending` and `/api/print/:id/complete` routes used
internally by the print-agent instead require an `x-agent-key` header.
