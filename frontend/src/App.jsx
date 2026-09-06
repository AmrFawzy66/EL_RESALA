import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات النظام الموحدة ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>,
    repairs: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>,
    wallet: <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
    bank: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>,
    lock: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>,
    open: <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>,
    barcode: <path d="M2 4h2v16H2zm4 0h1v16H6zm3 0h2v16H9zm4 0h1v16h-1zm3 0h2v16h-2zm4 0h2v16h-2z"/>,
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  };
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24">{icons[name] || icons.dashboard}</svg>;
};

export default function App() {
  // المصادقة
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // الوقت والتاريخ الحي بالثواني
  const [liveDate, setLiveDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // التنقل والمودالات
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [shiftCloseModal, setShiftCloseModal] = useState(false);

  // إعدادات المبيعات والتسعير
  const [priceTier, setPriceTier] = useState("retail"); // retail, semi, whole
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedWalletId, setSelectedWalletId] = useState("voda");
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);

  // ==================== قواعد البيانات (CRUD الكاملة لـ EL-RESALA V7) ====================
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("elos_v7_prods") || JSON.stringify([
    { id: 1, name: "شاحن سامسونج أصلي 25W", barcode: "622001", imeiTracked: false, buy_price: 85, retail_price: 160, semi_price: 130, whole_price: 110, stock: 45, category: "شواحن" },
    { id: 2, name: "كابل شحن سريع Type-C", barcode: "622002", imeiTracked: false, buy_price: 22, retail_price: 55, semi_price: 40, whole_price: 32, stock: 95, category: "كابلات" },
    { id: 3, name: "آيفون 13 برو ماكس (مستعمل/زيرو)", barcode: "700013", imeiTracked: true, imei: "354921098877665", buy_price: 28000, retail_price: 33000, semi_price: 32000, whole_price: 31000, stock: 1, category: "هواتف مستعملة" }
  ])));

  const [cart, setCart] = useState([]);
  const [repairs, setRepairs] = useState(() => JSON.parse(localStorage.getItem("elos_v7_repairs") || JSON.stringify([
    { id: "REP-101", client: "محمود حسن", phone: "01023456789", device: "Samsung A54", imei: "358741002233441", lockCode: "1234", issue: "تغيير شاشة أصلية", cost: 1400, deposit: 300, status: "قيد الإصلاح", date: "06/09/2026" }
  ])));

  const [wallets, setWallets] = useState(() => JSON.parse(localStorage.getItem("elos_v7_wallets") || JSON.stringify([
    { id: "voda", name: "فودافون كاش الرئيسية", phone: "01002345678", balance: 5400 },
    { id: "insta", name: "إنستاباي InstaPay", phone: "elresala@instapay", balance: 12400 }
  ])));

  const [safeBalance, setSafeBalance] = useState(() => Number(localStorage.getItem("elos_v7_safe") || 8500));
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem("elos_v7_cust") || JSON.stringify([
    { id: 1, name: "عميل نقدي سريع", phone: "-", debt: 0 },
    { id: 2, name: "محل الهدى للموبايل", phone: "01144556677", debt: 3400 }
  ])));
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("elos_v7_sales") || "[]"));

  // حفظ تلقائي
  useEffect(() => { localStorage.setItem("elos_v7_prods", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("elos_v7_repairs", JSON.stringify(repairs)); }, [repairs]);
  useEffect(() => { localStorage.setItem("elos_v7_wallets", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("elos_v7_safe", String(safeBalance)); }, [safeBalance]);
  useEffect(() => { localStorage.setItem("elos_v7_cust", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("elos_v7_sales", JSON.stringify(salesLog)); }, [salesLog]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

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

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم الرئيسية", icon: "dashboard" },
    { id: "pos", label: "نقطة البيع (POS)", icon: "pos" },
    { id: "repairs", label: "مركز الصيانة وأجهزة IMEI", icon: "repairs" },
    { id: "inventory", label: "المخزون والأصناف (CRUD)", icon: "audit" },
    { id: "wallets", label: "المحافظ والبنوك", icon: "wallet" },
    { id: "drawer", label: "الخزينة النقدية والدرج", icon: "drawer" },
    { id: "customers", label: "العملاء والديون", icon: "customers" },
    { id: "reports", label: "سجل المبيعات والأرباح", icon: "reports" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d131f] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#111928] border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-emerald-400">EL-RESALA ERP & POS</h1>
            <p className="text-slate-400 text-xs mt-1">نظام إدارة محلات المحمول والصيانة</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="admin1234" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-emerald-600 font-bold rounded-xl text-white text-sm">تسجيل الدخول للنظام</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center">
          {toastMsg}
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="bg-[#111928] border-b border-slate-800 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 border border-slate-700">
            <Icon name="menu" className="w-5 h-5 text-emerald-400" />
          </button>
          <span className="font-extrabold text-sm text-emerald-400">EL-RESALA ERP</span>
        </div>

        <div className="bg-[#182236] border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{liveDate.toLocaleTimeString("ar-EG")}</span>
          <span className="text-slate-500">|</span>
          <span>{liveDate.toLocaleDateString("ar-EG")}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => showToast("تم إرسال نبضة لفتح درج الكاش!")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1">
            <Icon name="open" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">فتح الدرج</span>
          </button>
          <button onClick={() => setShiftCloseModal(true)} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center gap-1">
            <Icon name="lock" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تقفيل الشفت</span>
          </button>
        </div>
      </header>

      {/* محتوى الشاشات */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* 1. لوحة التحكم */}
        {currentTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-emerald-400 font-mono">{salesLog.reduce((a,b)=>a+b.total,0).toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">مبيعات المحل الإجمالية</p>
              </div>
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-cyan-400 font-mono">{repairs.filter(r=>r.status!=="تم التسليم والتحصيل").length}</span>
                <p className="text-xs text-slate-400 mt-2">أجهزة قيد الصيانة بالورشة</p>
              </div>
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-white font-mono">{products.reduce((a,b)=>a+(b.buy_price*b.stock),0).toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">قيمة المخزون (شراء)</p>
              </div>
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-purple-400 font-mono">{safeBalance.toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">رصيد الخزينة النقدية</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. نقطة البيع (POS) */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
                  <h3 className="font-bold text-white">سلة المشتريات ({cart.length})</h3>
                  <button onClick={() => setCart([])} className="text-rose-400 font-bold">إفراغ السلة</button>
                </div>

                <div className="py-3 space-y-2 max-h-[320px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.name} {item.imei ? `(${item.imei})` : ""}</span>
                        <span>{item.customPrice * item.qty} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400">تخصيص السعر:</span>
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
                  {cart.length === 0 && <p className="text-center text-slate-500 py-16 text-xs">السلة فارغة، اختر الأصناف للبيع</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-base font-black text-white">
                  <span>الإجمالي المستحق:</span>
                  <span className="text-emerald-400 font-mono">{cartTotal.toLocaleString()} ج.م</span>
                </div>
                <button
                  onClick={() => {
                    if (cart.length === 0) return;
                    setLiquidCash(p => p + cartTotal);
                    setSalesLog([{ id: "INV-"+Math.floor(1000+Math.random()*9000), total: cartTotal, itemsCount: cart.length }, ...salesLog]);
                    setCart([]);
                    showToast(`تم إتمام البيع بنجاح بقيمة ${cartTotal} ج.م!`);
                    window.print();
                  }}
                  disabled={cart.length === 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition ${cart.length > 0 ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                >
                  إتمام البيع الفوري وطباعة الفاتورة
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {/* شريحة السعر */}
              <div className="bg-[#111928] border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button onClick={() => setPriceTier("retail")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier==="retail"?"bg-emerald-600 text-white":"text-slate-400"}`}>قطاعي</button>
                  <button onClick={() => setPriceTier("semi")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier==="semi"?"bg-emerald-600 text-white":"text-slate-400"}`}>نصف جملة</button>
                  <button onClick={() => setPriceTier("whole")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier==="whole"?"bg-emerald-600 text-white":"text-slate-400"}`}>جملة</button>
                </div>
                <span className="text-emerald-400 font-bold">نوع التسعير: {priceTier}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => {
                  const price = priceTier === "whole" ? p.whole_price : priceTier === "semi" ? p.semi_price : p.retail_price;
                  return (
                    <div key={p.id} onClick={() => {
                      setCart(prev => {
                        const exist = prev.find(i => i.id === p.id);
                        if (exist && !p.imeiTracked) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
                        return [...prev, { ...p, qty: 1, customPrice: price }];
                      });
                      showToast(`تمت إضافة ${p.name}`);
                    }} className="bg-[#111928] hover:border-emerald-500 border border-slate-800 p-4 rounded-2xl cursor-pointer transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span className="font-mono">{p.barcode}</span>
                          {p.imeiTracked && <span className="text-amber-400 font-bold">IMEI</span>}
                        </div>
                        <h4 className="font-bold text-xs text-white mt-1 line-clamp-2">{p.name}</h4>
                        {p.imeiTracked && <p className="text-[10px] text-slate-400 font-mono mt-0.5">IMEI: {p.imei}</p>}
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

        {/* 3. مركز الصيانة وأجهزة IMEI */}
        {currentTab === "repairs" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">مركز صيانة الهواتف وتتبع IMEI</h3>
              <button onClick={() => {
                const client = prompt("اسم العميل:");
                const phone = prompt("رقم الهاتف:");
                const device = prompt("نوع الجهاز (iPhone 13):");
                const imei = prompt("رقم السيريال / IMEI (إلزامي):") || "-";
                const issue = prompt("العطل المطلوب:");
                const cost = Number(prompt("التكلفة المتفق عليها:")) || 0;
                const dep = Number(prompt("العربون المدفوع:")) || 0;
                if(client && device) {
                  const t = { id: "REP-"+Math.floor(1000+Math.random()*9000), client, phone, device, imei, issue, cost, deposit: dep, status: "قيد الفحص", date: new Date().toLocaleDateString("ar-EG") };
                  setRepairs([t, ...repairs]);
                  if(dep > 0) setLiquidCash(p => p + dep);
                  showToast("تم فتح كارت الصيانة بنجاح!");
                }
              }} className="px-3.5 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">+ استلام جهاز صيانة جديد</button>
            </div>

            <div className="space-y-3">
              {repairs.map(r => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-400">#{r.id}</span>
                    <h4 className="font-bold text-white text-sm">{r.device} - {r.client} ({r.phone})</h4>
                    <p className="text-slate-400 font-mono text-[11px]">IMEI: {r.imei} | العطل: {r.issue} | التكلفة: {r.cost} ج.م</p>
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
                      if(confirm("حذف الكارت؟")) setRepairs(repairs.filter(x => x.id !== r.id));
                    }} className="px-2 py-1 bg-rose-600/30 text-rose-300 rounded font-bold">حذف</button>
                  </div>
                </div>
              ))}
              {repairs.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد أجهزة في الصيانة</p>}
            </div>
          </div>
        )}

        {/* 4. إدارة المخزون والأصناف (CRUD كامل) */}
        {currentTab === "inventory" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">إدارة المخزون والأصناف (إضافة وتعديل وحذف)</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("inventory_list", products)} className="px-3 py-1.5 bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const name = prompt("اسم المنتج أو الجهاز:");
                  const isImei = confirm("هل هذا الجهاز مستعمل وله رقم IMEI خاص به؟ (OK نعم / Cancel لا)");
                  const imei = isImei ? prompt("أدخل رقم الـ IMEI:") : "";
                  const buy = Number(prompt("سعر الشراء:")) || 0;
                  const retail = Number(prompt("سعر القطاعي:")) || 0;
                  const stock = isImei ? 1 : (Number(prompt("الكمية:")) || 0);

                  if (name) {
                    const np = {
                      id: Date.now(),
                      name,
                      barcode: "622" + Math.floor(100 + Math.random() * 900),
                      imeiTracked: isImei,
                      imei: imei || "",
                      buy_price: buy,
                      retail_price: retail,
                      semi_price: retail - 10,
                      whole_price: retail - 20,
                      stock,
                      category: isImei ? "هواتف مستعملة" : "إكسسوارات"
                    };
                    setProducts([...products, np]);
                    showToast("تمت إضافة الصنف بنجاح!");
                  }
                }} className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ إضافة منتج أو جهاز جديد</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">المنتج / الجهاز</th>
                    <th className="py-2">الباركود / IMEI</th>
                    <th className="py-2">شراء</th>
                    <th className="py-2">قطاعي</th>
                    <th className="py-2">الكمية</th>
                    <th className="py-2">تحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-bold text-white">{p.name} {p.imeiTracked ? <span className="text-amber-400 text-[10px]">(IMEI)</span> : ""}</td>
                      <td className="py-2.5 font-mono text-emerald-400">{p.imeiTracked ? p.imei : p.barcode}</td>
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

        {/* 5. المحافظ والبنوك */}
        {currentTab === "wallets" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">المحافظ الإلكترونية والحسابات البنكية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wallets.map(w => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{w.name}</h4>
                    <p className="text-slate-400 font-mono">{w.phone}</p>
                  </div>
                  <span className="font-mono font-black text-cyan-400 text-sm">{w.balance.toLocaleString()} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. الخزينة */}
        {currentTab === "drawer" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">الخزينة النقدية ودرج الكاشير</h3>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">الرصيد النقدي الفعلي</p>
                <h2 className="text-3xl font-black text-emerald-400 font-mono mt-1">{safeBalance.toLocaleString()} ج.م</h2>
              </div>
              <button onClick={() => {
                const amt = Number(prompt("إيداع نقدي بالدرج:"));
                if(amt > 0) setSafeBalance(p => p + amt);
              }} className="px-4 py-2.5 bg-emerald-600 font-bold text-xs rounded-xl text-white">+ إيداع</button>
            </div>
          </div>
        )}

        {/* 7. العملاء */}
        {currentTab === "customers" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">العملاء وحسابات الآجل</h3>
            <div className="space-y-2">
              {customers.map(c => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-slate-400 font-mono">{c.phone}</p>
                  </div>
                  <span className="font-mono font-bold text-rose-400">{c.debt} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. التقارير */}
        {currentTab === "reports" && (
          <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">سجل المبيعات والأرباح</h3>
              <button onClick={() => exportToCSV("sales_report", salesLog)} className="px-3 py-1.5 bg-slate-800 text-purple-300 font-bold text-xs rounded-xl">تصدير Excel</button>
            </div>
            <div className="space-y-2">
              {salesLog.map(s => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-purple-300 font-bold">{s.id}</span>
                  <span className="text-slate-300">{s.itemsCount} أصناف</span>
                  <span className="font-mono text-emerald-400 font-bold">{s.total} ج.م</span>
                </div>
              ))}
              {salesLog.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد مبيعات مسجلة</p>}
            </div>
          </div>
        )}
      </main>

      {/* مودال تقفيل الشفت */}
      {shiftCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-md rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-black text-base">تقفيل الشفت - ملخص الخزينة</h3>
            <div className="bg-slate-900 p-3 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between"><span>كاش سائل بالدرج:</span><strong>{liquidCash} ج.م</strong></div>
              <div className="flex justify-between"><span>أرصدة المحافظ:</span><strong>{wallets.reduce((a,b)=>a+b.balance,0)} ج.م</strong></div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span>الإجمالي للخزينة:</span>
                <span className="text-emerald-400 font-mono">{(liquidCash + wallets.reduce((a,b)=>a+b.balance,0)).toLocaleString()} ج.م</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => {
                setShiftCloseModal(false);
                setLiquidCash(0);
                showToast("تم تقفيل الشفت وبدء وردية جديدة!");
              }} className="flex-1 py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">تأكيد وبدء شفت جديد</button>
              <button onClick={() => setShiftCloseModal(false)} className="px-4 py-3 bg-slate-800 text-slate-400 text-xs rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* القائمة الجانبية */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start" dir="rtl">
          <div className="w-72 max-w-[85vw] bg-[#111928] border-l border-slate-800 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">أقسام EL-RESALA</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${currentTab === item.id ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                  <Icon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* الشريط السفلي المتوافق مع ELOS */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0c1017]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40 shadow-2xl">
        <button onClick={() => setCurrentTab("cash_drawer")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "cash_drawer" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}>
          <Icon name="drawer" className="w-4 h-4" />
          <span>الخزينة</span>
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
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-emerald-400 font-bold">
          <Icon name="menu" className="w-4 h-4" />
          <span>القائمة</span>
        </button>
      </footer>
    </div>
  );
}
