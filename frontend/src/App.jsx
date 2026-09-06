import React, { useState, useEffect, useMemo } from "react";

// --- Inline Professional Icons ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
    wallet: <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>,
    bank: <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/>,
    lock: <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>,
    open: <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    barcode: <path d="M2 4h2v16H2zm4 0h1v16H6zm3 0h2v16H9zm4 0h1v16h-1zm3 0h2v16h-2zm4 0h2v16h-2z"/>,
    returns: <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.95 20 14.54 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.05 4 11.46 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z"/>,
    exchange: <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>,
    device: <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>,
    receive: <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>
  };
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

export default function App() {
  // --- Auth State ---
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- Navigation & Responsive State ---
  const [currentTab, setCurrentTab] = useState("cash_drawer");
  const [mobilePosTab, setMobilePosTab] = useState("catalog"); // "catalog" or "cart"

  // --- Modals State ---
  const [shiftCloseModal, setShiftCloseModal] = useState(false);
  const [confirmShiftModal, setConfirmShiftModal] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // --- Financial State ---
  const [liquidCash, setLiquidCash] = useState(() => Number(localStorage.getItem("db_liquid") || 1000));
  const [walletsTotal, setWalletsTotal] = useState(() => Number(localStorage.getItem("db_wallets") || 1000));
  const [bankTotal, setBankTotal] = useState(() => Number(localStorage.getItem("db_bank") || 0));
  const [salesCount, setSalesCount] = useState(() => Number(localStorage.getItem("db_salescount") || 6));
  const [depositsTotal, setDepositsTotal] = useState(() => Number(localStorage.getItem("db_deposits") || 1000));
  const [withdrawsTotal, setWithdrawsTotal] = useState(() => Number(localStorage.getItem("db_withdraws") || 0));

  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("db_trans") || JSON.stringify([
      { id: 1, type: "إيداع (محفظة)", desc: "إيداع - محمد مصطفي", amount: 1000, time: "07:14 م", cat: "deposit" }
    ]));
  });
  const [transFilter, setTransFilter] = useState("all");

  // --- Shift Close Fields ---
  const [countedCash, setCountedCash] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");

  // --- POS Products & Cart ---
  const [products] = useState(() => {
    return JSON.parse(localStorage.getItem("db_pos_prods") || JSON.stringify([
      { id: 1, name: "كابل فودفي تيب سي أصلي", barcode: "500001", price: 120, stock: 99, category: "قطع الغيار" },
      { id: 2, name: "شاحن سريع 25W Type-C", barcode: "500002", price: 130, stock: 19, category: "قطع الغيار" },
      { id: 3, name: "شاشة حماية زجاجية 9D", barcode: "500003", price: 45, stock: 150, category: "إكسسوارات" },
      { id: 4, name: "سماعة بلوتوث Pro لاسلكية", barcode: "500004", price: 350, stock: 12, category: "إكسسوارات" },
      { id: 5, name: "جراب حماية سليكون ضد الصدمات", barcode: "500005", price: 60, stock: 75, category: "جرابات" },
      { id: 6, name: "بطارية هاتف أصلية 4500mAh", barcode: "500006", price: 280, stock: 8, category: "قطع الغيار" }
    ]));
  });
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

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
    setLoginError("بيانات الدخول غير صحيحة! جرّب admin / admin1234");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`تمت إضافة ${product.name} للسلة`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newTotal = liquidCash + cartTotal;
    setLiquidCash(newTotal);
    localStorage.setItem("db_liquid", String(newTotal));
    setSalesCount((p) => p + 1);

    const newTrans = {
      id: Date.now(),
      type: "مبيعات نقطة البيع",
      desc: `فاتورة كاشير #${Math.floor(1000 + Math.random() * 9000)} (${cart.length} أصناف)`,
      amount: cartTotal,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      cat: "sale"
    };
    const updated = [newTrans, ...transactions];
    setTransactions(updated);
    localStorage.setItem("db_trans", JSON.stringify(updated));

    setCart([]);
    setMobilePosTab("catalog");
    showToast(`تم إتمام الفاتورة بنجاح بمبلغ ${cartTotal} ج.م!`);
  };

  const filteredTransactions = useMemo(() => {
    if (transFilter === "sales") return transactions.filter((t) => t.cat === "sale");
    if (transFilter === "deposits") return transactions.filter((t) => t.cat === "deposit");
    if (transFilter === "withdraws") return transactions.filter((t) => t.cat === "withdraw");
    return transactions;
  }, [transactions, transFilter]);

  const currentTotalInDrawer = liquidCash + walletsTotal + bankTotal;

  // --- Login Screen (Adaptive) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-600/30 mb-3">
              <Icon name="drawer" className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black">نظام الرسالة ELOS</h1>
            <p className="text-slate-400 text-xs mt-1">نظام إدارة نقاط البيع والدرج والمخازن</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition font-mono"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition font-mono"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg font-medium">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition text-sm"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center space-y-1">
            <p>المدير: <span className="text-emerald-400 font-mono font-bold">admin</span> / <span className="text-emerald-400 font-mono">admin1234</span></p>
            <p>الكاشير: <span className="text-cyan-400 font-mono font-bold">cashier</span> / <span className="text-cyan-400 font-mono">1234</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center max-w-[90vw]">
          {toastMsg}
        </div>
      )}

      {/* TOP HEADER: Fully Adaptive */}
      <header className="bg-[#111928] border-b border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2">
        {/* Right Section: Mobile Touch-friendly horizontal chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="font-extrabold text-xs sm:text-sm text-emerald-400 whitespace-nowrap ml-1 sm:ml-2">الرسالة</span>

          <button
            onClick={() => setActionModal({ type: "buy_device", title: "شراء جهاز من عميل" })}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1 border border-slate-700 text-slate-200 text-xs whitespace-nowrap"
          >
            <Icon name="device" className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden xs:inline">شراء جهاز</span>
            <span className="xs:hidden">شراء</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "exchange", title: "استبدال جهاز / بضاعة" })}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1 border border-slate-700 text-slate-200 text-xs whitespace-nowrap"
          >
            <Icon name="exchange" className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>استبدال</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "return", title: "تسجيل مرتجع عميل" })}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1 border border-slate-700 text-slate-200 text-xs whitespace-nowrap"
          >
            <Icon name="returns" className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>مرتجع</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "receive", title: "استلام جهاز صيانة من عميل" })}
            className="px-2.5 sm:px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1 border border-slate-700 text-slate-200 text-xs whitespace-nowrap"
          >
            <Icon name="receive" className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">استلام صيانة</span>
            <span className="xs:hidden">استلام</span>
          </button>

          {/* Desktop Only Search */}
          <div className="relative hidden lg:block mr-2">
            <input
              type="text"
              placeholder="بحث Ctrl+K"
              className="bg-slate-900 border border-slate-700 rounded-lg pr-7 pl-3 py-1 text-xs text-white placeholder-slate-500 w-36 focus:w-44 transition-all outline-none"
            />
            <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1.5" />
          </div>
        </div>

        {/* Left Section: Drawer Status & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="bg-emerald-950/70 border border-emerald-600/40 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-bold text-emerald-300 hidden sm:inline">درج الكاش</span>
            <span className="font-mono text-emerald-200 font-bold">{currentTotalInDrawer.toLocaleString()}</span>
          </div>

          <button
            onClick={() => showToast("تم إرسال إشارة نبضة كهربائية لفتح درج الكاش!")}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 text-xs transition"
            title="فتح الدرج"
          >
            <Icon name="open" className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">فتح الدرج</span>
          </button>

          <button
            onClick={() => setShiftCloseModal(true)}
            className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center gap-1 text-xs transition"
            title="تقفيل الشفت"
          >
            <Icon name="lock" className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">تقفيل الشفت</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition text-xs"
            title="تسجيل الخروج"
          >
            خروج
          </button>
        </div>
      </header>

      {/* BODY CONTENT: Adaptive Responsive Container */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* ========================================================
            TAB 1: درج الكاش (Cash Drawer View)
           ======================================================== */}
        {currentTab === "cash_drawer" && (
          <div className="space-y-4 sm:space-y-5">
            {/* Top Balance Summary Card */}
            <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-600/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] sm:text-xs text-emerald-400 font-medium">الرصيد الفعلي في الدرج والخزينة</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">{currentTotalInDrawer.toLocaleString()}</span>
                  <span className="text-emerald-400 text-sm font-bold">ج.م</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs w-full sm:w-auto justify-start sm:justify-end">
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-[11px] font-semibold">
                  {salesCount} عملية بيع
                </span>
                <span className="px-2.5 py-1 bg-emerald-950/70 border border-emerald-700/50 rounded-lg text-emerald-300 text-[11px] font-semibold">
                  ↑ {depositsTotal.toLocaleString()} إيداع
                </span>
                <span className="px-2.5 py-1 bg-rose-950/70 border border-rose-700/50 rounded-lg text-rose-300 text-[11px] font-semibold">
                  ↓ {withdrawsTotal.toLocaleString()} سحب
                </span>
              </div>
            </div>

            {/* Three Financial Cards: 1 column on mobile, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Card 1: Liquid Cash */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      كاش سائل - افتراضي (الكاشير)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">درج</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-1">{liquidCash.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <button
                    onClick={() => {
                      const val = Number(prompt("أدخل مبلغ الإيداع للكاش:"));
                      if (val > 0) {
                        const newAmt = liquidCash + val;
                        setLiquidCash(newAmt);
                        localStorage.setItem("db_liquid", String(newAmt));
                        setDepositsTotal((p) => p + val);
                        showToast("تم إيداع المبلغ في الكاش السائل!");
                      }
                    }}
                    className="hover:text-emerald-400 font-medium py-1"
                  >
                    + إيداع
                  </button>
                  <button
                    onClick={() => {
                      const val = Number(prompt("أدخل مبلغ السحب من الكاش:"));
                      if (val > 0 && val <= liquidCash) {
                        const newAmt = liquidCash - val;
                        setLiquidCash(newAmt);
                        localStorage.setItem("db_liquid", String(newAmt));
                        setWithdrawsTotal((p) => p + val);
                        showToast("تم سحب المبلغ من الكاش!");
                      }
                    }}
                    className="hover:text-rose-400 font-medium py-1"
                  >
                    - سحب
                  </button>
                  <button onClick={() => showToast("سجل الكاش متاح")} className="hover:text-cyan-400 font-medium py-1">السجل</button>
                </div>
              </div>

              {/* Card 2: Wallets */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      المحافظ الإلكترونية (فودافون كاش)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">2 محفظة</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-1">{walletsTotal.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">محفظة محمد مصطفي: 1,000 ج.م</span>
                  <button onClick={() => showToast("عرض تفاصيل المحافظ")} className="text-cyan-400 hover:underline font-bold">التفاصيل</button>
                </div>
              </div>

              {/* Card 3: Bank Accounts */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      الحسابات البنكية (إنستاباي)
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">1 حساب</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-1">{bankTotal.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">إنستاباي مربوط ونشط</span>
                  <button onClick={() => showToast("عرض حسابات إنستاباي")} className="text-purple-400 hover:underline font-bold">التفاصيل</button>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid: 2 cols on mobile, 5 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <button
                onClick={() => {
                  const val = Number(prompt("أدخل قيمة المصروف:"));
                  const reason = prompt("سبب المصروف:") || "مصروف عام";
                  if (val > 0) {
                    setLiquidCash((p) => p - val);
                    setWithdrawsTotal((p) => p + val);
                    const t = { id: Date.now(), type: "مصروفات", desc: reason, amount: val, time: "الآن", cat: "withdraw" };
                    setTransactions([t, ...transactions]);
                    showToast(`تم تسجيل مصروف ${val} ج.م`);
                  }
                }}
                className="py-3 px-3 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl text-center text-xs font-bold text-rose-300 transition"
              >
                تسجيل مصروف
              </button>

              <button
                onClick={() => {
                  const val = Number(prompt("مبلغ السحب من الخزينة:"));
                  if (val > 0) {
                    setLiquidCash((p) => p - val);
                    setWithdrawsTotal((p) => p + val);
                    const t = { id: Date.now(), type: "سحب للمالك", desc: "توريد أرباح", amount: val, time: "الآن", cat: "withdraw" };
                    setTransactions([t, ...transactions]);
                    showToast("تم سحب النقدية بنجاح!");
                  }
                }}
                className="py-3 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-300 transition"
              >
                سحب من الخزينة
              </button>

              <button
                onClick={() => {
                  const val = Number(prompt("مبلغ التحويل من الكاش للمحفظة:"));
                  if (val > 0 && val <= liquidCash) {
                    setLiquidCash((p) => p - val);
                    setWalletsTotal((p) => p + val);
                    showToast(`تم تحويل ${val} ج.م للمحفظة!`);
                  }
                }}
                className="py-3 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-center text-xs font-bold text-cyan-300 transition"
              >
                تحويل بين المحافظ
              </button>

              <button
                onClick={() => showToast("تم تحديث السجل")}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center text-xs font-bold text-slate-300 transition"
              >
                سجل الحركات
              </button>

              <button
                onClick={() => setCurrentTab("pos")}
                className="col-span-2 sm:col-span-1 py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-center text-xs font-bold text-white shadow-md transition"
              >
                فواتير نقطة البيع
              </button>
            </div>

            {/* Daily Transactions Section */}
            <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  حركات اليوم
                </h4>

                <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
                  {["all", "sales", "deposits", "withdraws"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTransFilter(f)}
                      className={`px-3 py-1 rounded-lg font-medium transition ${
                        transFilter === f ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {f === "all" ? "الكل" : f === "sales" ? "مبيعات" : f === "deposits" ? "إيداعات" : "مسحوبات"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {filteredTransactions.map((item) => (
                  <div key={item.id} className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${item.cat === "withdraw" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {item.cat === "withdraw" ? "↓" : "↑"}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{item.type}</p>
                        <p className="text-slate-400 text-[10px] sm:text-[11px]">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className={`font-mono font-bold text-xs sm:text-sm block ${item.cat === "withdraw" ? "text-rose-400" : "text-emerald-400"}`}>
                        {item.cat === "withdraw" ? "-" : "+"}{item.amount.toLocaleString()} ج.م
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: نقطة البيع (POS View: Responsive Grid + Mobile Tabs)
           ======================================================== */}
        {currentTab === "pos" && (
          <div className="space-y-4">
            {/* Mobile Sub-Navigation for POS (Catalog vs Cart) */}
            <div className="lg:hidden flex bg-[#111928] p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setMobilePosTab("catalog")}
                className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  mobilePosTab === "catalog" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>المنتجات والأصناف</span>
              </button>
              <button
                onClick={() => setMobilePosTab("cart")}
                className={`flex-1 py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  mobilePosTab === "cart" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>السلة والفاتورة</span>
                {cartItemsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-white text-emerald-700 rounded-full font-mono text-[10px]">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Main POS Container: 2-column on desktop, conditional on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              {/* Cart Section (Left Column on Desktop) */}
              <div className={`lg:col-span-5 bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[480px] lg:min-h-[580px] ${
                mobilePosTab === "cart" ? "block" : "hidden lg:flex"
              }`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Icon name="pos" className="w-4 h-4 text-emerald-400" />
                      سلة المشتريات
                      {cartItemsCount > 0 && <span className="text-xs text-slate-400 font-normal">({cartItemsCount} عناصر)</span>}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button onClick={() => showToast("حُفظت كمعلقة")} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg">معلقة</button>
                      <button onClick={() => setCart([])} className="px-2 py-1 bg-rose-600/20 text-rose-400 rounded-lg">مسح</button>
                    </div>
                  </div>

                  <div className="py-3 space-y-2 max-h-[320px] lg:max-h-[360px] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-16 text-slate-500 space-y-2">
                        <Icon name="pos" className="w-10 h-10 mx-auto text-slate-600" />
                        <p className="font-bold text-sm text-slate-400">السلة فارغة</p>
                        <p className="text-xs">اضغط على الأصناف في الكتالوج لإضافتها</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white text-xs">{item.name}</p>
                            <p className="text-slate-400 font-mono text-[11px]">{item.price} ج.م × {item.qty} = <span className="text-emerald-400 font-bold">{item.price * item.qty} ج.م</span></p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center justify-center font-bold">-</button>
                            <span className="w-6 text-center font-mono font-bold text-white text-xs">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center justify-center font-bold">+</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono font-bold text-slate-200">{cartTotal.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white">
                    <span>الإجمالي المستحق:</span>
                    <span className="text-emerald-400 font-mono">{cartTotal.toLocaleString()} ج.م</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                      cart.length > 0
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Icon name="check" className="w-4 h-4" />
                    <span>إتمام الفاتورة {cartTotal > 0 ? `(${cartTotal.toLocaleString()} ج.م)` : ""}</span>
                  </button>
                </div>
              </div>

              {/* Product Catalog (Right Column on Desktop) */}
              <div className={`lg:col-span-7 space-y-3 ${
                mobilePosTab === "catalog" ? "block" : "hidden lg:block"
              }`}>
                {/* Filters & Search Bar */}
                <div className="bg-[#111928] border border-slate-800 p-2.5 sm:p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {["الكل", "قطع الغيار", "إكسسوارات", "جرابات"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                          selectedCategory === cat ? "bg-emerald-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث بالاسم أو الباركود..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-7 pl-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                    <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2" />
                  </div>
                </div>

                {/* Products Grid: 2 columns on mobile, 3 on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {products
                    .filter((p) => selectedCategory === "الكل" || p.category === selectedCategory)
                    .filter((p) => p.name.includes(searchQuery) || p.barcode.includes(searchQuery))
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className="bg-[#111928] hover:bg-slate-800/90 active:scale-95 border border-slate-800 hover:border-emerald-500/40 p-3 sm:p-4 rounded-2xl cursor-pointer transition flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                            <span className="font-mono text-emerald-400">{p.barcode}</span>
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">متبقي {p.stock}</span>
                          </div>
                          <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition line-clamp-2">{p.name}</h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="font-black text-xs sm:text-sm text-white font-mono">{p.price} <span className="text-[10px] text-slate-400">ج.م</span></span>
                          <span className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                            +
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Mobile Floating Cart Summary Button */}
                {cartItemsCount > 0 && mobilePosTab === "catalog" && (
                  <div className="lg:hidden sticky bottom-20 z-20">
                    <button
                      onClick={() => setMobilePosTab("cart")}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-2xl flex items-center justify-between px-5 font-bold text-xs animate-pulse"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="pos" className="w-4 h-4" />
                        <span>عرض السلة ({cartItemsCount} أصناف)</span>
                      </div>
                      <span className="font-mono text-sm">{cartTotal.toLocaleString()} ج.م ←</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: الجرد والمخزون (Audit / Stock View)
           ======================================================== */}
        {currentTab === "audit" && (
          <div className="space-y-4 bg-[#111928] border border-slate-800 p-4 sm:p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Icon name="audit" className="w-5 h-5 text-emerald-400" />
                  جلسة جرد المخزون الدوري والمطابقة
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">مطابقة الأرصدة الفعلية برصيد السيستم لاكتشاف العجز أو الزيادة فوراً.</p>
              </div>
              <button
                onClick={() => showToast("تمت تسوية المخزون الفعلي بنجاح!")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition whitespace-nowrap"
              >
                اعتماد الجرد وتسوية الرصيد
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5 sm:p-3">المنتج</th>
                    <th className="p-2.5 sm:p-3">الباركود</th>
                    <th className="p-2.5 sm:p-3">رصيد السيستم</th>
                    <th className="p-2.5 sm:p-3">العدد الفعلي</th>
                    <th className="p-2.5 sm:p-3">الفارق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2.5 sm:p-3 font-bold text-white">{p.name}</td>
                      <td className="p-2.5 sm:p-3 font-mono text-cyan-400">{p.barcode}</td>
                      <td className="p-2.5 sm:p-3 font-bold">{p.stock}</td>
                      <td className="p-2.5 sm:p-3">
                        <input type="number" defaultValue={p.stock} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-white" />
                      </td>
                      <td className="p-2.5 sm:p-3 text-emerald-400 font-bold">0 (مطابق)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          RESPONSIVE MODAL 1: تقفيل الشفت
         ======================================================== */}
      {shiftCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Icon name="lock" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base">تقفيل الشفت - ملخص الخزينة</h3>
                  <p className="text-[11px] text-slate-400">وردية ({user.name})</p>
                </div>
              </div>
              <button onClick={() => setShiftCloseModal(false)} className="text-slate-400 hover:text-white text-lg p-1">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="text-slate-300">كاش سائل (الدرج)</span>
                <span className="font-mono font-bold text-emerald-400">{liquidCash.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="text-slate-300">محفظة إلكترونية (فودافون كاش)</span>
                <span className="font-mono font-bold text-cyan-400">{walletsTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="text-slate-300">حساب بنكي (إنستاباي)</span>
                <span className="font-mono font-bold text-purple-400">{bankTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 sm:p-3 rounded-xl flex justify-between items-center font-bold text-xs sm:text-sm">
                <span className="text-emerald-300">إجمالي ما سيتسجل في الخزينة:</span>
                <span className="font-mono text-emerald-400">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                  <span className="w-4 h-4 bg-cyan-500/20 rounded-full flex items-center justify-center text-[10px]">1</span>
                  <span>مطابقة الكاش السائل</span>
                </div>
                <input
                  type="number"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  placeholder="عد الكاش واكتب الرقم هنا..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <span className="w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center text-[10px]">2</span>
                  <span>ملاحظات تقفيل الشفت (اختياري)</span>
                </div>
                <input
                  type="text"
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="ملاحظات الوردية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => showToast("جاري طباعة التقرير الحراري...")}
                className="flex-1 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>طباعة التقرير</span>
              </button>

              <button
                onClick={() => {
                  setShiftCloseModal(false);
                  setConfirmShiftModal(true);
                }}
                className="flex-1 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
              >
                تقفيل الشفت الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          RESPONSIVE MODAL 2: تأكيد تقفيل الشفت
         ======================================================== */}
      {confirmShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-sm rounded-3xl shadow-2xl p-5 text-white space-y-3.5">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center mb-2">
                <Icon name="lock" className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base">تأكيد تقفيل الشفت</h3>
              <p className="text-[11px] text-slate-400">ترحيل الرصيد للخزينة وبدء شفت جديد</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">المبيعات:</span>
                <span className="font-bold text-white font-mono">{salesCount} عملية</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">إيداعات:</span>
                <span className="font-mono text-emerald-400 font-bold">{depositsTotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">مسحوبات:</span>
                <span className="font-mono text-rose-400 font-bold">{withdrawsTotal} ج.م</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                <span className="text-emerald-300">الصافي المنقول:</span>
                <span className="text-emerald-400 font-mono text-sm">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setConfirmShiftModal(false);
                  setLiquidCash(0);
                  localStorage.setItem("db_liquid", "0");
                  showToast("تم تقفيل الشفت بنجاح وبدء وردية جديدة!");
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-black text-xs rounded-xl shadow-lg transition"
              >
                تأكيد وبدء شفت جديد
              </button>
              <button
                onClick={() => setConfirmShiftModal(false)}
                className="w-full py-2 bg-slate-800 text-slate-400 text-xs rounded-xl transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Quick Action Buttons */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-sm rounded-2xl p-5 text-white space-y-3">
            <h3 className="font-bold text-sm text-cyan-300">{actionModal.title}</h3>
            <div className="space-y-2.5 text-xs">
              <input type="text" placeholder="اسم العميل ورقم الهاتف..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none" />
              <input type="text" placeholder="الصنف أو الموديل..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none" />
              <input type="number" placeholder="المبلغ المالي (ج.م)..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none font-mono" />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`تم تسجيل ${actionModal.title} بنجاح!`);
                  setActionModal(null);
                }}
                className="flex-1 py-2 bg-emerald-600 font-bold text-xs rounded-xl text-white"
              >
                حفظ
              </button>
              <button onClick={() => setActionModal(null)} className="px-4 py-2 bg-slate-800 text-slate-400 text-xs rounded-xl">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM NAVIGATION BAR (Thumb-friendly ELOS Bar)
         ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0c1017]/95 backdrop-blur-md border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40">
        <button
          onClick={() => setCurrentTab("cash_drawer")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "cash_drawer" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"
          }`}
        >
          <Icon name="drawer" className="w-4 h-4" />
          <span>درج الكاش</span>
        </button>

        <button
          onClick={() => setCurrentTab("pos")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "pos" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"
          }`}
        >
          <Icon name="pos" className="w-4 h-4" />
          <span>نقطة البيع</span>
        </button>

        <button
          onClick={() => setCurrentTab("audit")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "audit" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"
          }`}
        >
          <Icon name="audit" className="w-4 h-4" />
          <span>الجرد</span>
        </button>

        <button
          onClick={() => showToast("قسم الصيانة نشط")}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-white transition"
        >
          <Icon name="device" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>

        <button
          onClick={() => showToast("قسم الحسابات والأرباح")}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-white transition"
        >
          <Icon name="bank" className="w-4 h-4" />
          <span>الحسابات</span>
        </button>
      </footer>
    </div>
  );
}
