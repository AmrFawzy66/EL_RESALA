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
    trash: <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>,
    plus: <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>,
    minus: <path d="M19 13H5v-2h14v2z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    dashboard: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    audit: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>
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

  // --- Core Navigation State ---
  const [currentTab, setCurrentTab] = useState("cash_drawer"); // "cash_drawer", "pos", "audit", "damaged", "users"

  // --- Modals State ---
  const [shiftCloseModal, setShiftCloseModal] = useState(false);
  const [confirmShiftModal, setConfirmShiftModal] = useState(false);
  const [actionModal, setActionModal] = useState(null); // { type, title }
  const [toastMsg, setToastMsg] = useState("");

  // --- Cash Drawer State ---
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

  // --- Shift Close Form State ---
  const [countedCash, setCountedCash] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");

  // --- POS State ---
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("db_pos_prods") || JSON.stringify([
      { id: 1, name: "كابل فودفي تيب سي", barcode: "500001", price: 120, stock: 99, category: "قطع الغيار" },
      { id: 2, name: "شاحن سريع أصلي 25W", barcode: "500002", price: 130, stock: 19, category: "قطع الغيار" },
      { id: 3, name: "شاشة حماية زجاجية 9D", barcode: "500003", price: 45, stock: 150, category: "إكسسوارات" },
      { id: 4, name: "بطارية هاتف Pro Max", barcode: "500004", price: 350, stock: 12, category: "قطع الغيار" }
    ]));
  });
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // --- Auth Handler ---
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

  // --- POS Functions ---
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newTotal = liquidCash + cartTotal;
    setLiquidCash(newTotal);
    localStorage.setItem("db_liquid", String(newTotal));
    setSalesCount((prev) => prev + 1);

    const newTrans = {
      id: Date.now(),
      type: "مبيعات نقطة البيع",
      desc: `فاتورة كاشير #${Math.floor(1000 + Math.random() * 9000)} (${cart.length} أصناف)`,
      amount: cartTotal,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      cat: "sale"
    };
    const updatedTrans = [newTrans, ...transactions];
    setTransactions(updatedTrans);
    localStorage.setItem("db_trans", JSON.stringify(updatedTrans));

    setCart([]);
    showToast(`تم إتمام الفاتورة بنجاح بمبلغ ${cartTotal} ج.م وإضافتها للدرج!`);
  };

  // --- Filtered Transactions ---
  const filteredTransactions = useMemo(() => {
    if (transFilter === "sales") return transactions.filter((t) => t.cat === "sale");
    if (transFilter === "deposits") return transactions.filter((t) => t.cat === "deposit");
    if (transFilter === "withdraws") return transactions.filter((t) => t.cat === "withdraw");
    return transactions;
  }, [transactions, transFilter]);

  // --- Render Login View If Not Logged In ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-600/30 mb-4">
              <Icon name="drawer" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black">نظام الرسالة ELOS</h1>
            <p className="text-slate-400 text-xs mt-1">نظام إدارة نقاط البيع والدرج والمخازن</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">اسم المستخدم</label>
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
              <label className="text-xs font-bold text-slate-300 block mb-1.5">كلمة المرور</label>
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
              <p className="text-rose-400 text-xs text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-400 text-center space-y-1">
            <p>المدير العام: <span className="text-emerald-400 font-mono font-bold">admin</span> / <span className="text-emerald-400 font-mono">admin1234</span></p>
            <p>الكاشير: <span className="text-cyan-400 font-mono font-bold">cashier</span> / <span className="text-cyan-400 font-mono">1234</span></p>
          </div>
        </div>
      </div>
    );
  }

  // --- Total in Drawer ---
  const currentTotalInDrawer = liquidCash + walletsTotal + bankTotal;

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* TOP HEADER BAR (Matching Images: شراء جهاز, استبدال, مرتجع, استلام من عميل, بحث, فتح الدرج) */}
      <header className="bg-[#111928] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
        {/* Right Section: Brand & Quick Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-extrabold text-sm text-emerald-400 ml-2 hidden sm:inline">نظام الرسالة</span>

          <button
            onClick={() => setActionModal({ type: "buy_device", title: "شراء جهاز من عميل" })}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700 text-slate-200 transition"
          >
            <Icon name="device" className="w-3.5 h-3.5 text-cyan-400" />
            <span>شراء جهاز</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "exchange", title: "استبدال جهاز / بضاعة" })}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700 text-slate-200 transition"
          >
            <Icon name="exchange" className="w-3.5 h-3.5 text-indigo-400" />
            <span>استبدال</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "return", title: "تسجيل مرتجع عميل" })}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700 text-slate-200 transition"
          >
            <Icon name="returns" className="w-3.5 h-3.5 text-rose-400" />
            <span>مرتجع</span>
          </button>

          <button
            onClick={() => setActionModal({ type: "receive", title: "استلام جهاز صيانة من عميل" })}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700 text-slate-200 transition"
          >
            <Icon name="receive" className="w-3.5 h-3.5 text-emerald-400" />
            <span>استلام من عميل</span>
          </button>

          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="بحث Ctrl+K"
              className="bg-slate-900 border border-slate-700 rounded-lg pr-7 pl-3 py-1.5 text-xs text-white placeholder-slate-500 w-36 focus:w-48 transition-all outline-none"
            />
            <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2" />
          </div>
        </div>

        {/* Left Section: Live Drawer Status & User */}
        <div className="flex items-center gap-2">
          <div className="text-left hidden lg:block mr-2">
            <span className="text-[10px] text-slate-400 block">الجمعة 4 سبتمبر 2026</span>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-600/40 px-3 py-1 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-300">درج الكاش ({user.username})</span>
          </div>

          <button
            onClick={() => showToast("تم إرسال إشارة نبضة كهربائية لفتح درج الكاش بنجاح!")}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 transition shadow-sm"
          >
            <Icon name="open" className="w-3.5 h-3.5" />
            <span>فتح الدرج</span>
          </button>

          <button
            onClick={() => setShiftCloseModal(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center gap-1 transition shadow-sm"
          >
            <Icon name="lock" className="w-3.5 h-3.5" />
            <span>تقفيل الشفت</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
            title="تسجيل الخروج"
          >
            خروج
          </button>
        </div>
      </header>

      {/* BODY CONTENT ROUTING */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
        {/* ========================================================
            VIEW 1: شاشة درج الكاش (Exact match to Image 56057.jpg)
           ======================================================== */}
        {currentTab === "cash_drawer" && (
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Top Balance Header Card */}
            <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-600/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-emerald-400 font-medium">الرصيد الفعلي في الدرج والخزينة</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl md:text-4xl font-black text-white">{currentTotalInDrawer.toLocaleString()}</span>
                  <span className="text-emerald-400 text-sm font-bold">ج.م</span>
                </div>
              </div>

              {/* Badges / Metrics Bar */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold">
                  {salesCount} عملية بيع
                </span>
                <span className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-700/50 rounded-xl text-emerald-300 font-semibold">
                  ↑ {depositsTotal.toLocaleString()} إيداع (ج.م)
                </span>
                <span className="px-3 py-1.5 bg-rose-950/70 border border-rose-700/50 rounded-xl text-rose-300 font-semibold">
                  ↓ {withdrawsTotal.toLocaleString()} سحب (ج.م)
                </span>
              </div>
            </div>

            {/* Three Main Financial Cards (Liquid Cash / Wallets / Banks) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: كاش سائل */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      كاش سائل - افتراضي (الكاشير)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">درج نقدي</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-2">{liquidCash.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                  <button
                    onClick={() => {
                      const val = Number(prompt("أدخل مبلغ الإيداع للكاش السائل:"));
                      if (val > 0) {
                        const newAmt = liquidCash + val;
                        setLiquidCash(newAmt);
                        localStorage.setItem("db_liquid", String(newAmt));
                        setDepositsTotal((p) => p + val);
                        showToast("تم إيداع المبلغ في الكاش السائل بنجاح!");
                      }
                    }}
                    className="hover:text-emerald-400 font-medium"
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
                    className="hover:text-rose-400 font-medium"
                  >
                    - سحب
                  </button>
                  <button onClick={() => showToast("عرض سجل الكاش النقدي")} className="hover:text-cyan-400 font-medium">السجل</button>
                </div>
              </div>

              {/* Card 2: المحافظ الإلكترونية */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      المحافظ الإلكترونية (فودافون كاش / وي)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">2 محفظة</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-2">{walletsTotal.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">محفظة محمد مصطفي: 1,000 ج.م</span>
                  <button onClick={() => setCurrentTab("wallets")} className="text-cyan-400 hover:underline font-bold">عرض الكل</button>
                </div>
              </div>

              {/* Card 3: الحسابات البنكية */}
              <div className="bg-[#111928] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      الحسابات البنكية (إنستاباي / بنوك)
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">1 حساب</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white my-2">{bankTotal.toLocaleString()} <span className="text-xs text-slate-400">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">إنستاباي مفعل ومربوط</span>
                  <button onClick={() => setCurrentTab("wallets")} className="text-purple-400 hover:underline font-bold">عرض الكل</button>
                </div>
              </div>
            </div>

            {/* Middle Action Buttons (تسجيل مصروف, سحب من الخزينة, تحويل, فواتير) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <button
                onClick={() => {
                  const val = Number(prompt("أدخل قيمة المصروف:"));
                  const reason = prompt("سبب المصروف (بوفيه / كهرباء / انتقالات):");
                  if (val > 0) {
                    setLiquidCash((prev) => prev - val);
                    setWithdrawsTotal((p) => p + val);
                    const t = { id: Date.now(), type: "مصروفات", desc: reason || "مصروف عام", amount: val, time: "الآن", cat: "withdraw" };
                    setTransactions([t, ...transactions]);
                    showToast(`تم تسجيل مصروف بمبلغ ${val} ج.م`);
                  }
                }}
                className="py-3 px-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 rounded-xl text-center text-xs font-bold text-rose-300 transition"
              >
                تسجيل مصروف
              </button>

              <button
                onClick={() => {
                  const val = Number(prompt("مبلغ السحب من الخزينة للمدير:"));
                  if (val > 0) {
                    setLiquidCash((prev) => prev - val);
                    setWithdrawsTotal((p) => p + val);
                    const t = { id: Date.now(), type: "سحب للمالك", desc: "سحب أرباح / توريد", amount: val, time: "الآن", cat: "withdraw" };
                    setTransactions([t, ...transactions]);
                    showToast("تم سحب النقدية بنجاح!");
                  }
                }}
                className="py-3 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-300 transition"
              >
                سحب من الخزينة
              </button>

              <button
                onClick={() => {
                  const val = Number(prompt("أدخل مبلغ التحويل من الكاش السائل للمحفظة:"));
                  if (val > 0 && val <= liquidCash) {
                    setLiquidCash((p) => p - val);
                    setWalletsTotal((p) => p + val);
                    showToast(`تم تحويل ${val} ج.م إلى محفظة فودافون بنجاح!`);
                  }
                }}
                className="py-3 px-4 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-center text-xs font-bold text-cyan-300 transition"
              >
                تحويل بين المحافظ
              </button>

              <button
                onClick={() => showToast("تم تحديث سجل الحركات")}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-center text-xs font-bold text-slate-300 transition"
              >
                سجل الحركات
              </button>

              <button
                onClick={() => setCurrentTab("pos")}
                className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-center text-xs font-bold text-white shadow-lg transition"
              >
                فواتير نقطة البيع
              </button>
            </div>

            {/* Daily Transactions Section with Tabs */}
            <div className="bg-[#111928] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  حركات اليوم
                </h4>

                {/* Filter Tabs (الكل, مبيعات, إيداعات, مسحوبات) */}
                <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setTransFilter("all")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${transFilter === "all" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setTransFilter("sales")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${transFilter === "sales" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    مبيعات
                  </button>
                  <button
                    onClick={() => setTransFilter("deposits")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${transFilter === "deposits" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    إيداعات
                  </button>
                  <button
                    onClick={() => setTransFilter("withdraws")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${transFilter === "withdraws" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    مسحوبات
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2">
                {filteredTransactions.map((item) => (
                  <div key={item.id} className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${item.cat === "withdraw" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {item.cat === "withdraw" ? "↓" : "↑"}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{item.type}</p>
                        <p className="text-slate-400 text-[11px]">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className={`font-mono font-bold text-sm block ${item.cat === "withdraw" ? "text-rose-400" : "text-emerald-400"}`}>
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
            VIEW 2: نقطة البيع الاحترافية (Exact match to Image 56007.jpg)
           ======================================================== */}
        {currentTab === "pos" && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (Cart / سلة المشتريات) */}
            <div className="lg:col-span-5 bg-[#111928] border border-slate-800 rounded-2xl flex flex-col justify-between p-4 min-h-[580px]">
              <div>
                {/* Cart Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Icon name="pos" className="w-4 h-4 text-emerald-400" />
                    سلة المشتريات
                  </h3>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button onClick={() => showToast("تم حفظ الفاتورة كمعلقة")} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">معلقة</button>
                    <button onClick={() => setCart([])} className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-lg">مسح</button>
                  </div>
                </div>

                {/* Cart Items or Empty State */}
                <div className="py-4 space-y-2 max-h-[360px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 space-y-2">
                      <Icon name="pos" className="w-12 h-12 mx-auto text-slate-600" />
                      <p className="font-bold text-sm text-slate-400">السلة فارغة</p>
                      <p className="text-xs">اضغط على أي صنف من القائمة لإضافته للفاتورة</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{item.name}</p>
                          <p className="text-slate-400 font-mono text-[11px]">{item.price} ج.م × {item.qty} = <span className="text-emerald-400 font-bold">{item.price * item.qty} ج.م</span></p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center justify-center font-bold">-</button>
                          <span className="w-7 text-center font-mono font-bold text-white">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 flex items-center justify-center font-bold">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Footer & Checkout */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-bold text-slate-200">{cartTotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-emerald-400 font-mono">{cartTotal.toLocaleString()} ج.م</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                    cart.length > 0
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Icon name="check" className="w-4 h-4" />
                  <span>إتمام البيع {cartTotal > 0 ? `(${cartTotal.toLocaleString()} ج.م)` : ""}</span>
                </button>
              </div>
            </div>

            {/* Right Column (Product Catalog) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Categories Tabs & Search */}
              <div className="bg-[#111928] border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {["الكل", "قطع الغيار", "إكسسوارات"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition ${
                        selectedCategory === cat ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[150px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو الباركود..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-7 pl-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                  <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2" />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products
                  .filter((p) => selectedCategory === "الكل" || p.category === selectedCategory)
                  .filter((p) => p.name.includes(searchQuery) || p.barcode.includes(searchQuery))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="bg-[#111928] hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition duration-150 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start text-[10px] text-slate-500 mb-1">
                          <span className="font-mono text-emerald-400">{p.barcode}</span>
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">متبقي {p.stock}</span>
                        </div>
                        <h4 className="font-bold text-xs text-white group-hover:text-emerald-300 transition line-clamp-2">{p.name}</h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="font-black text-sm text-white font-mono">{p.price} <span className="text-[10px] text-slate-400">ج.م</span></span>
                        <span className="w-7 h-7 bg-emerald-600/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                          +
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: الجرد والمخزون
           ======================================================== */}
        {currentTab === "audit" && (
          <div className="max-w-5xl mx-auto space-y-4 bg-[#111928] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon name="audit" className="w-5 h-5 text-emerald-400" />
              جلسة جرد المخزون الدوري والمطابقة
            </h3>
            <p className="text-xs text-slate-400">قارن الكميات الفعلية بالأرفف لتسجيل العجز والزيادة تلقائياً.</p>

            <table className="w-full text-right text-xs mt-4">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">المنتج</th>
                  <th className="p-3">الباركود</th>
                  <th className="p-3">رصيد السيستم</th>
                  <th className="p-3">العدد الفعلي</th>
                  <th className="p-3">الفارق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-white">{p.name}</td>
                    <td className="p-3 font-mono text-cyan-400">{p.barcode}</td>
                    <td className="p-3 font-bold">{p.stock}</td>
                    <td className="p-3">
                      <input type="number" defaultValue={p.stock} className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-white" />
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">0 (مطابق)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: تقفيل الشفت بالخطوات (Exact match to Images 56010 & 56029)
         ======================================================== */}
      {shiftCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl p-6 text-white space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Icon name="lock" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base">تقفيل الشفت - ملخص ما سيتسجل في الخزينة</h3>
                  <p className="text-xs text-slate-400">شفت الكاشير الحالي ({user.name})</p>
                </div>
              </div>
              <button onClick={() => setShiftCloseModal(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            {/* Wallets Breakdown Table (Image 56010) */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="font-bold text-slate-300">كاش سائل - افتراضي (الدرج)</span>
                <span className="font-mono font-bold text-emerald-400">{liquidCash.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="font-bold text-slate-300">محفظة إلكترونية (محمد مصطفي)</span>
                <span className="font-mono font-bold text-cyan-400">{walletsTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl flex justify-between items-center border border-slate-800">
                <span className="font-bold text-slate-300">حساب بنكي - إنستاباي</span>
                <span className="font-mono font-bold text-purple-400">{bankTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex justify-between items-center font-bold text-sm">
                <span className="text-emerald-300">إجمالي ما سيتسجل في الخزينة:</span>
                <span className="font-mono text-emerald-400">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>

            {/* Step 1 & Step 2 (Image 56029) */}
            <div className="space-y-3 pt-2">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span className="w-5 h-5 bg-cyan-500/20 rounded-full flex items-center justify-center text-[11px]">1</span>
                  <span>مطابقة الكاش السائل</span>
                </div>
                <p className="text-[11px] text-slate-400">المتوقع في الكاش: <strong className="text-white font-mono">{liquidCash} ج.م</strong></p>
                <input
                  type="number"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  placeholder="عد الكاش واكتب الرقم هنا (أو اتركه فاضياً)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <span className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-[11px]">2</span>
                  <span>ملاحظات تقفيل الشفت (اختياري)</span>
                </div>
                <input
                  type="text"
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="أي ملاحظات عن تقفيل اليوم أو الوردية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Step 3 Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => showToast("جاري إرسال أمر طباعة تقرير الشفت للطابعة الحرارية...")}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>طباعة التقرير الحراري</span>
              </button>

              <button
                onClick={() => {
                  setShiftCloseModal(false);
                  setConfirmShiftModal(true);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
              >
                تقفيل الشفت الآن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: تأكيد تقفيل الشفت (Exact match to Image 56051.jpg)
         ======================================================== */}
      {confirmShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl p-6 text-white space-y-4">
            <div className="text-center pb-2">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center mb-2">
                <Icon name="lock" className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg">تأكيد تقفيل الشفت</h3>
              <p className="text-xs text-slate-400">سيتم ترحيل المبالغ للخزينة وبدء شفت جديد</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">المبيعات:</span>
                <span className="font-bold text-white font-mono">{salesCount} عملية ({currentTotalInDrawer} ج.م)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">إيداعات يدوية:</span>
                <span className="font-mono text-emerald-400 font-bold">{depositsTotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">مسحوبات ومصروفات:</span>
                <span className="font-mono text-rose-400 font-bold">{withdrawsTotal} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">مطابقة الكاش:</span>
                <span className="text-cyan-400">{countedCash ? `الفعلي ${countedCash} ج.م` : "لم تتم - بدون عجز"}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black">
                <span className="text-emerald-300">صافي المبلغ للخزينة:</span>
                <span className="text-emerald-400 font-mono">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setConfirmShiftModal(false);
                  setLiquidCash(0);
                  localStorage.setItem("db_liquid", "0");
                  showToast("تم تقفيل الشفت بنجاح وترحيل الرصيد للخزينة الرئيسية!");
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                تأكيد التقفيل وبدء شفت جديد
              </button>

              <button
                onClick={() => setConfirmShiftModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-xl transition"
              >
                إلغاء والعودة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Modal for Top Action Buttons (شراء جهاز, استبدال, مرتجع) */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#111928] border border-slate-700 w-full max-w-md rounded-2xl p-6 text-white space-y-4">
            <h3 className="font-bold text-base text-cyan-300">{actionModal.title}</h3>
            <div className="space-y-3 text-xs">
              <input type="text" placeholder="اسم العميل ورقم الهاتف..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
              <input type="text" placeholder="اسم الجهاز أو الموديل أو الصنف..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white" />
              <input type="number" placeholder="المبلغ المالي المتفق عليه (ج.م)..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono" />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`تم حفظ عملية ${actionModal.title} بنجاح!`);
                  setActionModal(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 font-bold text-xs rounded-xl text-white"
              >
                حفظ العملية
              </button>
              <button onClick={() => setActionModal(null)} className="px-4 py-2.5 bg-slate-800 text-slate-400 text-xs rounded-xl">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM NAVIGATION BAR (Exact match to ELOS Bar in all images)
         ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0c1017] border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40">
        <button
          onClick={() => setCurrentTab("cash_drawer")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "cash_drawer" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}
        >
          <Icon name="drawer" className="w-4 h-4" />
          <span>درج الكاش</span>
        </button>

        <button
          onClick={() => setCurrentTab("pos")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "pos" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}
        >
          <Icon name="pos" className="w-4 h-4" />
          <span>نقطة البيع</span>
        </button>

        <button
          onClick={() => setCurrentTab("audit")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "audit" ? "text-emerald-400 font-bold bg-emerald-950/40" : "hover:text-white"}`}
        >
          <Icon name="audit" className="w-4 h-4" />
          <span>المخزون والجرد</span>
        </button>

        <button
          onClick={() => showToast("قسم الصيانة واستلام الأجهزة نشط")}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-white transition"
        >
          <Icon name="device" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>

        <button
          onClick={() => showToast("شاشة الحسابات العامة والأرباح")}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-white transition"
        >
          <Icon name="bank" className="w-4 h-4" />
          <span>الحسابات</span>
        </button>
      </footer>
    </div>
  );
}
