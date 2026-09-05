-- =====================================================================
-- El-RESALA POS | نظام الرسالة
-- Production PostgreSQL Schema (converted from the original SQLite schema)
-- Tables are ordered so every foreign key references a table already
-- created above it. Every statement is idempotent (IF NOT EXISTS).
-- =====================================================================

-- =====================================================================
-- 1. USERS & AUTH
-- =====================================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('owner','manager','cashier','technician')),
    permissions_json JSONB NOT NULL DEFAULT '{}',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =====================================================================
-- 2. CUSTOMERS (CRM + debt ledger)
-- =====================================================================
CREATE TABLE IF NOT EXISTS customers (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    phone           TEXT UNIQUE,
    debt_balance    NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_debt ON customers(debt_balance);

-- =====================================================================
-- 3. PRODUCTS (standard retail / accessories)
-- =====================================================================
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    barcode         TEXT UNIQUE,
    sku             TEXT UNIQUE,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'accessories',
    cost            NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    price           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    wholesale_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (wholesale_price >= 0),
    qty             INTEGER NOT NULL DEFAULT 0 CHECK (qty >= 0),
    min_qty         INTEGER NOT NULL DEFAULT 2,
    image_path      TEXT,
    is_serialized   BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_lowstock ON products(qty, min_qty);

-- =====================================================================
-- 4. SHIFTS
-- =====================================================================
CREATE TABLE IF NOT EXISTS shifts (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    opened_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at           TIMESTAMPTZ,
    start_float         NUMERIC(12,2) NOT NULL DEFAULT 0,
    end_counted         NUMERIC(12,2),
    expected_balance    NUMERIC(12,2),
    variance            NUMERIC(12,2),
    status              TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed'))
);
CREATE INDEX IF NOT EXISTS idx_shifts_user ON shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);

