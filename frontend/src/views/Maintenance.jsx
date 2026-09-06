import React, { useEffect, useState } from 'react';
import { Plus, MessageCircle, Printer, Wrench, X } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext.jsx';
import { getPrinterConfig } from '../utils/printerConfig.js';
import PrintExportBar from '../components/PrintExportBar.jsx';
import { api } from '../api/client.js';

const TICKET_COLUMNS = [
  { key: 'code', label: 'رقم التذكرة' },
  { key: 'customer_name', label: 'العميل' },
  { key: 'device', label: 'الجهاز' },
  { key: 'status_label', label: 'الحالة' },
  { key: 'estimated_cost', label: 'التكلفة التقديرية' },
  { key: 'advance_paid', label: 'العربون' },
  { key: 'created_at', label: 'تاريخ الاستلام' },
];

const STATUS_LABELS = {
  Received: 'تم الاستلام',
  Under_Inspection: 'قيد الفحص',
  Waiting_Approval: 'بانتظار موافقة العميل',
  In_Progress: 'قيد الإصلاح',
  Ready_For_Delivery: 'جاهز للتسليم',
  Delivered_Closed: 'تم التسليم',
  Unrepairable: 'لا يمكن إصلاحه',
};

const STATUS_ORDER = Object.keys(STATUS_LABELS).filter((s) => s !== 'Delivered_Closed');

/**
 * Maintenance.jsx — the repair workshop service desk.
 * Renders the live ticket board (grouped by status) and a new-intake
 * form. Moving a ticket to "Ready_For_Delivery" surfaces a one-click
 * WhatsApp status-update button that fires the Arabic template straight
 * to the customer's number.
 */
