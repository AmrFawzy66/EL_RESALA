import React, { useEffect, useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext.jsx';
import PrintExportBar from '../components/PrintExportBar.jsx';
import { api } from '../api/client.js';

const WALLET_COLUMNS = [
  { key: 'name', label: 'المحفظة' },
  { key: 'phone_number', label: 'الرقم' },
  { key: 'balance', label: 'الرصيد الحالي' },
];

/**
 * Wallets.jsx — E-Wallets dashboard (فودافون كاش، إنستاباي، أورانج كاش، وي كاش، فوري)
 *
 * These balances are intentionally kept completely separate from the
 * physical cash drawer. Every cash-in/cash-out wizard here writes to
 * BOTH the wallet ledger AND the cash drawer atomically on the backend
 * (see wallets:cashIn / wallets:cashOut routes), so the two ledgers can
 * never drift out of sync.
 */
export default function Wallets() {
  const { shift, isShiftOpen } = useShift();
  const [wallets, setWallets] = useState([]);
  const [wizard, setWizard] = useState(null); // { mode: 'cashOut'|'cashIn', wallet }
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const rows = await api.wallets.list();
    setWallets(rows);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Wallet size={20} className="text-resala-600" /> المحافظ الإلكترونية
        </h2>
        <PrintExportBar title="تقرير أرصدة المحافظ" filename="تقرير-المحافظ" columns={WALLET_COLUMNS} rows={wallets} />
      </div>

      {!isShiftOpen && (
        <p className="text-amber-600 text-xs bg-amber-50 rounded p-2 mb-4 inline-block">
          يجب فتح وردية لتنفيذ عمليات إيداع/سحب على المحافظ.
        </p>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              <div>
                <p className="font-bold text-gray-800">{wallet.name}</p>
                {wallet.phone_number && <p className="text-xs text-gray-400">{wallet.phone_number}</p>}
              </div>
              <p className="text-2xl font-black text-resala-700">{wallet.balance.toFixed(2)} <span className="text-sm font-normal text-gray-400">ج.م</span></p>
              <div className="flex gap-2">
                <button
                  disabled={!isShiftOpen}
                  onClick={() => setWizard({ mode: 'cashOut', wallet })}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-resala-600 hover:bg-resala-700 disabled:opacity-40 text-white rounded-md py-1.5 text-xs"
                >
                  <ArrowUpCircle size={14} /> سحب كاش للعميل
                </button>
                <button
                  disabled={!isShiftOpen}
                  onClick={() => setWizard({ mode: 'cashIn', wallet })}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white rounded-md py-1.5 text-xs"
                >
                  <ArrowDownCircle size={14} /> إيداع كاش للعميل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {wizard && (
        <TransactionWizard
          wizard={wizard}
          shift={shift}
          onClose={() => setWizard(null)}
          onDone={() => {
            setWizard(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function TransactionWizard({ wizard, shift, onClose, onDone }) {
  const { mode, wallet } = wizard;
  const isCashOut = mode === 'cashOut';

  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        walletId: wallet.id,
        amount: amt,
        fee: Number(fee) || 0,
        shiftId: shift?.shiftId || null,
        note: note || null,
      };
      const res = isCashOut
        ? await api.wallets.cashOut(payload)
        : await api.wallets.cashIn(payload);

      if (res.ok) onDone();
      else setError(res.error || 'فشلت العملية');
    } catch (err) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            {isCashOut ? 'سحب كاش للعميل' : 'إيداع كاش للعميل'} — {wallet.name}
          </h3>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <p className="text-xs text-gray-500">
          {isCashOut
            ? 'يستلم العميل كاش من الخزينة، ويزيد رصيد المحفظة بنفس القيمة.'
            : 'يودع العميل كاش في الخزينة، وينقص رصيد المحفظة بنفس القيمة.'}
        </p>

        <div>
          <label className="text-xs text-gray-500">المبلغ (ج.م)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">رسوم الخدمة (ربح الوردية)</label>
          <input
            type="number"
            min="0"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">ملاحظة</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-resala-600 hover:bg-resala-700 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50"
        >
          {saving ? 'جارٍ التنفيذ...' : 'تأكيد العملية'}
        </button>
      </form>
    </div>
  );
}