-- =====================================================================
-- 5. SALES (POS transactions)
-- =====================================================================
CREATE TABLE IF NOT EXISTS sales (
    id              SERIAL PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    cashier_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    customer_id     INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    shift_id        INTEGER REFERENCES shifts(id) ON DELETE SET NULL,
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_now        NUMERIC(12,2) NOT NULL DEFAULT 0,
    debt_remaining  NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_method  TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash','wallet','bank','mixed','debt')),
    status          TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed','cancelled','refunded')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sales_code ON sales(code);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_cashier ON sales(cashier_id);

-- =====================================================================
-- 6. DEVICE SERIALS (IMEI-tracked smartphones / tablets)
-- =====================================================================
CREATE TABLE IF NOT EXISTS device_serials (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    imei1           TEXT NOT NULL UNIQUE,
    imei2           TEXT,
    serial_no       TEXT,
    device_model    TEXT NOT NULL,
    color           TEXT,
    storage         TEXT,
    battery_health  INTEGER CHECK (battery_health BETWEEN 0 AND 100),
    condition       TEXT NOT NULL CHECK (condition IN ('New','Used_A','Used_B','Used_C')),
    supplier        TEXT,
    cost            NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    price           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    status          TEXT NOT NULL DEFAULT 'In_Stock' CHECK (status IN ('In_Stock','Sold','Returned','Reserved')),
    sale_id         INTEGER REFERENCES sales(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_serials_imei1 ON device_serials(imei1);
CREATE INDEX IF NOT EXISTS idx_serials_status ON device_serials(status);
CREATE INDEX IF NOT EXISTS idx_serials_product ON device_serials(product_id);

-- =====================================================================
-- 7. SALE ITEMS
-- =====================================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id              SERIAL PRIMARY KEY,
    sale_id         INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id      INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    serial_id       INTEGER REFERENCES device_serials(id) ON DELETE RESTRICT,
    qty             INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
    unit_price      NUMERIC(12,2) NOT NULL,
    unit_cost       NUMERIC(12,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_saleitems_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_saleitems_product ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_saleitems_serial ON sale_items(serial_id);

-- =====================================================================
-- 8. SPARE PARTS
-- =====================================================================
CREATE TABLE IF NOT EXISTS spare_parts (
    id                    SERIAL PRIMARY KEY,
    name                  TEXT NOT NULL,
    model_compatibility   TEXT,
    cost                  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    price                 NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    qty                   INTEGER NOT NULL DEFAULT 0 CHECK (qty >= 0),
    min_qty               INTEGER NOT NULL DEFAULT 1,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_parts_name ON spare_parts(name);
CREATE INDEX IF NOT EXISTS idx_parts_lowstock ON spare_parts(qty, min_qty);

-- =====================================================================
-- 9. REPAIR TICKETS (Maintenance / Service desk)
-- =====================================================================
CREATE TABLE IF NOT EXISTS repair_tickets (
    id              SERIAL PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    device          TEXT NOT NULL,
    imei            TEXT,
    pattern_lock    TEXT,
    problem         TEXT NOT NULL,
    condition_checklist_json JSONB DEFAULT '{}',
    status          TEXT NOT NULL DEFAULT 'Received' CHECK (status IN (
                        'Received','Under_Inspection','Waiting_Approval',
                        'In_Progress','Ready_For_Delivery','Delivered_Closed','Unrepairable')),
    estimated_cost  NUMERIC(12,2) NOT NULL DEFAULT 0,
    advance_paid    NUMERIC(12,2) NOT NULL DEFAULT 0,
    final_cost      NUMERIC(12,2),
    technician_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at       TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON repair_tickets(code);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON repair_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON repair_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_imei ON repair_tickets(imei);

CREATE TABLE IF NOT EXISTS ticket_consumed_parts (
    id              SERIAL PRIMARY KEY,
    ticket_id       INTEGER NOT NULL REFERENCES repair_tickets(id) ON DELETE CASCADE,
    part_id         INTEGER NOT NULL REFERENCES spare_parts(id) ON DELETE RESTRICT,
    qty             INTEGER NOT NULL CHECK (qty > 0),
    cost            NUMERIC(12,2) NOT NULL,
    price           NUMERIC(12,2) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ticketparts_ticket ON ticket_consumed_parts(ticket_id);

-- =====================================================================
-- 10. E-WALLETS (Vodafone Cash, InstaPay, Orange Cash, WE Pay, Fawry ...)
-- =====================================================================
CREATE TABLE IF NOT EXISTS wallets (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    phone_number    TEXT,
    balance         NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallets_name ON wallets(name);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id              SERIAL PRIMARY KEY,
    wallet_id       INTEGER NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
    shift_id        INTEGER REFERENCES shifts(id) ON DELETE SET NULL,
    type            TEXT NOT NULL CHECK (type IN ('cash_out','cash_in','manual_adjustment')),
    amount          NUMERIC(12,2) NOT NULL,
    fee_earned      NUMERIC(12,2) NOT NULL DEFAULT 0,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallettx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallettx_created ON wallet_transactions(created_at);

-- =====================================================================
-- 11. CASH DRAWERS & TRANSACTIONS
-- =====================================================================
CREATE TABLE IF NOT EXISTS cash_drawers (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL DEFAULT 'الخزينة الرئيسية',
    current_balance NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cash_transactions (
    id              SERIAL PRIMARY KEY,
    drawer_id       INTEGER NOT NULL REFERENCES cash_drawers(id) ON DELETE RESTRICT,
    shift_id        INTEGER REFERENCES shifts(id) ON DELETE SET NULL,
    type            TEXT NOT NULL CHECK (type IN ('sale_in','repair_advance_in','wallet_cash_out','wallet_cash_in',
                                                     'expense_out','manual_in','manual_out','refund_out')),
    amount          NUMERIC(12,2) NOT NULL,
    category        TEXT,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cashtx_drawer ON cash_transactions(drawer_id);
CREATE INDEX IF NOT EXISTS idx_cashtx_shift ON cash_transactions(shift_id);
CREATE INDEX IF NOT EXISTS idx_cashtx_created ON cash_transactions(created_at);

-- =====================================================================
-- 12. BANK ACCOUNTS
-- =====================================================================
CREATE TABLE IF NOT EXISTS bank_accounts (
    id              SERIAL PRIMARY KEY,
    bank_name       TEXT NOT NULL,
    account_label   TEXT,
    balance         NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_transactions (
    id              SERIAL PRIMARY KEY,
    bank_account_id INTEGER NOT NULL REFERENCES bank_accounts(id) ON DELETE RESTRICT,
    type            TEXT NOT NULL CHECK (type IN ('deposit','withdrawal','card_pos_settlement')),
    amount          NUMERIC(12,2) NOT NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_banktx_account ON bank_transactions(bank_account_id);

-- =====================================================================
-- 13. DEFECTS & SCRAP LEDGER
-- =====================================================================
CREATE TABLE IF NOT EXISTS defects_log (
    id              SERIAL PRIMARY KEY,
    product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
    serial_id       INTEGER REFERENCES device_serials(id) ON DELETE SET NULL,
    part_id         INTEGER REFERENCES spare_parts(id) ON DELETE SET NULL,
    qty             INTEGER NOT NULL DEFAULT 1,
    loss_cost       NUMERIC(12,2) NOT NULL DEFAULT 0,
    liability       TEXT NOT NULL CHECK (liability IN ('store','technician')),
    technician_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_defects_created ON defects_log(created_at);

-- =====================================================================
-- 14. STOCK AUDIT (جرد المخزون)
-- =====================================================================
CREATE TABLE IF NOT EXISTS stock_audits (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    status          TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed'))
);

CREATE TABLE IF NOT EXISTS stock_audit_lines (
    id              SERIAL PRIMARY KEY,
    audit_id        INTEGER NOT NULL REFERENCES stock_audits(id) ON DELETE CASCADE,
    product_id      INTEGER REFERENCES products(id) ON DELETE SET NULL,
    part_id         INTEGER REFERENCES spare_parts(id) ON DELETE SET NULL,
    system_qty      INTEGER NOT NULL,
    counted_qty     INTEGER NOT NULL,
    diff_value_cost NUMERIC(12,2) NOT NULL,
    adjusted        BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_auditlines_audit ON stock_audit_lines(audit_id);

-- =====================================================================
-- 15. IMMUTABLE AUDIT LOG (sensitive actions)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type     TEXT NOT NULL,
    details         JSONB NOT NULL DEFAULT '{}',
    balance_after   NUMERIC(12,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_auditlogs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auditlogs_action ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_auditlogs_created ON audit_logs(created_at);

-- =====================================================================
-- 16. SETTINGS (single-row key/value app configuration)
-- =====================================================================
CREATE TABLE IF NOT EXISTS settings (
    key             TEXT PRIMARY KEY,
    value           TEXT NOT NULL
);

-- =====================================================================
-- 17. PRINT JOBS (bridge queue for the local print-agent — see
-- /print-agent. The cloud backend has no direct network path to the
-- shop's LAN thermal/label printers, so print requests are queued here
-- and picked up by the on-site agent process, which prints via raw
-- TCP/ESC-POS exactly like the original Electron main process did.)
-- =====================================================================
CREATE TABLE IF NOT EXISTS print_jobs (
    id              SERIAL PRIMARY KEY,
    job_type        TEXT NOT NULL CHECK (job_type IN ('sale_receipt','repair_intake','shift_report','drawer_kick','label')),
    payload         JSONB NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','done','failed')),
    error           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_printjobs_status ON print_jobs(status, created_at);

-- Seed default cash drawer so the app always has a register to bind shifts to
INSERT INTO cash_drawers (id, name, current_balance)
  SELECT 1, 'الخزينة الرئيسية', 0
  WHERE NOT EXISTS (SELECT 1 FROM cash_drawers WHERE id = 1);

-- Keep the SERIAL sequence ahead of the manually-inserted id=1 row above
SELECT setval(pg_get_serial_sequence('cash_drawers', 'id'), (SELECT COALESCE(MAX(id), 1) FROM cash_drawers));