export default function Maintenance() {
  const { currentUser, shift, isShiftOpen } = useShift();
  const [tickets, setTickets] = useState([]);
  const [showIntake, setShowIntake] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshBoard() {
    setLoading(true);
    const rows = await api.tickets.board();
    setTickets(rows);
    setLoading(false);
  }

  useEffect(() => {
    refreshBoard();
  }, []);

  async function advanceStatus(ticket, newStatus, finalCost) {
    await api.tickets.updateStatus(ticket.id, newStatus, finalCost ?? null, currentUser.id);

    // Auto-fire repair status WhatsApp update the moment a device is ready.
    if (newStatus === 'Ready_For_Delivery' && ticket.customer_phone) {
      await api.whatsapp.openChat('repairStatus', {
        phone: ticket.customer_phone,
        customerName: ticket.customer_name,
        device: ticket.device,
        cost: (finalCost ?? ticket.estimated_cost).toFixed(2),
        ticketCode: ticket.code,
      });
    }
    refreshBoard();
  }

  async function printClaim(ticket) {
    const cfg = getPrinterConfig();
    await api.printer.printRepairIntake(cfg.receiptIp, cfg.receiptPort, {
      code: ticket.code,
      createdAt: new Date(ticket.created_at).toLocaleString('ar-EG'),
      customerName: ticket.customer_name,
      customerPhone: ticket.customer_phone,
      device: ticket.device,
      imei: ticket.imei,
      problem: ticket.problem,
      estimatedCost: ticket.estimated_cost,
      advancePaid: ticket.advance_paid,
    });
    await api.printer.printLabel(cfg.labelIp, cfg.labelPort, '38x25', {
      title: 'El-RESALA',
      code: ticket.code,
      subtitle: ticket.device,
    });
  }

  const columns = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    tickets: tickets.filter((t) => t.status === status),
  }));

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Wrench size={20} className="text-resala-600" /> قسم الصيانة
        </h2>
        <div className="flex items-center gap-2">
          <PrintExportBar
            title="تقرير تذاكر الصيانة"
            filename="تقرير-الصيانة"
            columns={TICKET_COLUMNS}
            rows={tickets.map((t) => ({ ...t, status_label: STATUS_LABELS[t.status] || t.status }))}
          />
          <button
            onClick={() => setShowIntake(true)}
            className="flex items-center gap-1.5 bg-resala-600 hover:bg-resala-700 text-white rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Plus size={16} /> استلام جهاز جديد
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-3 h-full min-w-max pb-2">
            {columns.map((col) => (
              <div key={col.status} className="w-72 bg-gray-100 rounded-xl flex flex-col">
                <div className="px-3 py-2 font-semibold text-sm text-gray-700 border-b border-gray-200">
                  {col.label} <span className="text-gray-400">({col.tickets.length})</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {col.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onAdvance={advanceStatus}
                      onPrint={printClaim}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showIntake && (
        <IntakeModal
          onClose={() => setShowIntake(false)}
          onCreated={async (ticket) => {
            setShowIntake(false);
            await printClaim(ticket);
            refreshBoard();
          }}
          currentUser={currentUser}
          shift={shift}
          isShiftOpen={isShiftOpen}
        />
      )}
    </div>
  );
}

function TicketCard({ ticket, onAdvance, onPrint }) {
  const nextStatusIndex = STATUS_ORDER.indexOf(ticket.status) + 1;
  const nextStatus = STATUS_ORDER[nextStatusIndex] || 'Delivered_Closed';

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 text-sm space-y-1.5">
      <div className="flex justify-between items-start">
        <span className="font-bold text-resala-700">{ticket.code}</span>
        <button onClick={() => onPrint(ticket)} title="طباعة" className="text-gray-400 hover:text-gray-700">
          <Printer size={14} />
        </button>
      </div>
      <p className="font-medium">{ticket.device}</p>
      <p className="text-gray-500 text-xs">{ticket.customer_name} — {ticket.customer_phone}</p>
      <p className="text-gray-600 text-xs line-clamp-2">{ticket.problem}</p>
      {ticket.technician_name && <p className="text-xs text-gray-400">الفني: {ticket.technician_name}</p>}

      <div className="flex gap-1.5 pt-1">
        <button
          onClick={() => onAdvance(ticket, nextStatus)}
          className="flex-1 bg-resala-600 hover:bg-resala-700 text-white rounded-md py-1 text-xs"
        >
          نقل إلى: {STATUS_LABELS[nextStatus]}
        </button>
        {ticket.status === 'Ready_For_Delivery' && ticket.customer_phone && (
          <button
            onClick={() =>
              api.whatsapp.openChat('repairStatus', {
                phone: ticket.customer_phone,
                customerName: ticket.customer_name,
                device: ticket.device,
                cost: (ticket.final_cost ?? ticket.estimated_cost).toFixed(2),
                ticketCode: ticket.code,
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-2"
            title="إرسال واتساب"
          >
            <MessageCircle size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function IntakeModal({ onClose, onCreated, currentUser, shift, isShiftOpen }) {
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    device: '',
    imei: '',
    patternLock: '',
    problem: '',
    estimatedCost: '',
    advancePaid: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.customerName || !form.device || !form.problem) {
      setError('يرجى إدخال اسم العميل والجهاز والعطل المبلغ عنه');
      return;
    }
    setSaving(true);
    try {
      const customerRes = await api.customers.upsert({
        name: form.customerName,
        phone: form.customerPhone || null,
      });

      const ticketRes = await api.tickets.create({
        customerId: customerRes.id,
        device: form.device,
        imei: form.imei || null,
        patternLock: form.patternLock || null,
        problem: form.problem,
        estimatedCost: Number(form.estimatedCost) || 0,
        advancePaid: Number(form.advancePaid) || 0,
        technicianId: currentUser.id,
        shiftId: shift?.shiftId || null,
      });

      onCreated({
        code: ticketRes.code,
        createdAt: new Date().toISOString(),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        device: form.device,
        imei: form.imei,
        problem: form.problem,
        estimatedCost: Number(form.estimatedCost) || 0,
        advancePaid: Number(form.advancePaid) || 0,
      });
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء التذكرة');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800">استلام جهاز جديد للصيانة</h3>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        {!isShiftOpen && (
          <p className="text-amber-600 text-xs bg-amber-50 rounded p-2">
            لا توجد وردية مفتوحة — لن يتم تسجيل العربون في الخزينة حتى فتح وردية.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="اسم العميل" value={form.customerName} onChange={(v) => update('customerName', v)} required />
          <Field label="رقم الهاتف" value={form.customerPhone} onChange={(v) => update('customerPhone', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="موديل الجهاز" value={form.device} onChange={(v) => update('device', v)} required />
          <Field label="IMEI (إن وجد)" value={form.imei} onChange={(v) => update('imei', v)} />
        </div>
        <Field label="نمط/كلمة قفل الشاشة" value={form.patternLock} onChange={(v) => update('patternLock', v)} />
        <div>
          <label className="text-xs text-gray-500">العطل المبلغ عنه</label>
          <textarea
            value={form.problem}
            onChange={(e) => update('problem', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="التكلفة التقديرية" type="number" value={form.estimatedCost} onChange={(v) => update('estimatedCost', v)} />
          <Field label="العربون المدفوع" type="number" value={form.advancePaid} onChange={(v) => update('advancePaid', v)} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-resala-600 hover:bg-resala-700 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50"
        >
          {saving ? 'جارٍ الحفظ...' : 'حفظ وطباعة الإيصال'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
