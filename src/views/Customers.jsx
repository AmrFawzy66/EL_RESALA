import React, { useEffect, useState } from 'react';
import { Users, MessageCircle } from 'lucide-react';
import PrintExportBar from '../components/PrintExportBar.jsx';
import { api } from '../api/client.js';

const CUSTOMER_COLUMNS = [
  { key: 'name', label: 'الاسم' },
  { key: 'phone', label: 'الهاتف' },
  { key: 'debt_balance', label: 'الرصيد المستحق' },
  { key: 'notes', label: 'ملاحظات' },
];

export default function Customers() {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState([]);

  async function refresh(q = '') {
    const rows = await api.customers.search(q, 100);
    setCustomers(rows);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function sendDebtReminder(customer) {
    await api.whatsapp.openChat('debtReminder', {
      phone: customer.phone,
      customerName: customer.name,
      debt: customer.debt_balance.toFixed(2),
    });
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Users size={20} className="text-resala-600" /> العملاء
        </h2>
        <PrintExportBar title="تقرير العملاء" filename="تقرير-العملاء" columns={CUSTOMER_COLUMNS} rows={customers} />
      </div>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          refresh(e.target.value);
        }}
        placeholder="بحث بالاسم أو الهاتف..."
        className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm mb-3"
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-right py-2 px-3">الاسم</th>
              <th className="py-2 px-3">الهاتف</th>
              <th className="py-2 px-3">الرصيد المستحق</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="py-2 px-3 text-right">{c.name}</td>
                <td className="py-2 px-3 text-center text-gray-500">{c.phone || '—'}</td>
                <td className={`py-2 px-3 text-center font-medium ${c.debt_balance > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {c.debt_balance.toFixed(2)} ج.م
                </td>
                <td className="py-2 px-3 text-center">
                  {c.debt_balance > 0 && c.phone && (
                    <button
                      onClick={() => sendDebtReminder(c)}
                      className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-xs"
                    >
                      <MessageCircle size={14} /> تذكير
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
