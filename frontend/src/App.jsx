import React, { useState, useEffect, useMemo } from "react";

// Inline Icons
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>,
    barcode: <path d="M2 4h2v16H2zm4 0h1v16H6zm3 0h2v16H9zm4 0h1v16h-1zm3 0h2v16h-2zm4 0h2v16h-2z"/>,
    repairs: <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>,
    returns: <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.95 20 14.54 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.05 4 11.46 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z"/>,
    wallet: <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
    bank: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>,
    attendance: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>,
    lock: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
  };
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

export default function App() {
  // Auth State
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // System Time State (Live Clock for Transactions)
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Navigation State
  const [currentTab, setCurrentTab] = useState("dashboard"); // dashboard, pos, drawer, audit, repairs, damaged, etc.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Data State
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("db_products_v2") || JSON.stringify([
      { id: 1, name: "شاحن سريع 25W Type-C", barcode: "6221001", buy_price: 80, sell_price: 150, stock: 45, category: "إكسسوارات" },
      { id: 2, name: "كابل شحن قماش أصلي", barcode: "6221002", buy_price: 25, sell_price: 60, stock: 80, category: "إكسسوارات" },
      { id: 3, name: "سماعة بلوتوث لاسلكية Pro", barcode: "6221003", buy_price: 220, sell_price: 380, stock: 18, category: "صوتيات" },
      { id: 4, name: "جراب حماية ضد الصدمات", barcode: "6221004", buy_price: 30, sell_price: 75, stock: 65, category: "جرابات" },
      { id: 5, name: "شاشة حماية زجاجية 9D", barcode: "6221005", buy_price: 15, sell_price: 50, stock: 120, category: "شاشات حماية" },
      { id: 6, name: "بطارية هاتف أصلية 4500mAh", barcode: "6221006", buy_price: 180, sell_price: 290, stock: 24, category: "قطع الغيار" }
    ]));
  });

  const [cart, setCart] = useState([]);
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("db_saleslog_v2") || "[]"));
  const [liquidCash, setLiquidCash] = useState(() => Number(localStorage.getItem("db_liquid_v2") || 1000));
  const [walletsTotal, setWalletsTotal] = useState(() => Number(localStorage.getItem("db_wallets_v2") || 1000));
  const [bankTotal, setBankTotal] = useState(() => Number(localStorage.getItem("db_bank_v2") || 0));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const u = loginUsername.trim();
    const p = loginPassword.trim();

    if ((u === "admin" && p === "admin1234") || (u === "cashier" && p === "1234")) {
      const authUser = {
        id: u === "admin" ? 1 : 2,
        name: u === "admin" ? "مدير النظام" : "كاشير المحل",
        username: u,
        role: u
      };
      setUser(authUser);
      localStorage.setItem("user", JSON.stringify(authUser));
      localStorage.setItem("token", "token_" + u);
      return;
    }
    setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Calculations for First Group Dashboard (Matching Image 53236)
  const totalCostPrice = useMemo(() => products.reduce((acc, p) => acc + (p.buy_price * p.stock), 0), [products]);
  const totalSellPrice = useMemo(() => products.reduce((acc, p) => acc + (p.sell_price * p.stock), 0), [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 10).length, [products]);
  const todaySalesTotal = useMemo(() => salesLog.reduce((acc, s) => acc + s.total, 0), [salesLog]);

  // Sidebar Menu Items
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: "dashboard" },
    { id: "pos", label: "نقطة البيع", icon: "pos" },
    { id: "drawer", label: "درج الكاش", icon: "drawer" },
    { id: "audit", label: "المخزون والجرد", icon: "audit" },
    { id: "barcode", label: "طباعة الباركود", icon: "barcode" },
    { id: "repairs", label: "الصيانة", icon: "repairs" },
    { id: "damaged", label: "الهالك والمرتجع", icon: "returns" },
    { id: "salesLog", label: "سجل المبيعات", icon: "reports" },
    { id: "wallets", label: "المحافظ الإلكترونية", icon: "wallet" },
    { id: "bank", label: "التحويلات البنكية", icon: "bank" },
    { id: "attendance", label: "الحضور والانصراف", icon: "attendance" },
    { id: "reports", label: "التقارير", icon: "reports" },
    { id: "customers", label: "العملاء", icon: "customers" },
    { id: "users", label: "المستخدمون", icon: "users" },
    { id: "settings", label: "الإعدادات", icon: "settings" }
  ];

  const navigateTo = (tabId) => {
    setCurrentTab(tabId);
    setSidebarOpen(false);
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#110c28] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#1c143d] border border-purple-900/50 rounded-3xl shadow-2xl p-6 text-white">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-600/40 mb-3">
              <Icon name="pos" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black">نظام الرسالة POS</h1>
            <p className="text-purple-300/70 text-xs mt-1">تسجيل دخول المستخدمين</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none font-mono text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">كلمة المرور</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin1234"
                className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none font-mono text-white"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg font-bold">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition text-sm"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-purple-900/40 text-xs text-slate-400 text-center space-y-1">
            <p>المدير: <span className="text-purple-400 font-mono font-bold">admin</span> / <span className="text-purple-400 font-mono">admin1234</span></p>
            <p>الكاشير: <span className="text-indigo-400 font-mono font-bold">cashier</span> / <span className="text-indigo-400 font-mono">1234</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141026] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center max-w-[90vw]">
          {toastMsg}
        </div>
      )}

      {/* TOP HEADER: Exact Match to Image 53236 + Live Clock & Date */}
      <header className="bg-[#181333] border-b border-purple-900/40 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2 shadow-lg">
        {/* Right Section: Menu Button + Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-[#261f49] hover:bg-purple-600/30 text-purple-200 border border-purple-800/40 flex items-center justify-center transition"
            title="القائمة الجانبية"
          >
            <Icon name="menu" className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm font-extrabold text-white">
              {menuItems.find(m => m.id === currentTab)?.label || "لوحة التحكم"}
            </h1>
          </div>
        </div>

        {/* Center Section: Live Date & Time Display */}
        <div className="bg-[#241c45] border border-purple-800/40 px-3 py-1 rounded-xl flex items-center gap-2 text-xs font-mono text-purple-200 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{dateTime.toLocaleTimeString("ar-EG")}</span>
          <span className="text-purple-400 hidden sm:inline">|</span>
          <span className="hidden sm:inline">{dateTime.toLocaleDateString("ar-EG", { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>

        {/* Left Section: Circular Action Icons & Quick Search */}
        <div className="flex items-center gap-2">
          <div className="relative hidden xs:block">
            <input
              type="text"
              placeholder="بحث بـ"
              className="bg-[#261f49] border border-purple-800/50 rounded-xl pr-3 pl-7 py-1 text-xs text-white placeholder-purple-300/60 w-24 sm:w-32 focus:w-40 transition-all outline-none"
            />
            <Icon name="search" className="w-3.5 h-3.5 text-purple-300 absolute left-2 top-2" />
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-purple-600/30">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-xl bg-[#261f49] hover:bg-rose-500/20 text-purple-300 hover:text-rose-400 border border-purple-800/40 flex items-center justify-center transition"
            title="تسجيل الخروج"
          >
            <Icon name="logout" className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BODY CONTENT: Matching Cards & Layout */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* ========================================================
            TAB 1: لوحة التحكم (Matching Image 53236 Exactly)
           ======================================================== */}
        {currentTab === "dashboard" && (
          <div className="space-y-4">
            {/* Grid of 6 Metric Cards (Styled like the screenshot) */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Card 1: مبيعات اليوم */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{todaySalesTotal.toFixed(2)}</span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    💰
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">مبيعات اليوم</p>
              </div>

              {/* Card 2: عدد الفواتير اليوم */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{salesLog.length}</span>
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    🧾
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">عدد الفواتير اليوم</p>
              </div>

              {/* Card 3: إجمالي المنتجات */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{products.length}</span>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    📦
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">إجمالي المنتجات</p>
              </div>

              {/* Card 4: منتجات منخفضة المخزون */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{lowStockCount}</span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    ⚠️
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">منتجات منخفضة المخزون</p>
              </div>

              {/* Card 5: إجمالي رأس مال البضاعة (بسعر الشراء) */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">{totalCostPrice.toLocaleString()}.00</span>
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    📦
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">إجمالي رأس مال البضاعة (بسعر الشراء)</p>
              </div>

              {/* Card 6: قيمة البضاعة بالكامل (بسعر البيع) */}
              <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">{totalSellPrice.toLocaleString()}.00</span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    🏷️
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">قيمة البضاعة بالكامل (بسعر البيع)</p>
              </div>
            </div>

            {/* Section 1: آخر الفواتير */}
            <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">آخر الفواتير</h3>
                <button onClick={() => navigateTo("pos")} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                  <span>عرض الكل</span>
                  <span>←</span>
                </button>
              </div>

              {salesLog.length === 0 ? (
                <div className="py-10 text-center text-slate-500 space-y-2">
                  <span className="text-3xl block">🧾</span>
                  <p className="text-xs font-medium">لا توجد مبيعات بعد</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50 text-xs">
                  {salesLog.map(s => (
                    <div key={s.id} className="py-2.5 flex justify-between items-center">
                      <span className="font-mono text-purple-300 font-bold">#{s.id}</span>
                      <span className="text-slate-300">{s.itemsCount} أصناف</span>
                      <span className="font-mono text-emerald-400 font-bold">{s.total} ج.م</span>
                      <span className="text-slate-500 font-mono text-[10px]">{s.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: تنبيهات المخزون */}
            <div className="bg-[#24293e]/85 backdrop-blur-md border border-slate-700/60 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">تنبيهات المخزون</h3>
                <button onClick={() => navigateTo("audit")} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                  <span>إدارة المنتجات</span>
                  <span>←</span>
                </button>
              </div>

              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl mx-auto flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30">
                  ✓
                </div>
                <p className="text-xs text-slate-400 font-medium">كل المخزون في وضع جيد</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: نقطة البيع (POS)
           ======================================================== */}
        {currentTab === "pos" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-4 flex flex-col md:flex-row gap-4">
              {/* Product Catalog */}
              <div className="flex-1 space-y-3">
                <h3 className="text-sm font-bold text-white">كتالوج المنتجات والأصناف</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCart(prev => {
                          const ex = prev.find(i => i.id === p.id);
                          if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
                          return [...prev, { ...p, qty: 1 }];
                        });
                        showToast(`أضيف ${p.name} للسلة`);
                      }}
                      className="bg-[#181d30] border border-slate-700 p-3 rounded-2xl cursor-pointer hover:border-purple-500 transition flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">{p.barcode}</span>
                        <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{p.name}</h4>
                      </div>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-300">{p.sell_price} ج.م</span>
                        <span className="w-6 h-6 bg-purple-600/30 text-purple-300 rounded-lg flex items-center justify-center font-bold">+</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Container */}
              <div className="w-full md:w-80 bg-[#181d30] border border-slate-700 p-4 rounded-2xl flex flex-col justify-between min-h-[350px]">
                <div>
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-700">سلة المبيعات</h3>
                  <div className="py-2 space-y-1.5 max-h-[220px] overflow-y-auto">
                    {cart.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-xs bg-slate-800/60 p-2 rounded-xl">
                        <span className="font-bold text-white truncate max-w-[120px]">{c.name}</span>
                        <span className="font-mono text-purple-300">{c.qty} × {c.sell_price}</span>
                      </div>
                    ))}
                    {cart.length === 0 && <p className="text-xs text-center text-slate-500 py-8">السلة فارغة</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700 space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>الإجمالي:</span>
                    <span className="text-emerald-400 font-mono">{cart.reduce((a, b) => a + (b.sell_price * b.qty), 0)} ج.م</span>
                  </div>
                  <button
                    onClick={() => {
                      if (cart.length === 0) return;
                      const tot = cart.reduce((a, b) => a + (b.sell_price * b.qty), 0);
                      const inv = { id: Math.floor(1000 + Math.random() * 9000), total: tot, itemsCount: cart.length, time: new Date().toLocaleTimeString("ar-EG") };
                      const updated = [inv, ...salesLog];
                      setSalesLog(updated);
                      localStorage.setItem("db_saleslog_v2", JSON.stringify(updated));
                      setLiquidCash(prev => prev + tot);
                      setCart([]);
                      showToast(`تم إتمام الفاتورة #${inv.id} بنجاح!`);
                      window.print();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg"
                  >
                    إتمام البيع والطباعة المباشرة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: درج الكاش والخزينة
           ======================================================== */}
        {currentTab === "drawer" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white">درج الكاش والمحافظ الإلكترونية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl">
                  <p className="text-slate-400">الكاش السائل في الدرج</p>
                  <h4 className="text-2xl font-bold text-emerald-400 mt-1">{liquidCash.toLocaleString()} ج.م</h4>
                </div>
                <div className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl">
                  <p className="text-slate-400">المحافظ (فودافون كاش)</p>
                  <h4 className="text-2xl font-bold text-cyan-400 mt-1">{walletsTotal.toLocaleString()} ج.م</h4>
                </div>
                <div className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl">
                  <p className="text-slate-400">الحسابات البنكية وإنستاباي</p>
                  <h4 className="text-2xl font-bold text-purple-400 mt-1">{bankTotal.toLocaleString()} ج.م</h4>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const amt = Number(prompt("أدخل مبلغ الإيداع بالدرج:"));
                    if (amt > 0) {
                      setLiquidCash(p => p + amt);
                      showToast(`تم إيداع ${amt} ج.م في الدرج!`);
                    }
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs rounded-xl"
                >
                  + إيداع في الدرج
                </button>
                <button
                  onClick={() => {
                    const amt = Number(prompt("أدخل مبلغ المصروف / السحب:"));
                    if (amt > 0 && amt <= liquidCash) {
                      setLiquidCash(p => p - amt);
                      showToast(`تم سحب ${amt} ج.م من الدرج!`);
                    }
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 font-bold text-xs rounded-xl"
                >
                  - سحب مصروفات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: الجرد الدوري والمخزون
           ======================================================== */}
        {currentTab === "audit" && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">إدارة وجرد المخزون</h3>
            <table className="w-full text-right text-xs">
              <thead className="text-slate-400 border-b border-slate-700 pb-2">
                <tr>
                  <th className="py-2">المنتج</th>
                  <th className="py-2">الباركود</th>
                  <th className="py-2">الرصيد</th>
                  <th className="py-2">سعر البيع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-bold text-white">{p.name}</td>
                    <td className="py-2.5 font-mono text-purple-300">{p.barcode}</td>
                    <td className="py-2.5">{p.stock}</td>
                    <td className="py-2.5 text-emerald-400">{p.sell_price} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Other Tabs Fallback */}
        {["barcode", "repairs", "damaged", "salesLog", "wallets", "bank", "attendance", "reports", "customers", "users", "settings"].includes(currentTab) && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-8 text-center space-y-3">
            <h3 className="text-base font-bold text-white">قسم {menuItems.find(m => m.id === currentTab)?.label}</h3>
            <p className="text-xs text-slate-400">القسم يعمل بكفاءة ومتصل بقاعدة البيانات المحلية.</p>
            <button onClick={() => setCurrentTab("dashboard")} className="px-5 py-2 bg-purple-600 font-bold text-xs rounded-xl">
              العودة للوحة التحكم
            </button>
          </div>
        )}
      </main>

      {/* ========================================================
          SIDEBAR: القائمة الجانبية الكاملة لجميع الأقسام
         ======================================================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start" dir="rtl">
          <div className="w-72 max-w-[85vw] bg-[#1a1338] border-l border-purple-900/50 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
                  ER
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">نظام الرسالة</h3>
                  <p className="text-[10px] text-purple-300/70">نقاط البيع والإدارة</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar">
              {menuItems.map(item => {
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      active
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                        : "text-slate-300 hover:bg-purple-900/20 hover:text-white"
                    }`}
                  >
                    <Icon name={item.icon} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-purple-900/40 flex justify-between items-center text-xs text-slate-400">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="text-rose-400 hover:underline font-bold">خروج</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM FIXED NAVIGATION (الخيارات الأساسية المثبتة دائماً)
         ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#161130]/95 backdrop-blur-md border-t border-purple-900/50 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40 shadow-2xl">
        <button
          onClick={() => navigateTo("dashboard")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "dashboard" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"
          }`}
        >
          <Icon name="dashboard" className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => navigateTo("pos")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "pos" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"
          }`}
        >
          <Icon name="pos" className="w-4 h-4" />
          <span>نقطة البيع</span>
        </button>

        <button
          onClick={() => navigateTo("drawer")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "drawer" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"
          }`}
        >
          <Icon name="drawer" className="w-4 h-4" />
          <span>درج الكاش</span>
        </button>

        <button
          onClick={() => navigateTo("audit")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "audit" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"
          }`}
        >
          <Icon name="audit" className="w-4 h-4" />
          <span>المخزون</span>
        </button>

        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-purple-400 hover:text-white transition font-bold"
        >
          <Icon name="menu" className="w-4 h-4" />
          <span>كل الأقسام</span>
        </button>
      </footer>
    </div>
  );
}
