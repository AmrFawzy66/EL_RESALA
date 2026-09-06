import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات ELOS الاحترافية ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
    wallet: <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
    bank: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>,
    lock: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>,
    open: <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>,
    barcode: <path d="M2 4h2v16H2zm4 0h1v16H6zm3 0h2v16H9zm4 0h1v16h-1zm3 0h2v16h-2zm4 0h2v16h-2z"/>,
    repairs: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>,
    returns: <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.95 20 14.54 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.05 4 11.46 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z"/>,
    exchange: <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>,
    device: <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>,
    receive: <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>,
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c(.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  };
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24">{icons[name] || icons.dashboard}</svg>;
};

export default function App() {
  // المصادقة ومستخدم النظام
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // التاريخ والوقت الحي
  const [liveDate, setLiveDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // التبويبات والمودالات
  const [currentTab, setCurrentTab] = useState("cash_drawer"); // cash_drawer, pos, repairs, inventory, wallets, reports
  const [shiftCloseModal, setShiftCloseModal] = useState(false);
  const [confirmShiftModal, setConfirmShiftModal] = useState(false);
  const [actionModal, setActionModal] = useState(null); // لشراء جهاز، استبدال، مرتجع
  const [toastMsg, setToastMsg] = useState("");

  // الخزينة والماليات (تحكم كامل)
  const [liquidCash, setLiquidCash] = useState(() => Number(localStorage.getItem("elos_liquid") || 1000));
  const [wallets, setWallets] = useState(() => JSON.parse(localStorage.getItem("elos_wallets") || JSON.stringify([
    { id: "w1", name: "محفظة فودافون كاش الرئيسية", phone: "01002345678", balance: 1000 },
    { id: "w2", name: "محفظة أورنج كاش", phone: "01200112233", balance: 500 }
  ])));
  const [banks, setBanks] = useState(() => JSON.parse(localStorage.getItem("elos_banks") || JSON.stringify([
    { id: "b1", name: "حساب إنستاباي الرئيسي (البنك الأهلي)", ipa: "elresala@instapay", balance: 0 }
  ])));
  const [salesCount, setSalesCount] = useState(() => Number(localStorage.getItem("elos_salescount") || 6));
  const [depositsTotal, setDepositsTotal] = useState(() => Number(localStorage.getItem("elos_deposits") || 1000));
  const [withdrawsTotal, setWithdrawsTotal] = useState(() => Number(localStorage.getItem("elos_withdraws") || 0));

  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("elos_trans") || JSON.stringify([
      { id: 1, type: "إيداع (محفظة)", desc: "إيداع - محمد مصطفي", amount: 1000, time: "07:14 م", cat: "deposit" }
    ]));
  });
  const [transFilter, setTransFilter] = useState("all");

  // المخزون والأصناف (تحكم كامل CRUD)
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("elos_products") || JSON.stringify([
    { id: 1, name: "كابل فودفي تيب سي أصلي", barcode: "500001", buy_price: 80, retail_price: 120, semi_price: 100, whole_price: 90, stock: 99, category: "قطع الغيار" },
    { id: 2, name: "شاحن سريع أصلي 25W", barcode: "500002", buy_price: 90, retail_price: 130, semi_price: 115, whole_price: 105, stock: 19, category: "قطع الغيار" },
    { id: 3, name: "شاشة حماية زجاجية 9D", barcode: "500003", buy_price: 20, retail_price: 45, semi_price: 35, whole_price: 28, stock: 150, category: "إكسسوارات" }
  ])));
  const [cart, setCart] = useState([]);
  const [priceTier, setPriceTier] = useState("retail"); // retail, semi, whole
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  // مركز الصيانة (تحكم كامل)
  const [repairs, setRepairs] = useState(() => JSON.parse(localStorage.getItem("elos_repairs") || JSON.stringify([
    { id: "REP-101", client: "محمود حسن", phone: "01023456789", device: "Samsung A54", imei: "35492109887766", issue: "تغيير شاشة", cost: 1400, deposit: 300, status: "قيد الإصلاح", date: "06/09/2026" }
  ])));

  // حقول تقفيل الشفت
  const [countedCash, setCountedCash] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // حفظ تلقائي في LocalStorage
  useEffect(() => { localStorage.setItem("elos_liquid", String(liquidCash)); }, [liquidCash]);
  useEffect(() => { localStorage.setItem("elos_wallets", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("elos_banks", JSON.stringify(banks)); }, [banks]);
  useEffect(() => { localStorage.setItem("elos_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("elos_repairs", JSON.stringify(repairs)); }, [repairs]);
  useEffect(() => { localStorage.setItem("elos_trans", JSON.stringify(transactions)); }, [transactions]);

  // تصدير البيانات إلى Excel/CSV
  const exportToCSV = (filename, rows) => {
    if (!rows || rows.length === 0) { alert("لا توجد بيانات للتصدير"); return; }
    const keys = Object.keys(rows[0]);
    const csvContent = "data:text/csv;charset=utf-8," + [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] || "")).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تصدير الملف بنجاح!");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if ((loginUsername === "admin" && loginPassword === "admin1234") || (loginUsername === "cashier" && loginPassword === "1234")) {
      const u = { id: 1, username: loginUsername, name: loginUsername === "admin" ? "مدير النظام" : "كاشير المحل" };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  const currentTotalInDrawer = liquidCash + wallets.reduce((a,b)=>a+b.balance,0) + banks.reduce((a,b)=>a+b.balance,0);

  // سلة المشتريات
  const addToCart = (product) => {
    const unitPrice = priceTier === "whole" ? product.whole_price : priceTier === "semi" ? product.semi_price : product.retail_price;
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, customPrice: unitPrice }];
    });
    showToast(`تمت إضافة ${product.name}`);
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.customPrice * item.qty), 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLiquidCash(p => p + cartTotal);
    setSalesCount(p => p + 1);

    const t = {
      id: Date.now(),
      type: "مبيعات نقطة البيع",
      desc: `فاتورة كاشير #${Math.floor(1000 + Math.random() * 9000)} (${cart.length} أصناف)`,
      amount: cartTotal,
      time: liveDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      cat: "sale"
    };
    setTransactions([t, ...transactions]);
    setCart([]);
    showToast(`تم إتمام الفاتورة بنجاح بقيمة ${cartTotal} ج.م!`);
    window.print();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d131f] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#111928] border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-emerald-400">ELOS Accounting System</h1>
            <p className="text-slate-400 text-xs mt-1">تسجيل الدخول لنظام نقاط البيع</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="admin1234" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-emerald-600 font-bold rounded-xl text-white text-sm">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center">
          {toastMsg}
        </div>
      )}

      {/* الشريط العلوي المطابق لـ ELOS */}
      <header className="bg-[#111928] border-b border-slate-800 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-extrabold text-sm text-emerald-400">ELOS POS</span>
          <button onClick={() => setActionModal({ type: "buy_device", title: "شراء جهاز من عميل" })} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-200 border border-slate-700 whitespace-nowrap">شراء جهاز</button>
          <button onClick={() => setActionModal({ type: "exchange", title: "استبدال جهاز" })} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-200 border border-slate-700 whitespace-nowrap">استبدال</button>
          <button onClick={() => setActionModal({ type: "return", title: "مرتجع مبيعات" })} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-200 border border-slate-700 whitespace-nowrap">مرتجع</button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-[#182236] border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-mono text-emerald-300">
            {liveDate.toLocaleTimeString("ar-EG")}
          </div>

          <button onClick={() => showToast("تم فتح درج الكاش بالنبضة الكهربائية!")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1">
            <Icon name="open" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">فتح الدرج</span>
          </button>

          <button onClick={() => setShiftCloseModal(true)} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center gap-1">
            <Icon name="lock" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تقفيل الشفت</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* ==================== 1. درج الكاش والمحافظ (Cash Drawer) ==================== */}
        {currentTab === "cash_drawer" && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/30 rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-400">الرصيد الفعلي الإجمالي في الدرج والخزينة</p>
                <h2 className="text-3xl font-black text-white mt-1">{currentTotalInDrawer.toLocaleString()} <span className="text-emerald-400 text-sm">ج.م</span></h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  const amt = Number(prompt("أدخل مبلغ الإيداع في الكاش السائل:"));
                  if(amt > 0) setLiquidCash(p => p + amt);
                }} className="px-4 py-2 bg-emerald-600 font-bold text-xs rounded-xl text-white">+ إيداع كاش</button>
                <button onClick={() => {
                  const amt = Number(prompt("أدخل مبلغ المصروفات أو السحب:"));
                  if(amt > 0 && amt <= liquidCash) setLiquidCash(p => p - amt);
                }} className="px-4 py-2 bg-rose-600 font-bold text-xs rounded-xl text-white">- سحب</button>
              </div>
            </div>

            {/* الكروت التفاعلية للمحافظ والبنوك */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* كاش سائل */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400">كاش سائل - الدرج النقدي</p>
                  <h3 className="text-2xl font-black text-white my-2">{liquidCash.toLocaleString()} ج.م</h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold">الرصيد مباشر</span>
              </div>

              {/* المحافظ الإلكترونية مع زر إضافة محفظة */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">المحافظ الإلكترونية</span>
                  <button onClick={() => {
                    const name = prompt("اسم المحفظة (مثل: أورنج كاش):");
                    const phone = prompt("رقم الهاتف:");
                    const bal = Number(prompt("الرصيد الابتدائي:")) || 0;
                    if(name) setWallets([...wallets, { id: "w_"+Date.now(), name, phone: phone||"-", balance: bal }]);
                  }} className="text-cyan-400 font-bold">+ إضافة محفظة</button>
                </div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {wallets.map(w => (
                    <div key={w.id} className="bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{w.name}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{w.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{w.balance} ج.م</span>
                        <button onClick={() => {
                          const amt = Number(prompt(`إيداع في ${w.name}:`));
                          if(amt > 0) setWallets(wallets.map(x => x.id === w.id ? { ...x, balance: x.balance + amt } : x));
                        }} className="px-2 py-0.5 bg-slate-800 text-xs rounded">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الحسابات البنكية وإنستاباي */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">الحسابات البنكية وإنستاباي</span>
                  <button onClick={() => {
                    const name = prompt("اسم البنك أو الحساب:");
                    const ipa = prompt("عنوان InstaPay IPA:");
                    if(name) setBanks([...banks, { id: "b_"+Date.now(), name, ipa: ipa||"-", balance: 0 }]);
                  }} className="text-purple-400 font-bold">+ إضافة حساب</button>
                </div>
                <div className="space-y-2">
                  {banks.map(b => (
                    <div key={b.id} className="bg-slate-900 p-2 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{b.name}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{b.ipa}</p>
                      </div>
                      <span className="font-mono font-bold text-purple-400">{b.balance} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* سجل حركات اليوم مع زر تصدير Excel */}
            <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">سجل الحركات النقدية اليومية</h4>
                <button onClick={() => exportToCSV("drawer_transactions", transactions)} className="px-3 py-1 bg-slate-800 text-purple-300 font-bold text-xs rounded-lg">تصدير Excel</button>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto text-xs">
                {transactions.map(item => (
                  <div key={item.id} className="bg-slate-900/80 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{item.type}</p>
                      <p className="text-slate-400 text-[11px]">{item.desc}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+{item.amount} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. نقطة البيع (POS) بنظام التسعير الثلاثي ==================== */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[520px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
                  <h3 className="font-bold text-white">سلة المشتريات ({cart.length})</h3>
                  <button onClick={() => setCart([])} className="text-rose-400 font-bold">إفراغ السلة</button>
                </div>

                <div className="py-3 space-y-2 max-h-[350px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.name}</span>
                        <span>{item.customPrice * item.qty} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400">تخصيص السعر للقطعة:</span>
                        <input
                          type="number"
                          value={item.customPrice}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setCart(cart.map(i => i.id === item.id ? { ...i, customPrice: val } : i));
                          }}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center font-mono font-bold text-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="text-center text-slate-500 py-16 text-xs">السلة فارغة، اضغط على الأصناف</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-base font-black text-white">
                  <span>الإجمالي:</span>
                  <span className="text-emerald-400 font-mono">{cartTotal.toLocaleString()} ج.م</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition ${cart.length > 0 ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                >
                  إتمام البيع الفوري
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {/* شريحة السعر: قطاعي، نصف جملة، جملة */}
              <div className="bg-[#111928] border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button onClick={() => setPriceTier("retail")} className={`px-3 py-1.5 rounded-lg font-bold transition ${priceTier==="retail"?"bg-emerald-600 text-white":"text-slate-400"}`}>قطاعي</button>
                  <button onClick={() => setPriceTier("semi")} className={`px-3 py-1.5 rounded-lg font-bold transition ${priceTier==="semi"?"bg-emerald-600 text-white":"text-slate-400"}`}>نصف جملة</button>
                  <button onClick={() => setPriceTier("whole")} className={`px-3 py-1.5 rounded-lg font-bold transition ${priceTier==="whole"?"bg-emerald-600 text-white":"text-slate-400"}`}>جملة</button>
                </div>
                <span className="text-emerald-400 font-bold">السعر النشط: {priceTier}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => {
                  const price = priceTier === "whole" ? p.whole_price : priceTier === "semi" ? p.semi_price : p.retail_price;
                  return (
                    <div key={p.id} onClick={() => addToCart(p)} className="bg-[#111928] hover:border-emerald-500 border border-slate-800 p-4 rounded-2xl cursor-pointer transition flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-mono">{p.barcode}</span>
                        <h4 className="font-bold text-xs text-white mt-1 line-clamp-2">{p.name}</h4>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="font-black text-sm text-white font-mono">{price} ج.م</span>
                        <span className="w-7 h-7 bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold">+</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. مركز صيانة الهواتف المعتمد (تحكم كامل) ==================== */}
        {currentTab === "repairs" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">مركز صيانة الهواتف (إدارة وتتبع الأجهزة)</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("repairs_list", repairs)} className="px-3 py-1.5 bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const client = prompt("اسم العميل:");
                  const phone = prompt("رقم الهاتف:");
                  const device = prompt("موديل الجهاز (iPhone 11):");
                  const imei = prompt("رقم السيريال IMEI:") || "-";
                  const cost = Number(prompt("تكلفة الإصلاح:")) || 0;
                  const dep = Number(prompt("العربون المدفوع:")) || 0;
                  if (client && device) {
                    const ticket = { id: "REP-"+Math.floor(1000+Math.random()*9000), client, phone, device, imei, cost, deposit: dep, status: "قيد الفحص", date: new Date().toLocaleDateString("ar-EG") };
                    setRepairs([ticket, ...repairs]);
                    if(dep > 0) setLiquidCash(p => p + dep);
                    showToast("تم تسجيل جهاز الصيانة بنجاح!");
                  }
                }} className="px-3.5 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">+ استلام جهاز جديد</button>
              </div>
            </div>

            <div className="space-y-3">
              {repairs.map(r => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-400">#{r.id}</span>
                    <h4 className="font-bold text-white text-sm">{r.device} - {r.client} ({r.phone})</h4>
                    <p className="text-slate-400">سيريال: {r.imei} | التكلفة: {r.cost} ج.م | العربون: {r.deposit} ج.م</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={r.status} onChange={e => {
                      const st = e.target.value;
                      setRepairs(repairs.map(x => x.id === r.id ? { ...x, status: st } : x));
                    }} className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs">
                      <option value="قيد الفحص">قيد الفحص</option>
                      <option value="قيد الإصلاح">قيد الإصلاح</option>
                      <option value="جاهز للتسليم">جاهز للتسليم</option>
                      <option value="تم التسليم والتحصيل">تم التسليم والتحصيل</option>
                    </select>
                    <button onClick={() => {
                      if(confirm("هل تريد حذف كارت الصيانة؟")) setRepairs(repairs.filter(x => x.id !== r.id));
                    }} className="px-2.5 py-1 bg-rose-600/30 text-rose-300 rounded-lg font-bold">حذف</button>
                  </div>
                </div>
              ))}
              {repairs.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد أجهزة صيانة مسجلة</p>}
            </div>
          </div>
        )}

        {/* ==================== 4. إدارة المخزون والأصناف (تحكم كامل CRUD) ==================== */}
        {currentTab === "inventory" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">إدارة المخزون والأصناف والأسعار</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("inventory_items", products)} className="px-3 py-1.5 bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const name = prompt("اسم المنتج الجديد:");
                  const buy_price = Number(prompt("سعر الشراء:")) || 0;
                  const retail_price = Number(prompt("سعر القطاعي:")) || 0;
                  const stock = Number(prompt("الكمية بالمخزن:")) || 0;
                  if (name) {
                    const p = { id: Date.now(), name, barcode: "5000"+Math.floor(10+Math.random()*90), buy_price, retail_price, semi_price: retail_price-10, whole_price: retail_price-20, stock, category: "إكسسوارات" };
                    setProducts([...products, p]);
                    showToast("تمت إضافة المنتج بنجاح!");
                  }
                }} className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ إضافة صنف جديد</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">المنتج</th>
                    <th className="py-2">باركود</th>
                    <th className="py-2">شراء</th>
                    <th className="py-2">قطاعي</th>
                    <th className="py-2">الكمية</th>
                    <th className="py-2">تحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-bold text-white">{p.name}</td>
                      <td className="py-2.5 font-mono text-emerald-400">{p.barcode}</td>
                      <td className="py-2.5">{p.buy_price} ج.م</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{p.retail_price} ج.م</td>
                      <td className="py-2.5 font-bold">{p.stock}</td>
                      <td className="py-2.5">
                        <button onClick={() => {
                          if(confirm(`حذف ${p.name}؟`)) setProducts(products.filter(x => x.id !== p.id));
                        }} className="text-rose-400 font-bold hover:underline">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* مودال تقفيل الشفت */}
      {shiftCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-lg rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base">تقفيل الشفت - ملخص الخزينة والمحافظ</h3>
            <div className="bg-slate-900 p-3 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between"><span>كاش سائل بالدرج:</span><strong className="text-emerald-400">{liquidCash} ج.م</strong></div>
              <div className="flex justify-between"><span>إجمالي المحافظ والبنوك:</span><strong className="text-cyan-400">{wallets.reduce((a,b)=>a+b.balance,0) + banks.reduce((a,b)=>a+b.balance,0)} ج.م</strong></div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-black">
                <span>الإجمالي العام للخزينة:</span>
                <span className="text-emerald-400 font-mono">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => {
                setShiftCloseModal(false);
                setConfirmShiftModal(true);
              }} className="flex-1 py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">تأكيد ومتابعة التقفيل</button>
              <button onClick={() => setShiftCloseModal(false)} className="px-4 py-3 bg-slate-800 text-slate-400 text-xs rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {confirmShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-sm rounded-3xl p-6 text-white space-y-4 text-center">
            <h3 className="font-black text-lg">هل أنت متأكد من تقفيل الشفت؟</h3>
            <p className="text-xs text-slate-400">سيتم ترحيل الأرصدة وبدء وردية جديدة للكاشير.</p>
            <div className="space-y-2 pt-2">
              <button onClick={() => {
                setConfirmShiftModal(false);
                setLiquidCash(0);
                showToast("تم تقفيل الشفت بنجاح وبدء وردية جديدة!");
              }} className="w-full py-3 bg-emerald-600 font-extrabold text-xs rounded-xl text-white">تأكيد وبدء شفت جديد</button>
              <button onClick={() => setConfirmShiftModal(false)} className="w-full py-2.5 bg-slate-800 text-slate-400 text-xs rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* الشريط السفلي الثابت (ELOS Navigation Bar) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0c1017]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40 shadow-2xl">
        <button onClick={() => setCurrentTab("cash_drawer")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "cash_drawer" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}>
          <Icon name="drawer" className="w-4 h-4" />
          <span>درج الكاش</span>
        </button>
        <button onClick={() => setCurrentTab("pos")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "pos" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}>
          <Icon name="pos" className="w-4 h-4" />
          <span>نقطة البيع</span>
        </button>
        <button onClick={() => setCurrentTab("repairs")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "repairs" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}>
          <Icon name="repairs" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>
        <button onClick={() => setCurrentTab("inventory")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "inventory" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}>
          <Icon name="audit" className="w-4 h-4" />
          <span>المخزون</span>
        </button>
      </footer>
    </div>
  );
}
