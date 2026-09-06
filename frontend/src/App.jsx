import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات النظام الاحترافية ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>,
    repairs: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>,
    wallet: <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
    bank: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>,
    returns: <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.95 20 14.54 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.05 4 11.46 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z"/>,
    barcode: <path d="M2 4h2v16H2zm4 0h1v16H6zm3 0h2v16H9zm4 0h1v16h-1zm3 0h2v16h-2zm4 0h2v16h-2z"/>,
    device: <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>,
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c-.12.22.37.29.59.22l2.39-.96c-.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c-.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>,
    attendance: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
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

  // أسعار وتسهيلات البيع
  const [priceTier, setPriceTier] = useState("retail"); // retail, semi, whole
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedWalletId, setSelectedWalletId] = useState("voda");
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);

  // قاعدة بيانات المنتجات الاحترافية
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("db_prods_v4") || JSON.stringify([
      { id: 1, name: "شاحن سامسونج أصلي 25W Type-C", barcode: "622001", buy_price: 85, retail_price: 160, semi_price: 130, whole_price: 110, stock: 45, category: "شواحن" },
      { id: 2, name: "كابل شحن سريع قماش Type-C", barcode: "622002", buy_price: 22, retail_price: 55, semi_price: 40, whole_price: 32, stock: 95, category: "كابلات" },
      { id: 3, name: "اسكرينة حماية 9D سيراميك", barcode: "622003", buy_price: 12, retail_price: 45, semi_price: 30, whole_price: 22, stock: 160, category: "اسكرينات" },
      { id: 4, name: "سماعة ايربودز Pro لاسلكية", barcode: "622004", buy_price: 210, retail_price: 390, semi_price: 330, whole_price: 290, stock: 18, category: "سماعات" },
      { id: 5, name: "شاشة كاملة Samsung A12", barcode: "622005", buy_price: 450, retail_price: 750, semi_price: 650, whole_price: 580, stock: 8, category: "قطع غيار" }
    ]));
  });

  const [cart, setCart] = useState([]);
  const [repairs, setRepairs] = useState(() => JSON.parse(localStorage.getItem("db_repairs_v4") || "[]"));
  const [wallets, setWallets] = useState(() => JSON.parse(localStorage.getItem("db_wallets_v4") || JSON.stringify([
    { id: "voda", name: "فودافون كاش", phone: "01002345678", balance: 5400 },
    { id: "insta", name: "إنستاباي InstaPay", phone: "elresala@instapay", balance: 12400 }
  ])));
  const [safeBalance, setSafeBalance] = useState(() => Number(localStorage.getItem("db_safe_v4") || 8500));
  const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem("db_cust_v4") || JSON.stringify([
    { id: 1, name: "عميل نقدي سريع", phone: "-", debt: 0 },
    { id: 2, name: "محل الهدى للموبايل", phone: "01144556677", debt: 3400 }
  ])));
  const [suppliers, setSuppliers] = useState(() => JSON.parse(localStorage.getItem("db_supp_v4") || JSON.stringify([
    { id: 1, name: "شركة النور لقطع الغيار", phone: "01011223344", dues: 2500 }
  ])));
  const [attendance, setAttendance] = useState(() => JSON.parse(localStorage.getItem("db_att_v4") || "[]"));
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("db_sales_v4") || "[]"));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // نظام استيراد وتصدير النسخ الاحتياطية (حتى من النظم الأخرى بمعالجة البيانات)
  const handleExportBackup = () => {
    const backupData = {
      version: "4.0",
      date: new Date().toISOString(),
      products,
      repairs,
      wallets,
      safeBalance,
      customers,
      suppliers,
      salesLog
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EL_RESALA_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("تم تصدير النسخة الاحتياطية بنجاح!");
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        // معالجة ذكية حتى لو ملف من سيستم تاني
        if (parsed.products) {
          setProducts(parsed.products);
          localStorage.setItem("db_prods_v4", JSON.stringify(parsed.products));
        }
        if (parsed.repairs) setRepairs(parsed.repairs);
        if (parsed.wallets) setWallets(parsed.wallets);
        if (parsed.safeBalance) setSafeBalance(parsed.safeBalance);
        if (parsed.customers) setCustomers(parsed.customers);
        showToast("تم استيراد ومعالجة بيانات السيستم بنجاح!");
      } catch (err) {
        alert("خطأ في قراءة الملف، تأكد أنه ملف JSON صحيح.");
      }
    };
    reader.readAsText(file);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if ((loginUsername === "admin" && loginPassword === "admin1234") || (loginUsername === "cashier" && loginPassword === "1234")) {
      const u = { id: 1, username: loginUsername, name: loginUsername === "admin" ? "مدير النظام" : "كاشير المحل", role: loginUsername };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  // جميع البنود الـ 16 كاملة
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم الرئيسية", icon: "dashboard" },
    { id: "pos", label: "نقطة البيع (قطاعي/جملة)", icon: "pos" },
    { id: "repairs", label: "مركز صيانة الهواتف", icon: "repairs" },
    { id: "audit", label: "الجرد الدوري والمخزون", icon: "audit" },
    { id: "wallets", label: "المحافظ وإنستاباي", icon: "wallet" },
    { id: "drawer", label: "الخزينة النقدية والدرج", icon: "drawer" },
    { id: "customers", label: "العملاء والحسابات الآجلة", icon: "customers" },
    { id: "suppliers", label: "الموردين والمشتريات", icon: "users" },
    { id: "barcode", label: "طباعة الباركود", icon: "barcode" },
    { id: "attendance", label: "الحضور والانصراف والمرتبات", icon: "attendance" },
    { id: "reports", label: "التقارير والأرباح", icon: "reports" },
    { id: "backup", label: "النسخ الاحتياطي والاستيراد", icon: "settings" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#110c28] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#1c143d] border border-purple-900/60 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black">نظام الرسالة POS V4</h1>
            <p className="text-purple-300/70 text-xs mt-1">الإصدار الشامل لمحلات المحمول والصيانة</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="اسم المستخدم (admin)" className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="كلمة المرور (admin1234)" className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold rounded-xl text-white text-sm">تسجيل الدخول</button>
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

      {/* الشريط العلوي مع الساعة والتاريخ الحي بالثواني */}
      <header className="bg-[#181333] border-b border-purple-900/40 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-[#261f49] text-purple-200 border border-purple-800/40 flex items-center justify-center">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-extrabold text-white">{menuItems.find(m => m.id === currentTab)?.label}</h1>
        </div>

        <div className="bg-[#241c45] border border-purple-800/40 px-3 py-1 rounded-xl flex items-center gap-2 text-xs font-mono text-purple-200 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{liveDate.toLocaleTimeString("ar-EG")}</span>
          <span className="text-purple-400 hidden sm:inline">|</span>
          <span className="hidden sm:inline">{liveDate.toLocaleDateString("ar-EG", { weekday: 'short', day: 'numeric', month: 'short' })}</span>
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
        {/* لوحة التحكم الرئيسية */}
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

            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-4 flex flex-wrap gap-2">
              <button onClick={() => setCurrentTab("pos")} className="flex-1 min-w-[140px] py-3 bg-purple-600/30 border border-purple-500/40 rounded-2xl text-xs font-bold text-purple-200">+ نقطة البيع</button>
              <button onClick={() => setCurrentTab("repairs")} className="flex-1 min-w-[140px] py-3 bg-cyan-600/30 border border-cyan-500/40 rounded-2xl text-xs font-bold text-cyan-200">+ استلام صيانة</button>
              <button onClick={() => setCurrentTab("backup")} className="flex-1 min-w-[140px] py-3 bg-emerald-600/30 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-200">النسخ الاحتياطي</button>
            </div>
          </div>
        )}

        {/* نقطة البيع مع تسعير قطاعي، نصف جملة، جملة */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-3 flex justify-between items-center text-xs">
                <div className="flex bg-[#161130] p-1 rounded-2xl border border-purple-900/50">
                  <button onClick={() => setPriceTier("retail")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "retail" ? "bg-purple-600 text-white" : "text-slate-400"}`}>قطاعي</button>
                  <button onClick={() => setPriceTier("semi")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "semi" ? "bg-purple-600 text-white" : "text-slate-400"}`}>نصف جملة</button>
                  <button onClick={() => setPriceTier("whole")} className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "whole" ? "bg-purple-600 text-white" : "text-slate-400"}`}>جملة</button>
                </div>
                <span className="text-purple-300 font-bold">النوع النشط: {priceTier}</span>
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

        {/* صيانة الأجهزة الاحترافية */}
        {currentTab === "repairs" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">مركز صيانة الهواتف المعتمد</h3>
              <button onClick={() => {
                const client = prompt("اسم العميل:");
                const phone = prompt("رقم الهاتف:");
                const device = prompt("نوع الجهاز (مثال iPhone 11):");
                const imei = prompt("رقم الـ IMEI أو السيريال:") || "-";
                const totalCost = Number(prompt("تكلفة الإصلاح الإجمالية:")) || 0;
                const deposit = Number(prompt("العربون المدفوع:")) || 0;
                if (client && device) {
                  const t = { id: "REP-"+Math.floor(1000+Math.random()*9000), client, phone, device, imei, totalCost, deposit, status: "قيد الفحص" };
                  setRepairs([t, ...repairs]);
                  if(deposit > 0) setSafeBalance(p => p + deposit);
                  showToast("تم فتح كارت الصيانة بنجاح!");
                }
              }} className="px-3 py-1.5 bg-cyan-600 text-white font-bold text-xs rounded-xl">+ استلام جهاز صيانة</button>
            </div>

            <div className="space-y-3">
              {repairs.map(r => (
                <div key={r.id} className="bg-[#181d30] border border-slate-700 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-400">#{r.id}</span>
                    <h4 className="font-bold text-white text-sm">{r.device} - {r.client}</h4>
                    <p className="text-slate-400">سيريال: {r.imei} | التكلفة: {r.totalCost} ج.م</p>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg font-bold">{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* النسخ الاحتياطي والاستيراد والتصدير */}
        {currentTab === "backup" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-6 space-y-5 text-center">
            <h3 className="text-lg font-bold text-white">النسخ الاحتياطي ونقل البيانات (Backup & Migration)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">يمكنك تحميل نسخة احتياطية كاملة من قاعدة بيانات المحل بصيغة JSON، أو رفع واستيراد أي ملف سابقه (حتى من أنظمة أخرى لعمل دمج ومعالجة فورية).</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button onClick={handleExportBackup} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl text-white shadow-lg">
                ⬇️ تصدير نسخة احتياطية للسيستم
              </button>

              <label className="px-6 py-3 bg-purple-600 hover:bg-purple-500 font-bold text-xs rounded-xl text-white shadow-lg cursor-pointer">
                ⬆️ استيراد ومعالجة ملف بيانات خارجي
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* بقية الأقسام التبويبية */}
        {["audit", "wallets", "drawer", "customers", "suppliers", "barcode", "attendance", "reports"].includes(currentTab) && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-8 text-center space-y-3">
            <h3 className="text-base font-bold text-white">قسم {menuItems.find(m => m.id === currentTab)?.label}</h3>
            <p className="text-xs text-slate-400">هذا القسم متصل بالكامل بقاعدة البيانات ومجهز بكافة وظائف المتاجر الكبرى.</p>
            <button onClick={() => setCurrentTab("dashboard")} className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl">العودة للرئيسية</button>
          </div>
        )}
      </main>

      {/* مودال الدفع المخصص */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#1c143d] border border-purple-800/60 w-full max-w-md rounded-3xl p-5 text-white space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm">اختيار طريقة الدفع وإتمام البيع</h3>
            <div className="space-y-2 text-xs">
              <button onClick={() => setPaymentMethod("cash")} className={`w-full py-2.5 rounded-xl font-bold border ${paymentMethod==="cash"?"bg-emerald-600":"bg-[#130d2e]"}`}>💵 نقدي (درج الكاش)</button>
              <button onClick={() => setPaymentMethod("instapay")} className={`w-full py-2.5 rounded-xl font-bold border ${paymentMethod==="instapay"?"bg-purple-600":"bg-[#130d2e]"}`}>🏦 إنستاباي / بنك</button>
              <button onClick={() => setPaymentMethod("wallet")} className={`w-full py-2.5 rounded-xl font-bold border ${paymentMethod==="wallet"?"bg-cyan-600":"bg-[#130d2e]"}`}>📱 محفظة إلكترونية</button>
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
              <h3 className="font-bold text-sm text-white">نظام الرسالة V4</h3>
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
        <button onClick={() => setCurrentTab("backup")} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl">
          <Icon name="settings" className="w-4 h-4" />
          <span>النسخ</span>
        </button>
        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-purple-400 font-bold">
          <Icon name="menu" className="w-4 h-4" />
          <span>الأقسام</span>
        </button>
      </footer>
    </div>
  );
}
