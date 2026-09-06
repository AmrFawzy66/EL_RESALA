import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Plus, X } from 'lucide-react';
import PrintExportBar from '../components/PrintExportBar.jsx';
import { api } from '../api/client.js';

const INVENTORY_COLUMNS = [
  { key: 'name', label: 'الاسم' },
  { key: 'category', label: 'الفئة' },
  { key: 'barcode', label: 'الباركود' },
  { key: 'qty', label: 'الكمية' },
  { key: 'cost', label: 'التكلفة' },
  { key: 'price', label: 'السعر' },
];

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    const [all, low] = await Promise.all([
      api.products.search('', null, 200),
      api.products.lowStock(),
    ]);
    setProducts(all);
    setLowStock(low);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runSearch(e) {
    e.preventDefault();
    const rows = await api.products.search(query, null, 200);
    setProducts(rows);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-resala-600" /> المخزون
        </h2>
        <div className="flex items-center gap-2">
          <PrintExportBar title="تقرير المخزون" filename="جرد-المخزون" columns={INVENTORY_COLUMNS} rows={products} />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-resala-600 hover:bg-resala-700 text-white rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Plus size={16} /> إضافة منتج
          </button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800 flex items-start gap-2">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">تنبيه نفاد مخزون ({lowStock.length} صنف)</p>
            <p className="text-xs mt-1">{lowStock.map((p) => p.name).join('، ')}</p>
          </div>
        </div>
      )}

      <form onSubmit={runSearch} className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالاسم أو الباركود..."
          className="w-full max-w-sm border rounded-lg px-3 py-2 text-sm"
        />
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-right py-2 px-3">الاسم</th>
              <th className="py-2 px-3">الفئة</th>
              <th className="py-2 px-3">الكمية</th>
              <th className="py-2 px-3">التكلفة</th>
              <th className="py-2 px-3">السعر</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={`border-t ${p.qty <= p.min_qty ? 'bg-amber-50' : ''}`}>
                <td className="py-2 px-3 text-right">{p.name}</td>
                <td className="py-2 px-3 text-center text-gray-500">{p.category}</td>
                <td className="py-2 px-3 text-center">{p.qty}</td>
                <td className="py-2 px-3 text-center">{p.cost.toFixed(2)}</td>
                <td className="py-2 px-3 text-center font-medium">{p.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ onClose, onSaved }) {
  const [form, setForm] = useState({
    barcode: '', sku: '', name: '', category: 'accessories',
    cost: '', price: '', qty: '', min_qty: '2',
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.products.upsert({
        ...form,
        cost: Number(form.cost) || 0,
        price: Number(form.price) || 0,
        qty: Number(form.qty) || 0,
        min_qty: Number(form.min_qty) || 0,
        is_serialized: false,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800">إضافة منتج جديد</h3>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>
        <input placeholder="اسم المنتج" value={form.name} onChange={(e) => update('name', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="الباركود" value={form.barcode} onChange={(e) => update('barcode', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="SKU" value={form.sku} onChange={(e) => update('sku', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="التكلفة" value={form.cost} onChange={(e) => update('cost', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="السعر" value={form.price} onChange={(e) => update('price', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="الكمية" value={form.qty} onChange={(e) => update('qty', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="حد أدنى للتنبيه" value={form.min_qty} onChange={(e) => update('min_qty', e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="w-full bg-resala-600 hover:bg-resala-700 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50">
          {saving ? 'جارٍ الحفظ...' : 'حفظ المنتج'}
        </button>
      </form>
    </div>
  );
}
