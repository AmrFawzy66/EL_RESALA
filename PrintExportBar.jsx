import React, { useState } from 'react';
import { Printer, FileSpreadsheet, Loader2 } from 'lucide-react';
import { printTableReport } from '../utils/printHtml.js';
import { exportSingleSheet, exportToExcel } from '../utils/exportExcel.js';

/**
 * PrintExportBar — drop this on ANY screen that shows a table (sales,
 * inventory, customers, wallets, tickets, audit log, shift history...)
 * to get a consistent "طباعة" (A4 print via OS dialog) + "تصدير Excel"
 * pair of buttons for free, instead of every view hand-rolling its own.
 *
 * Single-sheet usage:
 *   <PrintExportBar
 *     title="تقرير المبيعات"
 *     subtitle="من 01/09/2026 إلى 04/09/2026"
 *     filename="تقرير-المبيعات"
 *     columns={[{ key: 'code', label: 'رقم الفاتورة' }, ...]}
 *     rows={sales}
 *     summaryCards={[{ label: 'الإجمالي', value: '12,345 ج.م' }]}
 *   />
 *
 * Multi-sheet usage (exports several tables into one workbook, prints
 * only the primary one, e.g. a full end-of-day bundle):
 *   <PrintExportBar title="..." sheets={[{name,columns,rows}, ...]} multi />
 */
export default function PrintExportBar({
  title,
  subtitle,
  filename,
  columns,
  rows,
  summaryCards = [],
  footNote,
  sheets, // optional: array of {name, columns, rows} for multi-sheet excel export
  extraActions = null,
  size = 'sm',
}) {
  const [busy, setBusy] = useState(false);

  function handlePrint() {
    printTableReport({ title, subtitle, summaryCards, columns, rows, footNote });
  }

  async function handleExport() {
    setBusy(true);
    try {
      const safeName = (filename || title || 'تقرير').replace(/\s+/g, '-');
      if (sheets && sheets.length) {
        exportToExcel(safeName, sheets);
      } else {
        exportSingleSheet(safeName, title || 'Sheet1', columns, rows);
      }
    } finally {
      setBusy(false);
    }
  }

  const pad = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handlePrint}
        className={`flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium ${pad}`}
        title="طباعة على أي طابعة (A4)"
      >
        <Printer size={size === 'lg' ? 16 : 14} /> طباعة
      </button>
      <button
        onClick={handleExport}
        disabled={busy}
        className={`flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium ${pad}`}
        title="تصدير إلى ملف Excel"
      >
        {busy ? <Loader2 size={size === 'lg' ? 16 : 14} className="animate-spin" /> : <FileSpreadsheet size={size === 'lg' ? 16 : 14} />}
        تصدير Excel
      </button>
      {extraActions}
    </div>
  );
}
