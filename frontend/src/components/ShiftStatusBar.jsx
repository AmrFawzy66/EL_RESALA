import React, { useState } from 'react';
import { Lock, Unlock, Printer, FileSpreadsheet, X } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext.jsx';
import { getPrinterConfig } from '../utils/printerConfig.js';
import { printTableReport } from '../utils/printHtml.js';
import { exportToExcel } from '../utils/exportExcel.js';
import { api } from '../api/client.js';
import LiveClock from './LiveClock.jsx';

export default function ShiftStatusBar() {
  const { currentUser, shift, isShiftOpen, openShift, closeShift } = useShift();
  const [busy, setBusy] = useState(false);
  const [floatInput, setFloatInput] = useState('');
  const [countedInput, setCountedInput] = useState('');
  const [closedReport, setClosedReport] = useState(null); // full shift detail once closed, for print/export

  async function handleOpen() {
    const amount = Number(floatInput);
    if (Number.isNaN(amount) || amount < 0) return;
    setBusy(true);
    try {
      await openShift(amount);
      setFloatInput('');
    } finally {
      setBusy(false);
    }
  }

  async function handleClose() {
    const amount = Number(countedInput);
    if (Number.isNaN(amount) || amount < 0) return;
    setBusy(true);
    try {
      const shiftIdBeforeClose = shift.shiftId;
      const res = await closeShift(amount);
      if (res?.ok) {
        const detail = await api.reports.shiftDetail(shiftIdBeforeClose);
        setClosedReport(detail);
      }
      setCountedInput('');
    } finally {
      setBusy(false);
    }
  }

  async function printThermal() {
    if (!closedReport) return;
    const cfg = getPrinterConfig();
    await api.printer.printShiftReport(cfg.receiptIp, cfg.receiptPort, closedReport);
  }

  function printA4() {
    if (!closedReport) return;
    const r = closedReport;
    printTableReport({
      title: 'تقرير إغلاق الوردية (Z-Report)',
      subtitle: `${r.cashierName} — من ${r.openedAt} إلى ${r.closedAt}`,
      summaryCards: [
        { label: 'رصيد البداية', value: `${r.startFloat.toFixed(2)} ج.م` },
        { label: 'إجمالي المبيعات', value: `${r.salesTotal.toFixed(2)} ج.م` },
        { label: 'الرصيد المتوقع', value: `${r.expectedBalance.toFixed(2)} ج.م` },
        { label: 'الفرق', value: `${r.variance.toFixed(2)} ج.م` },
      ],
      columns: [
        { key: 'code', label: 'رقم الفاتورة' },
        { key: 'created_at', label: 'الوقت' },
        { key: 'customer_name', label: 'العميل' },
        { key: 'payment_method', label: 'طريقة الدفع' },
        { key: 'total', label: 'الإجمالي' },
        { key: 'debt_remaining', label: 'دين متبقٍ' },
      ],
      rows: r.salesList,
      footNote: `عدد الفواتير: ${r.salesCount}`,
    });
  }

  function exportExcelReport() {
    if (!closedReport) return;
    const r = closedReport;
    exportToExcel(`تقرير-وردية-${r.shiftId}`, [
      {
        name: 'ملخص الوردية',
        columns: [
          { key: 'label', label: 'البند' },
          { key: 'value', label: 'القيمة' },
        ],
        rows: [
          { label: 'الكاشير', value: r.cashierName },
          { label: 'فتح الوردية', value: r.openedAt },
          { label: 'إغلاق الوردية', value: r.closedAt },
          { label: 'رصيد البداية', value: r.startFloat },
          { label: 'عدد الفواتير', value: r.salesCount },
          { label: 'إجمالي المبيعات', value: r.salesTotal },
          { label: 'إيداعات نقدية أخرى', value: r.cashIn },
          { label: 'سحوبات نقدية', value: r.cashOut },
          { label: 'أرباح خدمة المحافظ', value: r.walletFees },
          { label: 'الرصيد المتوقع', value: r.expectedBalance },
          { label: 'الرصيد المعدود', value: r.endCounted },
          { label: 'الفرق', value: r.variance },
        ],
      },
      {
        name: 'الفواتير',
        columns: [
          { key: 'code', label: 'رقم الفاتورة' },
          { key: 'created_at', label: 'الوقت' },
          { key: 'customer_name', label: 'العميل' },
          { key: 'payment_method', label: 'طريقة الدفع' },
          { key: 'total', label: 'الإجمالي' },
          { key: 'paid_now', label: 'المدفوع' },
          { key: 'debt_remaining', label: 'دين متبقٍ' },
        ],
        rows: r.salesList,
      },
      {
        name: 'حركة الخزينة',
        columns: [
          { key: 'created_at', label: 'الوقت' },
          { key: 'type', label: 'النوع' },
          { key: 'amount', label: 'المبلغ' },
          { key: 'note', label: 'ملاحظة' },
        ],
        rows: r.cashTransactions,
      },
    ]);
  }

  return (
    <div className="border-b bg-white">
      <div className="h-14 shrink-0 flex items-center justify-between px-5">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <LiveClock />
          <span className="hidden md:inline">{currentUser ? `مرحباً، ${currentUser.full_name}` : 'لم يتم تسجيل الدخول'}</span>
        </div>

        <div className="flex items-center gap-2">
          {isShiftOpen ? (
            <>
              <span className="flex items-center gap-1.5 text-resala-700 text-sm font-medium">
                <Unlock size={16} /> وردية مفتوحة
              </span>
              <input
                type="number"
                placeholder="الرصيد المعدود نقداً"
                value={countedInput}
                onChange={(e) => setCountedInput(e.target.value)}
                className="w-40 text-sm border rounded-md px-2 py-1.5"
              />
              <button
                onClick={handleClose}
                disabled={busy}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md disabled:opacity-50"
              >
                إغلاق الوردية
              </button>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Lock size={16} /> لا توجد وردية
              </span>
              <input
                type="number"
                placeholder="رصيد بداية الوردية"
                value={floatInput}
                onChange={(e) => setFloatInput(e.target.value)}
                className="w-40 text-sm border rounded-md px-2 py-1.5"
              />
              <button
                onClick={handleOpen}
                disabled={busy || !currentUser}
                className="text-sm bg-resala-600 hover:bg-resala-700 text-white px-3 py-1.5 rounded-md disabled:opacity-50"
              >
                فتح وردية
              </button>
            </>
          )}
        </div>
      </div>

      {closedReport && (
        <div className="px-5 py-3 bg-resala-50 border-t flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-resala-900">
            <span className="font-bold">تم إغلاق الوردية.</span>{' '}
            الرصيد المتوقع: {closedReport.expectedBalance.toFixed(2)} ج.م — الفرق: {closedReport.variance.toFixed(2)} ج.م
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={printThermal}
              className="flex items-center gap-1.5 bg-white border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
              <Printer size={14} /> طباعة إيصال حراري
            </button>
            <button
              onClick={printA4}
              className="flex items-center gap-1.5 bg-white border rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
              <Printer size={14} /> طباعة تقرير A4
            </button>
            <button
              onClick={exportExcelReport}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-3 py-1.5 text-xs font-medium"
            >
              <FileSpreadsheet size={14} /> تصدير Excel
            </button>
            <button onClick={() => setClosedReport(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
