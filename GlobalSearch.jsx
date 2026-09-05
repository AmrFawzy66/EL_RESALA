import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api/client.js';

/**
 * GlobalSearch.jsx (F4) — one box to find a product, an IMEI device, or a
 * customer, without knowing in advance which table it lives in.
 */
export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ products: [], device: null, customers: [] });
  const [loading, setLoading] = useState(false);

  async function runSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const [products, device, customers] = await Promise.all([
      api.products.search(query, null, 15),
      api.devices.findByImei(query.trim()),
      api.customers.search(query, 10),
    ]);
    setResults({ products, device, customers });
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <form onSubmit={runSearch} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 mb-4">
        <Search className="text-resala-600" size={22} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم، الباركود، IMEI، أو رقم هاتف العميل"
          className="flex-1 text-lg border-b-2 border-resala-200 focus:border-resala-600 outline-none py-1"
        />
      </form>

      {loading && <p className="text-gray-400 text-sm">جارٍ البحث...</p>}

      {results.device && (
        <Section title="جهاز (IMEI)">
          <p className="text-sm">
            {results.device.product_name} — {results.device.device_model} — IMEI: {results.device.imei1} —{' '}
            <span className="font-medium">{results.device.status}</span>
          </p>
        </Section>
      )}

      {results.products.length > 0 && (
        <Section title="منتجات">
          <ul className="text-sm divide-y">
            {results.products.map((p) => (
              <li key={p.id} className="py-1.5 flex justify-between">
                <span>{p.name}</span>
                <span className="text-gray-500">{p.qty} قطعة — {p.price.toFixed(2)} ج.م</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {results.customers.length > 0 && (
        <Section title="عملاء">
          <ul className="text-sm divide-y">
            {results.customers.map((c) => (
              <li key={c.id} className="py-1.5 flex justify-between">
                <span>{c.name} — {c.phone}</span>
                {c.debt_balance > 0 && <span className="text-amber-600">دين: {c.debt_balance.toFixed(2)} ج.م</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-3">
      <h3 className="text-sm font-bold text-gray-500 mb-2">{title}</h3>
      {children}
    </div>
  );
}
