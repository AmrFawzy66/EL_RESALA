import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Scan, Trash2, UserPlus, MessageCircle, Printer, ShoppingBag } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext.jsx';
import { getPrinterConfig } from '../utils/printerConfig.js';
import { api } from '../api/client.js';

/**
 * POS.jsx — the primary checkout screen.
 *
 * Scanning UX: a single always-focused text input captures barcode-scanner
 * keystrokes (scanners type fast + send Enter). We look up the code first
 * against device_serials (IMEI — for phones/tablets) and fall back to
 * products (barcode — for accessories). This mirrors the strict business
 * rule that a phone can only enter a sale via a verified IMEI, never a
 * generic SKU match.
 */
export default function POS() {
  const { currentUser, shift, isShiftOpen } = useShift();

  const [scanValue, setScanValue] = useState('');
  const [cart, setCart] = useState([]); // { key, name, qty, unitPrice, unitCost, productId, serialId }
  const [customer, setCustomer] = useState(null);
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paidNow, setPaidNow] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [scanError, setScanError] = useState('');
  const [lastSale, setLastSale] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const scanInputRef = useRef(null);

  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0));
  const paidNumeric = Number(paidNow) || 0;
  const debtRemaining = Math.max(0, total - paidNumeric);

  const addToCart = useCallback((entry) => {
    setCart((prev) => {
      // IMEI-tracked devices are always a distinct, single-quantity line —
      // never merged, since each unit is a unique physical item.
      if (entry.serialId) {
        if (prev.some((i) => i.serialId === entry.serialId)) return prev;
        return [...prev, { ...entry, key: `serial-${entry.serialId}`, qty: 1 }];
      }
      const existing = prev.find((i) => i.productId === entry.productId);
      if (existing) {
        return prev.map((i) => (i.productId === entry.productId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...entry, key: `product-${entry.productId}`, qty: 1 }];
    });
  }, []);

  async function handleScanSubmit(e) {
    e.preventDefault();
    const code = scanValue.trim();
    setScanValue('');
    setScanError('');
    if (!code) return;

    // 1. Try IMEI match first (strict rule: phones must be scanned/verified by IMEI)
    const device = await api.devices.findByImei(code);
    if (device) {
      if (device.status !== 'In_Stock') {
        setScanError(`هذا الجهاز (IMEI: ${code}) غير متاح للبيع — الحالة: ${device.status}`);
        return;
      }
      addToCart({
        productId: device.product_id,
        serialId: device.id,
        name: `${device.product_name} — ${device.device_model} (${device.color || ''} ${device.storage || ''})`,
        unitPrice: device.price,
        unitCost: device.cost,
      });
      return;
    }

    // 2. Fall back to standard barcode product lookup
    const products = await api.products.search(code, null, 1);
    const product = products.find((p) => p.barcode === code) || products[0];
    if (product) {
      if (product.is_serialized) {
        setScanError('هذا المنتج مسلسل الرقم — يجب إدخال IMEI صحيح للبيع');
        return;
      }
      if (product.qty <= 0) {
        setScanError(`نفذت الكمية من "${product.name}"`);
        return;
      }
      addToCart({
        productId: product.id,
        serialId: null,
        name: product.name,
        unitPrice: product.price,
        unitCost: product.cost,
      });
      return;
    }

    setScanError(`لم يتم العثور على منتج أو جهاز بالكود: ${code}`);
  }

  function updateQty(key, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key !== key) return item;
          if (item.serialId) return item; // serialized items are always qty 1
          return { ...item, qty: Math.max(1, item.qty + delta) };
        })
        .filter(Boolean)
    );
  }

  function removeItem(key) {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }

  async function searchCustomers(query) {
    setCustomerQuery(query);
    if (!query) {
      setCustomerResults([]);
      return;
    }
    const results = await api.customers.search(query, 8);
    setCustomerResults(results);
  }

  async function handleCheckout() {
    if (!isShiftOpen) {
      setScanError('يجب فتح وردية قبل تنفيذ عملية بيع');
      return;
    }
    if (cart.length === 0) return;

    setCheckingOut(true);
    setScanError('');
    try {
      const res = await api.sales.checkout({
        cashierId: currentUser.id,
        customerId: customer?.id || null,
        shiftId: shift.shiftId,
        items: cart.map((i) => ({
          productId: i.productId,
          serialId: i.serialId,
          qty: i.qty,
          unitPrice: i.unitPrice,
          unitCost: i.unitCost,
        })),
        discount: Number(discount) || 0,
        paidNow: paidNumeric,
        paymentMethod,
      });

      if (res.ok) {
        setLastSale({
          code: res.code,
          total: res.total,
          debtRemaining: res.debtRemaining,
          customer,
          items: cart,
        });
        setCart([]);
        setDiscount(0);
        setPaidNow('');
        setCustomer(null);
      } else {
        setScanError(res.error || 'حدث خطأ أثناء إتمام البيع');
      }
    } catch (err) {
      setScanError(err.message || 'حدث خطأ أثناء إتمام البيع');
    } finally {
      setCheckingOut(false);
      scanInputRef.current?.focus();
    }
  }

  async function sendWhatsappReceipt() {
    if (!lastSale || !lastSale.customer?.phone) return;
    await api.whatsapp.openChat('salesReceipt', {
      phone: lastSale.customer.phone,
      invoiceCode: lastSale.code,
      total: lastSale.total.toFixed(2),
    });
  }

  async function printReceipt() {
    if (!lastSale) return;
    const cfg = getPrinterConfig();
    await api.printer.printSaleReceipt(cfg.receiptIp, cfg.receiptPort, {
      code: lastSale.code,
      cashierName: currentUser.full_name,
      customerName: lastSale.customer?.name,
      items: lastSale.items,
      subtotal: lastSale.items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
      discount: 0,
      total: lastSale.total,
      paidNow: lastSale.total - lastSale.debtRemaining,
      debtRemaining: lastSale.debtRemaining,
      paymentMethod,
      createdAt: new Date().toLocaleString('ar-EG'),
    });
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-full">
      {/* Scan + cart column */}
      <div className="col-span-2 flex flex-col gap-4">
        <form onSubmit={handleScanSubmit} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <Scan className="text-resala-600" size={22} />
          <input
            ref={scanInputRef}
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            placeholder="امسح الباركود أو أدخل IMEI ثم اضغط Enter"
            className="flex-1 text-lg border-b-2 border-resala-200 focus:border-resala-600 outline-none py-1"
          />
        </form>
        {scanError && <p className="text-red-600 text-sm px-1">{scanError}</p>}

        <div className="bg-white rounded-xl shadow-sm flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <ShoppingBag size={40} />
              <p>السلة فارغة — ابدأ بمسح منتج أو جهاز</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-right py-2 px-3">الصنف</th>
                  <th className="py-2 px-3">الكمية</th>
                  <th className="py-2 px-3">السعر</th>
                  <th className="py-2 px-3">الإجمالي</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.key} className="border-b last:border-0">
                    <td className="py-2 px-3 text-right">{item.name}</td>
                    <td className="py-2 px-3 text-center">
                      {item.serialId ? (
                        1
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => updateQty(item.key, -1)} className="w-6 h-6 rounded bg-gray-100">-</button>
                          {item.qty}
                          <button onClick={() => updateQty(item.key, 1)} className="w-6 h-6 rounded bg-gray-100">+</button>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">{item.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-medium">{(item.unitPrice * item.qty).toFixed(2)}</td>
                    <td className="py-2 px-3 text-center">
                      <button onClick={() => removeItem(item.key)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Checkout column */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
        <h2 className="font-bold text-gray-800">إتمام البيع</h2>

        <div className="relative">
          <label className="text-xs text-gray-500">العميل (اختياري)</label>
          <div className="flex items-center gap-2">
            <input
              value={customer ? customer.name : customerQuery}
              onChange={(e) => {
                setCustomer(null);
                searchCustomers(e.target.value);
              }}
              placeholder="ابحث بالاسم أو الهاتف"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <UserPlus size={18} className="text-gray-400" />
          </div>
          {customerResults.length > 0 && !customer && (
            <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full mt-1 max-h-40 overflow-y-auto">
              {customerResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCustomer(c);
                    setCustomerResults([]);
                  }}
                  className="block w-full text-right px-3 py-2 text-sm hover:bg-resala-50"
                >
                  {c.name} — {c.phone}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500">الخصم (ج.م)</label>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">طريقة الدفع</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="cash">نقدي</option>
            <option value="wallet">محفظة إلكترونية</option>
            <option value="bank">تحويل بنكي</option>
            <option value="mixed">مختلط</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">المبلغ المدفوع الآن</label>
          <input
            type="number"
            min="0"
            value={paidNow}
            onChange={(e) => setPaidNow(e.target.value)}
            placeholder={total.toFixed(2)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-auto border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>الإجمالي الفرعي</span><span>{subtotal.toFixed(2)} ج.م</span></div>
          <div className="flex justify-between"><span>الخصم</span><span>{(Number(discount) || 0).toFixed(2)} ج.م</span></div>
          <div className="flex justify-between font-bold text-lg text-resala-800">
            <span>الإجمالي</span><span>{total.toFixed(2)} ج.م</span>
          </div>
          {debtRemaining > 0 && (
            <div className="flex justify-between text-amber-600 font-medium">
              <span>المتبقي كدين</span><span>{debtRemaining.toFixed(2)} ج.م</span>
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || checkingOut}
          className="bg-resala-600 hover:bg-resala-700 text-white rounded-lg py-3 font-bold disabled:opacity-50"
        >
          {checkingOut ? 'جارٍ التنفيذ...' : 'إتمام البيع'}
        </button>

        {lastSale && (
          <div className="border rounded-lg p-3 bg-resala-50 text-sm space-y-2">
            <p className="font-medium text-resala-800">تمت الفاتورة {lastSale.code} بنجاح ✅</p>
            <div className="flex gap-2">
              <button onClick={printReceipt} className="flex-1 flex items-center justify-center gap-1.5 bg-white border rounded-md py-1.5 text-xs">
                <Printer size={14} /> طباعة الفاتورة
              </button>
              {lastSale.customer?.phone && (
                <button onClick={sendWhatsappReceipt} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white rounded-md py-1.5 text-xs">
                  <MessageCircle size={14} /> واتساب
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
