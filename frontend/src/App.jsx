import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات النظام ---
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
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c-.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c-.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  };
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24">{icons[name] || icons.dashboard}</svg>;
};

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [liveDate, setLiveDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [currentTab, setCurrentTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);

  // تسعير المبيعات
  const [priceTier, setPriceTier] = useState("retail");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);

  // قواعد البيانات القابلة للتعديل والتحكم الكامل
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("db_prods_v6") || JSON.stringify([
    { id: 1, name: "شاحن سامسونج أصلي 25W", barcode: "622001", buy_price: 85, retail_price: 160, semi_price: 130, whole_price: 110, stock: 45, category: "شواحن" },
    { id: 2, name: "كابل شحن سريع قماش Type-C", barcode: "622002", buy_price: 22, retail_price: 55, semi_price: 40, whole_price: 32, stock: 95, category: "كابلات" },
    { id: 3, name: "اسكرينة حماية 9D سيراميك", barcode: "622003", buy_price: 12, retail_price: 45, semi_price: 30, whole_price: 22, stock: 160, category: "اسكرينات" }
  ])));

  const [cart, setCart] = useState([]);
  const [repairs, setRepairs] = useState(() => JSON.parse(localStorage.getItem("db_repairs_v6") || "[]"));
  const [wallets, setWallets] = useState(() => JSON.parse(localStorage.getItem("db_wallets_v6") || JSON.stringify([
    { id: "voda", name: "فودافون كاش الرئيسية", phone: "01002345678", balance: 5400 },
    { id: "insta", name: "إنستاباي InstaPay", phone: "elresala@instapay", balance: 12400 }
  ])));
  const [safeBalance, setSafeBalance] = useState(() => Number(localStorage.getItem("db_safe_v6") || 8500));
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem("db_cust_v6") || JSON.stringify([
    { id: 1, name: "عميل نقدي سريع", phone: "-", debt: 0 },
    { id: 2, name: "محل الهدى للموبايل", phone: "01144556677", debt: 3400 }
  ])));
  const [suppliers, setSuppliers] = useState(() => JSON.parse(localStorage.getItem("db_supp_v6") || JSON.stringify([
    { id: 1, name: "شركة النور لقطع الغيار", phone: "01011223344", dues: 2500 }
  ])));
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("db_sales_v6") || "[]"));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // حفظ التغييرات تلقائياً في LocalStorage
  useEffect(() => { localStorage.setItem("db_prods_v6", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("db_repairs_v6", JSON.stringify(repairs)); }, [repairs]);
  useEffect(() => { localStorage.setItem("db_wallets_v6", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("db_safe_v6", String(safeBalance)); }, [safeBalance]);
  useEffect(() => { localStorage.setItem("db_cust_v6", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("db_supp_v6", JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem("db_sales_v6", JSON.stringify(salesLog)); }, [salesLog]);

  // تصدير إلى Excel / CSV
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
      setLoginError("بيانات الدخول غير صحيحة");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم الرئيسية", icon: "dashboard" },
    { id: "pos", label: "نقطة البيع (قطاعي/جملة)", icon: "pos" },
    { id: "repairs", label: "مركز صيانة الهواتف", icon: "repairs" },
    { id: "audit", label: "إدارة المخزون والأصناف", icon: "audit" },
    { id: "wallets", label: "المحافظ وإنستاباي", icon: "wallet" },
    { id: "drawer", label: "الخزينة النقدية والدرج", icon: "drawer" },
    { id: "customers", label: "العملاء والحسابات الآجلة", icon: "customers" },
    { id: "suppliers", label: "الموردين والمشتريات", icon: "users" },
    { id: "reports", label: "سجل المبيعات والأرباح", icon: "reports" },
    { id: "backup", label: "النسخ الاحتياطي والتصدير", icon: "settings" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#110c28] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#1c143d] border border-purple-900/60 rounded-3xl p-6 text-white shadow-2xl">
          <h1 className="text-2xl font-black text-center mb-4">نظام الرسالة POS V6</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin" className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="admin1234" className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-purple-600 font-bold rounded-xl text-white text-sm">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141026] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center">
          {toastMsg}
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="bg-[#181333] border-b border-purple-900/40 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-[#261f49] text-purple-200 border border-purple-800/40 flex items-center justify-center">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-extrabold text-white">{menuItems.find(m => m.id === currentTab)?.label}</h1>
        </div>

        <div className="bg-[#241c45] border border-purple-800/40 px-3 py-1 rounded-xl flex items-center gap-2 text-xs font-mono text-purple-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{liveDate.toLocaleTimeString("ar-EG")}</span>
          <span className="text-purple-400 hidden sm:inline">|</span>
          <span className="hidden sm:inline">{liveDate.toLocaleDateString("ar-EG")}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-900/50 border border-purple-700/40 px-2.5 py-1 rounded-lg font-mono text-purple-200 hidden xs:inline">
            الدرج: {safeBalance.toLocaleString()} ج.م
          </span>
          <button onClick={() => setUser(null)} className="w-8 h-8 rounded-xl bg-[#261f49] text-purple-300 hover:text-rose-400 border border-purple-800/40 flex items-center justify-center">
            <Icon name="logout" className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* 1. لوحة التحكم */}
        {currentTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-white font-mono">{salesLog.reduce((a,b)=>a+b.total,0).toLocaleString()}</span>
                <p className="text-xs text-slate-400 mt-2">إجمالي مبيعات المحل (ج.م)</p>
              </div>
              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-white font-mono">{repairs.filter(r=>r.status!=="تم التسليم والتحصيل").length}</span>
                <p className="text-xs text-slate-400 mt-2">أجهزة قيد الإصلاح بالورشة</p>
              </div>
              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <span className="text-2xl font-black text-white font-mono">{products.reduce((a,b)=>a+(b.buy_price*b.stock),0).toLocaleString()}</span>
                <p className="text-xs text-slate-400 mt-2">رأس مال المخزون (شراء)</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. نقطة البيع */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-3 flex justify-between items-center text-xs">
                <div className="flex bg-[#161130] p-1 rounded-2xl border border-purple-900/50">
                  <button onClick={() => setPriceTier("retail")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "retail" ? "bg-purple-600 text-white" : "text-slate-400"}`}>قطاعي</button>
                  <button onClick={() => setPriceTier("semi")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "semi" ? "bg-purple-600 text-white" : "text-slate-400"}`}>نصف جملة</button>
                  <button onClick={() => setPriceTier("whole")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "whole" ? "bg-purple-600 text-white" : "text-slate-400"}`}>جملة</button>
                </div>
                <span className="text-purple-300 font-bold">النوع: {priceTier}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {products.map(p => {
                  const price = priceTier === "whole" ? p.whole_price : priceTier === "semi" ? p.semi_price : p.retail_price;
                  return (
                    <div key={p.id} onClick={() => setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
                      return [...prev, { ...p, qty: 1, customPrice: price }];
                    })} className="bg-[#24293e]/85 border border-slate-700 p-3 rounded-2xl cursor-pointer hover:border-purple-500">
                      <h4 className="text-xs font-bold text-white line-clamp-2">{p.name}</h4>
                      <div className="mt-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400 font-mono">{price} ج.م</span>
                        <span className="w-6 h-6 bg-purple-600/30 text-purple-300 rounded-lg flex items-center justify-center font-bold">+</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between min-h-[450px]">
              <div>
                <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700">سلة البيع</h3>
                <div className="py-2 space-y-2 max-h-[280px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-[#181d30] border border-slate-700 p-2.5 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>{item.name}</span>
                        <span>{item.customPrice * item.qty} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>تخصيص السعر:</span>
                        <input type="number" value={item.customPrice} onChange={e => {
                          const val = Number(e.target.value);
                          setCart(prev => prev.map(i => i.id === item.id ? { ...i, customPrice: val } : i));
                        }} className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center font-mono font-bold text-emerald-400 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-sm font-black">
                  <span>الإجمالي:</span>
                  <span className="text-emerald-400 font-mono text-base">{cart.reduce((a,b)=>a+(b.customPrice*b.qty),0)} ج.م</span>
                </div>
                <button onClick={() => {
                  if (cart.length === 0) return;
                  setCheckoutModal(true);
                }} disabled={cart.length === 0} className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl">
                  إتمام البيع والدفع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. مركز الصيانة المتطور (إضافة، تعديل، حذف، تغيير حالة) */}
        {currentTab === "repairs" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">مركز صيانة الهواتف (تحكم كامل)</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("repairs_report", repairs)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const client = prompt("اسم العميل:");
                  const phone = prompt("رقم الهاتف:");
                  const device = prompt("نوع الجهاز (مثال iPhone 11):");
                  const imei = prompt("رقم السيريال IMEI:") || "-";
                  const totalCost = Number(prompt("تكلفة الإصلاح:")) || 0;
                  const deposit = Number(prompt("العربون المدفوع:")) || 0;
                  if (client && device) {
                    const t = { id: "REP-"+Math.floor(1000+Math.random()*9000), client, phone, device, imei, totalCost, deposit, status: "قيد الفحص" };
                    setRepairs([t, ...repairs]);
                    if(deposit > 0) setSafeBalance(p => p + deposit);
                    showToast("تم إضافة كارت الصيانة بنجاح!");
                  }
                }} className="px-3 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">+ استلام جهاز جديد</button>
              </div>
            </div>

            <div className="space-y-3">
              {repairs.map(r => (
                <div key={r.id} className="bg-[#181d30] border border-slate-700 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-400">#{r.id}</span>
                    <h4 className="font-bold text-white text-sm">{r.device} - {r.client} ({r.phone})</h4>
                    <p className="text-slate-400">سيريال: {r.imei} | التكلفة: {r.totalCost} ج.م | المدفوع: {r.deposit} ج.م</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={r.status} onChange={e => {
                      const st = e.target.value;
                      setRepairs(repairs.map(x => x.id === r.id ? { ...x, status: st } : x));
                    }} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs">
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
              {repairs.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد أجهزة في الصيانة</p>}
            </div>
          </div>
        )}

        {/* 4. إدارة المخزون والأصناف (إضافة، تعديل، حذف) */}
        {currentTab === "audit" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">إدارة المخزون والأصناف</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("inventory_report", products)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const name = prompt("اسم الصنف أو المنتج الجديد:");
                  const barcode = prompt("الباركود:") || "622" + Math.floor(100 + Math.random() * 900);
                  const buy_price = Number(prompt("سعر الشراء:")) || 0;
                  const retail_price = Number(prompt("سعر القطاعي:")) || 0;
                  const semi_price = Number(prompt("سعر نصف الجملة:")) || retail_price;
                  const whole_price = Number(prompt("سعر الجملة:")) || retail_price;
                  const stock = Number(prompt("الكمية بالمخزن:")) || 0;
                  if (name) {
                    const np = { id: Date.now(), name, barcode, buy_price, retail_price, semi_price, whole_price, stock, category: "إكسسوارات" };
                    setProducts([...products, np]);
                    showToast("تمت إضافة المنتج بنجاح للمخزن!");
                  }
                }} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ إضافة منتج جديد</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="text-slate-400 border-b border-slate-700">
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
                      <td className="py-2.5 font-mono text-purple-300">{p.barcode}</td>
                      <td className="py-2.5">{p.buy_price} ج.م</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{p.retail_price} ج.م</td>
                      <td className="py-2.5 font-bold">{p.stock}</td>
                      <td className="py-2.5">
                        <button onClick={() => {
                          if(confirm(`هل تريد حذف ${p.name}؟`)) setProducts(products.filter(x => x.id !== p.id));
                        }} className="text-rose-400 font-bold hover:underline">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. المحافظ (إضافة محفظة، إيداع، سحب، تحكم كامل) */}
        {currentTab === "wallets" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">المحافظ الإلكترونية وإنستاباي (تحكم كامل)</h3>
              <button onClick={() => {
                const name = prompt("اسم المحفظة أو البنك (مثل: أورنج كاش):");
                const phone = prompt("رقم الهاتف أو عنوان IPA:");
                const balance = Number(prompt("الرصيد الابتدائي:")) || 0;
                if(name) {
                  setWallets([...wallets, { id: "w_"+Date.now(), name, phone: phone||"-", balance }]);
                  showToast("تمت إضافة المحفظة بنجاح!");
                }
              }} className="px-3 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">+ إضافة محفظة أو بنك</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wallets.map(w => (
                <div key={w.id} className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{w.name}</h4>
                    <p className="text-slate-400 text-xs font-mono mt-0.5">{w.phone}</p>
                    <h3 className="text-2xl font-black text-cyan-400 font-mono mt-2">{w.balance.toLocaleString()} ج.م</h3>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <button onClick={() => {
                      const amt = Number(prompt(`مبلغ الإيداع في ${w.name}:`));
                      if(amt > 0) setWallets(wallets.map(x => x.id === w.id ? { ...x, balance: x.balance + amt } : x));
                    }} className="flex-1 py-1.5 bg-slate-800 text-xs font-bold rounded-lg">+ إيداع</button>
                    <button onClick={() => {
                      const amt = Number(prompt(`مبلغ السحب من ${w.name}:`));
                      if(amt > 0 && amt <= w.balance) setWallets(wallets.map(x => x.id === w.id ? { ...x, balance: x.balance - amt } : x));
                    }} className="flex-1 py-1.5 bg-rose-600/30 text-rose-300 text-xs font-bold rounded-lg">- سحب</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. الخزينة */}
        {currentTab === "drawer" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">الخزينة النقدية ودرج الكاشير</h3>
            <div className="bg-[#181d30] border border-slate-700 p-5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">الرصيد النقدي بالدرج</p>
                <h2 className="text-3xl font-black text-emerald-400 font-mono mt-1">{safeBalance.toLocaleString()} ج.م</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  const amt = Number(prompt("إيداع نقدي بالدرج:"));
                  if(amt > 0) setSafeBalance(p => p + amt);
                }} className="px-3.5 py-2 bg-emerald-600 font-bold text-xs rounded-xl text-white">+ إيداع</button>
                <button onClick={() => {
                  const amt = Number(prompt("سحب مصروفات من الدرج:"));
                  if(amt > 0 && amt <= safeBalance) setSafeBalance(p => p - amt);
                }} className="px-3.5 py-2 bg-rose-600 font-bold text-xs rounded-xl text-white">- سحب</button>
              </div>
            </div>
          </div>
        )}

        {/* 7. العملاء والآجل */}
        {currentTab === "customers" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">العملاء وحسابات الآجل</h3>
              <button onClick={() => {
                const name = prompt("اسم العميل:");
                const phone = prompt("رقم الهاتف:");
                if(name) setCustomers([...customers, { id: Date.now(), name, phone: phone||"-", debt: 0 }]);
              }} className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">+ عميل جديد</button>
            </div>
            <div className="space-y-2">
              {customers.map(c => (
                <div key={c.id} className="bg-[#181d30] border border-slate-700 p-3.5 rounded-2xl flex justify-between items-center text-xs">
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

        {/* 8. الموردين */}
        {currentTab === "suppliers" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">الموردين والمشتريات</h3>
              <button onClick={() => {
                const name = prompt("اسم المورد:");
                const phone = prompt("الهاتف:");
                if(name) setSuppliers([...suppliers, { id: Date.now(), name, phone: phone||"-", dues: 0 }]);
              }} className="px-3 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-xl">+ مورد جديد</button>
            </div>
            <div className="space-y-2">
              {suppliers.map(s => (
                <div key={s.id} className="bg-[#181d30] border border-slate-700 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{s.name}</h4>
                    <p className="text-slate-400 font-mono">{s.phone}</p>
                  </div>
                  <span className="font-mono font-bold text-amber-400">مستحقات: {s.dues} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. التقارير */}
        {currentTab === "reports" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">سجل المبيعات والفواتير</h3>
              <button onClick={() => exportToCSV("sales_report", salesLog)} className="px-3 py-1.5 bg-slate-800 text-purple-300 font-bold text-xs rounded-xl">تصدير Excel</button>
            </div>
            <div className="space-y-2">
              {salesLog.map(s => (
                <div key={s.id} className="bg-[#181d30] border border-slate-700 p-3 rounded-2xl flex justify-between items-center text-xs">
                  <span className="font-mono text-purple-300 font-bold">{s.id}</span>
                  <span className="text-slate-300">{s.itemsCount} أصناف</span>
                  <span className="font-mono text-emerald-400 font-bold">{s.total} ج.م</span>
                </div>
              ))}
              {salesLog.length === 0 && <p className="text-center text-slate-500 py-10">لا توجد مبيعات مسجلة</p>}
            </div>
          </div>
        )}

        {/* 10. النسخ الاحتياطي */}
        {currentTab === "backup" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-6 space-y-5 text-center">
            <h3 className="text-lg font-bold text-white">النسخ الاحتياطي وتصدير الملفات</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => {
                const data = { products, repairs, wallets, safeBalance, customers, suppliers, salesLog };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `backup_${Date.now()}.json`; a.click();
                showToast("تم التصدير بنجاح!");
              }} className="px-6 py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">⬇️ تصدير نسخة احتياطية JSON</button>
            </div>
          </div>
        )}
      </main>

      {/* مودال الدفع */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#1c143d] border border-purple-800/60 w-full max-w-md rounded-3xl p-5 text-white space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm">اختيار طريقة الدفع وإتمام البيع</h3>
            <div className="space-y-2 text-xs">
              <button onClick={() => setPaymentMethod("cash")} className={`w-full py-2.5 rounded-xl font-bold border ${paymentMethod==="cash"?"bg-emerald-600":"bg-[#130d2e]"}`}>💵 نقدي (درج الكاش)</button>
              <button onClick={() => setPaymentMethod("instapay")} className={`w-full py-2.5 rounded-xl font-bold border ${paymentMethod==="instapay"?"bg-purple-600":"bg-[#130d2e]"}`}>🏦 إنستاباي / بنك</button>
            </div>
            <button onClick={() => {
              const tot = cart.reduce((a,b)=>a+(b.customPrice*b.qty),0);
              if(paymentMethod==="cash") setSafeBalance(p=>p+tot);
              setSalesLog([{id: "INV-"+Math.floor(1000+Math.random()*9000), total: tot, itemsCount: cart.length}, ...salesLog]);
              setCart([]);
              setCheckoutModal(false);
              showToast("تم إتمام الفاتورة بنجاح!");
              window.print();
            }} className="w-full py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">تأكيد الدفع وطباعة الفاتورة</button>
          </div>
        </div>
      )}

      {/* القائمة الجانبية */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start" dir="rtl">
          <div className="w-72 max-w-[85vw] bg-[#1a1338] border-l border-purple-900/50 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <h3 className="font-bold text-sm text-white">نظام الرسالة V6</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${currentTab === item.id ? "bg-purple-600 text-white" : "text-slate-300 hover:bg-purple-900/20"}`}>
                  <Icon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* الشريط السفلي الثابت */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#161130]/95 backdrop-blur-md border-t border-purple-900/50 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40 shadow-2xl">
        <button onClick={() => setCurrentTab("dashboard")} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl">
          <Icon name="dashboard" className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>
        <button onClick={() => setCurrentTab("pos")} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl">
          <Icon name="pos" className="w-4 h-4" />
          <span>البيع</span>
        </button>
        <button onClick={() => setCurrentTab("repairs")} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl">
          <Icon name="repairs" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>
        <button onClick={() => setCurrentTab("reports")} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl">
          <Icon name="reports" className="w-4 h-4" />
          <span>التقارير</span>
        </button>
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-purple-400 font-bold">
          <Icon name="menu" className="w-4 h-4" />
          <span>الأقسام</span>
        </button>
      </footer>
    </div>
  );
}
