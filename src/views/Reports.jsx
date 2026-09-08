import React, { useEffect, useState } from 'react';
import { BarChart3, ShieldAlert, Receipt, Clock, Package, Users } from 'lucide-react';
import PrintExportBar from '../components/PrintExportBar.jsx';
import { api } from '../api/client.js';

const TABS = [
  { id: 'sales', label: 'تقرير المبيعات', icon: Receipt },
  { id: 'shifts', label: 'سجل الورديات', icon: Clock },
  { id: 'inventory', label: 'تقرير المخزون', icon: Package },
  { id: 'debts', label: 'مديونية العملاء', icon: Users },
  { id: 'audit', label: 'سجل التدقيق', icon: ShieldAlert },
];

/**
 * Reports.jsx — the manager's reporting hub. Every tab is independently
 * printable (A4, any installed printer via the OS dialog) and
 * exportable to a real .xlsx workbook, using the shared PrintExportBar +
 * printHtml/exportExcel utilities so all five reports behave identically.
 */
export default function Reports() {
  const [tab, setTab] = useState('sales');

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-resala-600" /> التقارير
      </h2>

      <div className="flex items-center gap-1.5 mb-4 border-b overflow-x-auto no-print">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === id ? 'border-resala-600 text-resala-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'sales' && <SalesReport />}
      {tab === 'shifts' && <ShiftHistoryReport />}
      {tab === 'inventory' && <InventoryReport />}
      {tab === 'debts' && <DebtsReport />}
      {tab === 'audit' && <AuditReport />}
    </div>
  );
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
function monthStartIso() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function SalesReport() {
  const [startDate, setStartDate] = useState(monthStartIso());
  const [endDate, setEndDate] = useState(todayIso());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const data = await api.reports.salesRange(startDate, endDate);
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSales = rows.reduce((s, r) => s + r.total, 0);
  const totalPaid = rows.reduce((s, r) => s + r.paid_now, 0);
  const totalDebt = rows.reduce((s, r) => s + r.debt_remaining, 0);

  const columns = [
    { key: 'code', label: 'رقم الفاتورة' },
    { key: 'created_at', label: 'التاريخ' },
    { key: 'cashier_name', label: 'الكاشير' },
    { key: 'customer_name', label: 'العميل' },
    { key: 'payment_method', label: 'طريقة الدفع' },
    { key: 'total', label: 'الإجمالي' },
    { key: 'paid_now', label: 'المدفوع' },
    { key: 'debt_remaining', label: 'الدين' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-end gap-3 flex-wrap no-print">
        <div>
          <label className="text-xs text-gray-500 block mb-1">من تاريخ</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">إلى تاريخ</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={refresh} className="bg-resala-600 hover:bg-resala-700 text-white rounded-lg px-4 py-2 text-sm font-semibold">
          عرض
        </button>
        <div className="mr-auto">
          <PrintExportBar
            title="تقرير المبيعات"
            subtitle={`من ${startDate} إلى ${endDate}`}
            filename={`تقرير-المبيعات-${startDate}-${endDate}`}
            columns={columns}
            rows={rows}
            summaryCards={[
              { label: 'عدد الفواتير', value: String(rows.length) },
              { label: 'إجمالي المبيعات', value: `${totalSales.toFixed(2)} ج.م` },
              { label: 'المحصّل', value: `${totalPaid.toFixed(2)} ج.م` },
              { label: 'المتبقي كدين', value: `${totalDebt.toFixed(2)} ج.م` },
            ]}
          />
        </div>
      </div>

      <SummaryCards
        cards={[
          { label: 'عدد الفواتير', value: rows.length },
          { label: 'إجمالي المبيعات', value: `${totalSales.toFixed(2)} ج.م` },
          { label: 'المحصّل نقداً', value: `${totalPaid.toFixed(2)} ج.م` },
          { label: 'المتبقي كدين', value: `${totalDebt.toFixed(2)} ج.م` },
        ]}
      />

      <ReportTable loading={loading} columns={columns} rows={rows} money={['total', 'paid_now', 'debt_remaining']} />
    </div>
  );
}

function ShiftHistoryReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.shiftHistory(200).then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'cashier_name', label: 'الكاشير' },
    { key: 'opened_at', label: 'فتح الوردية' },
    { key: 'closed_at', label: 'إغلاق الوردية' },
    { key: 'start_float', label: 'رصيد البداية' },
    { key: 'end_counted', label: 'المعدود' },
    { key: 'expected_balance', label: 'المتوقع' },
    { key: 'variance', label: 'الفرق' },
    { key: 'status', label: 'الحالة' },
  ];

  const displayRows = rows.map((r) => ({ ...r, status: r.status === 'open' ? 'مفتوحة' : 'مغلقة' }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <PrintExportBar
          title="سجل الورديات"
          filename="سجل-الورديات"
          columns={columns}
          rows={displayRows}
        />
      </div>
      <ReportTable loading={loading} columns={columns} rows={displayRows} money={['start_float', 'end_counted', 'expected_balance', 'variance']} />
    </div>
  );
}

function InventoryReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.inventorySnapshot().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'name', label: 'الصنف' },
    { key: 'category', label: 'الفئة' },
    { key: 'qty', label: 'الكمية' },
    { key: 'cost', label: 'التكلفة' },
    { key: 'price', label: 'السعر' },
    { key: 'stock_value_cost', label: 'قيمة المخزون (تكلفة)' },
    { key: 'stock_value_price', label: 'قيمة المخزون (بيع)' },
  ];

  const totalCostValue = rows.reduce((s, r) => s + r.stock_value_cost, 0);
  const totalPriceValue = rows.reduce((s, r) => s + r.stock_value_price, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <PrintExportBar
          title="تقرير المخزون"
          filename="تقرير-المخزون"
          columns={columns}
          rows={rows}
          summaryCards={[
            { label: 'عدد الأصناف', value: String(rows.length) },
            { label: 'قيمة المخزون (تكلفة)', value: `${totalCostValue.toFixed(2)} ج.م` },
            { label: 'قيمة المخزون (سعر بيع)', value: `${totalPriceValue.toFixed(2)} ج.م` },
          ]}
        />
      </div>
      <SummaryCards
        cards={[
          { label: 'عدد الأصناف', value: rows.length },
          { label: 'قيمة المخزون (تكلفة)', value: `${totalCostValue.toFixed(2)} ج.م` },
          { label: 'قيمة المخزون (سعر بيع)', value: `${totalPriceValue.toFixed(2)} ج.م` },
        ]}
      />
      <ReportTable loading={loading} columns={columns} rows={rows} money={['cost', 'price', 'stock_value_cost', 'stock_value_price']} />
    </div>
  );
}

function DebtsReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports.customersDebt().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'name', label: 'العميل' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'debt_balance', label: 'المديونية' },
    { key: 'notes', label: 'ملاحظات' },
  ];
  const totalDebt = rows.reduce((s, r) => s + r.debt_balance, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <PrintExportBar
          title="تقرير مديونية العملاء"
          filename="مديونية-العملاء"
          columns={columns}
          rows={rows}
          summaryCards={[
            { label: 'عدد العملاء المدينين', value: String(rows.length) },
            { label: 'إجمالي المديونية', value: `${totalDebt.toFixed(2)} ج.م` },
          ]}
        />
      </div>
      <ReportTable loading={loading} columns={columns} rows={rows} money={['debt_balance']} />
    </div>
  );
}

function AuditReport() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.audit.recent(200).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'created_at', label: 'التاريخ' },
    { key: 'user_name', label: 'المستخدم' },
    { key: 'action_type', label: 'الإجراء' },
    { key: 'details', label: 'التفاصيل' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <PrintExportBar title="سجل التدقيق" filename="سجل-التدقيق" columns={columns} rows={logs} />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-1.5">
          <ShieldAlert size={16} /> آخر العمليات الحساسة
        </h3>
        <ReportTable loading={loading} columns={columns} rows={logs} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Shared presentational bits
// ---------------------------------------------------------------------
function SummaryCards({ cards }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl shadow-sm p-3">
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className="text-lg font-black text-resala-800">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function ReportTable({ loading, columns, rows, money = [] }) {
  if (loading) return <p className="text-gray-400 text-sm">جارٍ التحميل...</p>;
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="py-2 px-3 whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center text-gray-400">
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-t">
                {columns.map((c) => (
                  <td key={c.key} className="py-2 px-3 text-center whitespace-nowrap">
                    {money.includes(c.key) && typeof row[c.key] === 'number' ? row[c.key].toFixed(2) : row[c.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
