import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات SVG نظيفة وخفيفة ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    pos: <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>,
    drawer: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4v2H5V7h14zm-5 6h-4v-2h4v2zM5 19v-6h14v6H5z"/>,
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
    attendance: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>,
    reports: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>,
    customers: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
    users: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    search: <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
    audit: <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h5v2h-5V5zm-4 4h9v2H8V9zm0 4h9v2H8v-2zm0 4h6v2H8v-2z"/>
  };
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      {icons[name] || icons.drawer}
    </svg>
  );
};

export default function App() {
  // --- حالة تسجيل الدخول ---
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --- التحكم في الشاشات والصفحات المصغرة ---
  const [currentTab, setCurrentTab] = useState("cash_drawer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // --- الخزينة والماليات ---
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

  // --- المنتجات والسلة ---
  const [products] = useState(() => {
    return JSON.parse(localStorage.getItem("db_pos_prods") || JSON.stringify([
      { id: 1, name: "كابل فودفي تيب سي أصلي", barcode: "500001", price: 120, stock: 99, category: "قطع الغيار" },
      { id: 2, name: "شاحن سريع 25W Type-C", barcode: "500002", price: 130, stock: 19, category: "قطع الغيار" },
      { id: 3, name: "شاشة حماية زجاجية 9D", barcode: "500003", price: 45, stock: 150, category: "إكسسوارات" },
      { id: 4, name: "سماعة بلوتوث Pro لاسلكية", barcode: "500004", price: 350, stock: 12, category: "إكسسوارات" },
      { id: 5, name: "جراب حماية ضد الصدمات", barcode: "500005", price: 60, stock: 75, category: "جرابات" },
      { id: 6, name: "بطارية هاتف أصلية 4500mAh", barcode: "500006", price: 280, stock: 8, category: "قطع الغيار" }
    ]));
  });
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  // --- سجلات الأقسام التفاعلية ---
  const [repairsList, setRepairsList] = useState(() => JSON.parse(localStorage.getItem("db_repairs") || JSON.stringify([
    { id: 101, client: "محمود حسن", phone: "01023456789", device: "Samsung A54", issue: "تغيير شاشة", cost: 1400, status: "جاهز للتسليم" }
  ])));
  const [damagedList, setDamagedList] = useState(() => JSON.parse(localStorage.getItem("db_damaged") || "[]"));
  const [customersList, setCustomersList] = useState(() => JSON.parse(localStorage.getItem("db_customers") || JSON.stringify([
    { id: 1, name: "أحمد علي", phone: "01122334455", debt: 250 },
    { id: 2, name: "متجر الأمل", phone: "01233445566", debt: 1200 }
  ])));
  const [attendanceList, setAttendanceList] = useState(() => JSON.parse(localStorage.getItem("db_attendance") || JSON.stringify([
    { id: 1, name: "أحمد كاشير", time: "09:00 ص", status: "حاضر" }
  ])));
  const [usersList, setUsersList] = useState(() => JSON.parse(localStorage.getItem("db_users") || JSON.stringify([
    { id: 1, name: "مدير النظام", username: "admin", role: "مدير عام" },
    { id: 2, name: "كاشير المحل", username: "cashier", role: "كاشير" }
  ])));

  // حقول تقفيل الشفت
  const [countedCash, setCountedCash] = useState("");
  const [shiftNotes, setShiftNotes] = useState("");

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

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`تمت إضافة ${product.name} للسلة`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0)
    );
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const currentTotalInDrawer = liquidCash + walletsTotal + bankTotal;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newTotal = liquidCash + cartTotal;
    setLiquidCash(newTotal);
    localStorage.setItem("db_liquid", String(newTotal));
    setSalesCount((p) => p + 1);

    const newTrans = {
      id: Date.now(),
      type: "مبيعات نقطة البيع",
      desc: `فاتورة مبيعات (${cart.length} أصناف)`,
      amount: cartTotal,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      cat: "sale"
    };
    const updated = [newTrans, ...transactions];
    setTransactions(updated);
    localStorage.setItem("db_trans", JSON.stringify(updated));

    setCart([]);
    showToast(`تم إتمام الفاتورة بنجاح بمبلغ ${cartTotal} ج.م!`);
  };

  const filteredTransactions = useMemo(() => {
    if (transFilter === "sales") return transactions.filter((t) => t.cat === "sale");
    if (transFilter === "deposits") return transactions.filter((t) => t.cat === "deposit");
    if (transFilter === "withdraws") return transactions.filter((t) => t.cat === "withdraw");
    return transactions;
  }, [transactions, transFilter]);

  // قائمة جميع الخيارات الـ 16
  const allFeatures = [
    { id: "cash_drawer", label: "درج الكاش الرئيسي", icon: "drawer", type: "tab" },
    { id: "pos", label: "نقطة البيع (الكاشير)", icon: "pos", type: "tab" },
    { id: "audit", label: "الجرد الدوري والمخزون", icon: "audit", type: "tab" },
    { id: "barcode", label: "طباعة الباركود", icon: "barcode", type: "modal" },
    { id: "repairs", label: "الصيانة والأجهزة", icon: "repairs", type: "modal" },
    { id: "damaged", label: "الهالك والمرتجع", icon: "returns", type: "modal" },
    { id: "salesLog", label: "سجل المبيعات والفواتير", icon: "pos", type: "modal" },
    { id: "safe", label: "الخزينة النقدية والدرج", icon: "drawer", type: "modal" },
    { id: "wallets", label: "المحافظ الإلكترونية (كاش)", icon: "wallet", type: "modal" },
    { id: "bank", label: "التحويلات البنكية وإنستاباي", icon: "bank", type: "modal" },
    { id: "attendance", label: "الحضور والانصراف", icon: "attendance", type: "modal" },
    { id: "reports", label: "التقارير والأرباح", icon: "reports", type: "modal" },
    { id: "customers", label: "العملاء والحسابات الآجلة", icon: "customers", type: "modal" },
    { id: "users", label: "المستخدمون والصلاحيات", icon: "users", type: "modal" },
    { id: "shift_close", label: "تقفيل الشفت الحالي", icon: "lock", type: "modal" },
    { id: "settings", label: "الإعدادات والطابعات", icon: "settings", type: "modal" }
  ];

  const handleOpenFeature = (feat) => {
    setMobileMenuOpen(false);
    if (feat.type === "tab") {
      setCurrentTab(feat.id);
    } else {
      setActiveModal(feat.id);
    }
  };

  // --- شاشة تسجيل الدخول باللون الأبيض والأخضر ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 text-slate-800">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-3">
              <Icon name="drawer" className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-emerald-800">نظام الرسالة POS</h1>
            <p className="text-slate-500 text-xs mt-1">تسجيل الدخول للنظام وإدارة العمليات</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:bg-white outline-none font-mono text-slate-800 transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">كلمة المرور</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin1234"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 focus:bg-white outline-none font-mono text-slate-800 transition"
                required
              />
            </div>

            {loginError && (
              <p className="text-rose-600 text-xs text-center bg-rose-50 border border-rose-200 py-2 rounded-lg font-medium">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition text-sm"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center space-y-1">
            <p>حساب الإدارة: <span className="text-emerald-700 font-mono font-bold">admin</span> / <span className="text-emerald-700 font-mono">admin1234</span></p>
            <p>حساب الكاشير: <span className="text-teal-700 font-mono font-bold">cashier</span> / <span className="text-teal-700 font-mono">1234</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none" dir="rtl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-2 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center max-w-[90vw]">
          {toastMsg}
        </div>
      )}

      {/* TOP HEADER: Clean Emerald Bar */}
      <header className="bg-emerald-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 sm:p-2 bg-emerald-800/90 hover:bg-emerald-900 rounded-xl transition flex items-center gap-1 text-xs font-bold shrink-0 border border-emerald-600 text-white"
            title="كل الأقسام"
          >
            <Icon name="menu" className="w-4 h-4" />
            <span>الأقسام</span>
          </button>

          <button
            onClick={() => setActiveModal("buy_device")}
            className="px-2.5 sm:px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm whitespace-nowrap transition"
          >
            <Icon name="device" className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>شراء جهاز</span>
          </button>

          <button
            onClick={() => setActiveModal("exchange")}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 text-xs font-medium border border-emerald-600 whitespace-nowrap transition"
          >
            <Icon name="exchange" className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>استبدال</span>
          </button>

          <button
            onClick={() => setActiveModal("damaged")}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 text-xs font-medium border border-emerald-600 whitespace-nowrap transition"
          >
            <Icon name="returns" className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>مرتجع / هالك</span>
          </button>

          <button
            onClick={() => setActiveModal("repairs")}
            className="px-2.5 sm:px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 text-xs font-medium border border-emerald-600 whitespace-nowrap transition"
          >
            <Icon name="receive" className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>استلام صيانة</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="bg-emerald-800/90 border border-emerald-500 px-2 sm:px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0"></span>
            <span className="font-bold hidden sm:inline">الدرج:</span>
            <span className="font-mono font-bold text-emerald-100">{currentTotalInDrawer.toLocaleString()} ج.م</span>
          </div>

          <button
            onClick={() => showToast("تم إرسال إشارة نبضة كهربائية لفتح درج الكاش!")}
            className="px-2.5 sm:px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold rounded-lg flex items-center gap-1 text-xs transition shadow-sm"
          >
            <Icon name="open" className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">فتح الدرج</span>
          </button>

          <button
            onClick={() => setActiveModal("shift_close")}
            className="px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 text-xs transition shadow-sm"
          >
            <Icon name="lock" className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">تقفيل الشفت</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 bg-emerald-800/70 hover:bg-rose-600 text-white rounded-lg transition text-xs"
            title="تسجيل الخروج"
          >
            خروج
          </button>
        </div>
      </header>

      {/* BODY CONTENT: Light Cards in White & Emerald */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* الشاشة 1: درج الكاش الرئيسي باللون الأبيض والأخضر */}
        {currentTab === "cash_drawer" && (
          <div className="space-y-4 sm:space-y-5">
            {/* Top Balance Card (Emerald Header) */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-emerald-100 font-medium">الرصيد الفعلي الإجمالي في الدرج والخزينة</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black">{currentTotalInDrawer.toLocaleString()}</span>
                  <span className="text-emerald-100 text-sm font-bold">ج.م</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs w-full sm:w-auto justify-start sm:justify-end">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold">
                  {salesCount} عملية بيع
                </span>
                <span className="px-3 py-1.5 bg-emerald-800/80 rounded-xl text-emerald-100 font-semibold">
                  ↑ {depositsTotal.toLocaleString()} إيداع
                </span>
                <span className="px-3 py-1.5 bg-rose-500/80 rounded-xl text-white font-semibold">
                  ↓ {withdrawsTotal.toLocaleString()} سحب
                </span>
              </div>
            </div>

            {/* الكروت الثلاثة: White Cards with Green Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div
                onClick={() => setActiveModal("safe")}
                className="bg-white hover:border-emerald-500 cursor-pointer transition border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      كاش سائل - افتراضي (الدرج)
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">درج نقدي</span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-700 my-1">{liquidCash.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-emerald-600 font-bold flex items-center justify-between">
                  <span>فتح نافذة الإيداع والسحب</span>
                  <span>←</span>
                </div>
              </div>

              <div
                onClick={() => setActiveModal("wallets")}
                className="bg-white hover:border-emerald-500 cursor-pointer transition border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      المحافظ الإلكترونية (فودافون كاش)
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">2 محفظة</span>
                  </div>
                  <h3 className="text-2xl font-black text-teal-700 my-1">{walletsTotal.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-teal-600 font-bold flex items-center justify-between">
                  <span>محفظة محمد مصطفي: 1,000 ج.م</span>
                  <span>←</span>
                </div>
              </div>

              <div
                onClick={() => setActiveModal("bank")}
                className="bg-white hover:border-emerald-500 cursor-pointer transition border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      الحسابات البنكية (إنستاباي)
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">1 حساب</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 my-1">{bankTotal.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ج.م</span></h3>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs text-emerald-600 font-bold flex items-center justify-between">
                  <span>إنستاباي مربوط ونشط</span>
                  <span>←</span>
                </div>
              </div>
            </div>

            {/* صف الأزرار السريعة */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <button
                onClick={() => setActiveModal("safe")}
                className="py-3 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-center text-xs font-bold text-rose-700 transition"
              >
                تسجيل مصروف / سحب
              </button>

              <button
                onClick={() => setActiveModal("safe")}
                className="py-3 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-700 transition"
              >
                إيداع في الخزينة
              </button>

              <button
                onClick={() => setActiveModal("wallets")}
                className="py-3 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-center text-xs font-bold text-teal-700 transition"
              >
                تحويل بين المحافظ
              </button>

              <button
                onClick={() => setActiveModal("salesLog")}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-center text-xs font-bold text-slate-700 transition"
              >
                سجل الفواتير
              </button>

              <button
                onClick={() => setCurrentTab("pos")}
                className="col-span-2 sm:col-span-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-center text-xs font-bold text-white shadow-sm transition"
              >
                فواتير نقطة البيع
              </button>
            </div>

            {/* جدول وسجل الحركات اليومية */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  حركات اليوم المسجلة
                </h4>

                <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs w-full sm:w-auto justify-between sm:justify-start">
                  {["all", "sales", "deposits", "withdraws"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTransFilter(f)}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        transFilter === f ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {f === "all" ? "الكل" : f === "sales" ? "مبيعات" : f === "deposits" ? "إيداعات" : "مسحوبات"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {filteredTransactions.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs hover:bg-emerald-50/30 transition">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${item.cat === "withdraw" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {item.cat === "withdraw" ? "↓" : "↑"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{item.type}</p>
                        <p className="text-slate-500 text-[10px] sm:text-[11px]">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className={`font-mono font-bold text-xs sm:text-sm block ${item.cat === "withdraw" ? "text-rose-600" : "text-emerald-700"}`}>
                        {item.cat === "withdraw" ? "-" : "+"}{item.amount.toLocaleString()} ج.م
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* الشاشة 2: نقطة البيع (POS) باللون الأبيض والأخضر */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* سلة المشتريات */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm min-h-[480px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Icon name="pos" className="w-4 h-4 text-emerald-600" />
                    سلة المشتريات ({cartItemsCount} عناصر)
                  </h3>
                  <button onClick={() => setCart([])} className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[11px] font-bold">مسح</button>
                </div>

                <div className="py-3 space-y-2 max-h-[320px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 space-y-2">
                      <Icon name="pos" className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-bold text-sm text-slate-600">السلة فارغة</p>
                      <p className="text-xs">اضغط على الأصناف في الكتالوج لإضافتها</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                          <p className="text-slate-500 font-mono text-[11px]">{item.price} ج.م × {item.qty} = <span className="text-emerald-700 font-bold">{item.price * item.qty} ج.م</span></p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 bg-white border border-slate-300 rounded text-slate-700 flex items-center justify-center font-bold">-</button>
                          <span className="w-6 text-center font-mono font-bold text-slate-800 text-xs">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 bg-white border border-slate-300 rounded text-slate-700 flex items-center justify-center font-bold">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex justify-between text-base font-black text-slate-800">
                  <span>الإجمالي المستحق:</span>
                  <span className="text-emerald-700 font-mono">{cartTotal.toLocaleString()} ج.م</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition ${
                    cart.length > 0
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Icon name="check" className="w-4 h-4" />
                  <span>إتمام الفاتورة {cartTotal > 0 ? `(${cartTotal.toLocaleString()} ج.م)` : ""}</span>
                </button>
              </div>
            </div>

            {/* كتالوج الأصناف والبحث */}
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-white border border-slate-200 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {["الكل", "قطع الغيار", "إكسسوارات", "جرابات"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        selectedCategory === cat ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    placeholder="بحث باسم أو باركود..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-7 pl-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <Icon name="search" className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {products
                  .filter((p) => selectedCategory === "الكل" || p.category === selectedCategory)
                  .filter((p) => p.name.includes(searchQuery) || p.barcode.includes(searchQuery))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="bg-white hover:border-emerald-500 border border-slate-200 p-3 sm:p-4 rounded-2xl cursor-pointer transition shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                          <span className="font-mono text-emerald-700 font-bold">{p.barcode}</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">متبقي {p.stock}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-2">{p.name}</h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-xs sm:text-sm text-emerald-800 font-mono">{p.price} <span className="text-[10px] text-slate-500">ج.م</span></span>
                        <span className="w-6 h-6 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xs border border-emerald-200">
                          +
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* الشاشة 3: الجرد الدوري */}
        {currentTab === "audit" && (
          <div className="space-y-4 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                  <Icon name="audit" className="w-5 h-5 text-emerald-600" />
                  جلسة جرد المخزون الدوري والمطابقة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">مطابقة الأرصدة الفعلية برصيد السيستم لاكتشاف العجز أو الزيادة فوراً.</p>
              </div>
              <button
                onClick={() => showToast("تمت تسوية المخزون الفعلي بنجاح!")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition whitespace-nowrap"
              >
                اعتماد الجرد وتسوية الرصيد
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 sm:p-3">المنتج</th>
                    <th className="p-2.5 sm:p-3">الباركود</th>
                    <th className="p-2.5 sm:p-3">رصيد السيستم</th>
                    <th className="p-2.5 sm:p-3">العدد الفعلي</th>
                    <th className="p-2.5 sm:p-3">الفارق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-800">{p.name}</td>
                      <td className="p-2.5 sm:p-3 font-mono text-emerald-700">{p.barcode}</td>
                      <td className="p-2.5 sm:p-3 font-bold">{p.stock}</td>
                      <td className="p-2.5 sm:p-3">
                        <input type="number" defaultValue={p.stock} className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-center text-slate-800" />
                      </td>
                      <td className="p-2.5 sm:p-3 text-emerald-700 font-bold">0 (مطابق)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          القائمة الجانبية باللون الأبيض والأخضر لجميع الأقسام
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-start" dir="rtl">
          <div className="bg-white border-l border-slate-200 w-80 max-w-[85vw] h-full flex flex-col p-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                  ER
                </div>
                <div>
                  <h3 className="font-black text-sm text-emerald-800">نظام الرسالة POS</h3>
                  <p className="text-[10px] text-slate-500">جميع الأقسام والعمليات</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar">
              {allFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => handleOpenFeature(feat)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-xs text-slate-700 hover:text-emerald-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-emerald-700">
                      <Icon name={feat.icon} className="w-4 h-4" />
                    </span>
                    <span className="font-bold">{feat.label}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">فتح ←</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">المستخدم: {user.name}</span>
              <button onClick={handleLogout} className="text-rose-600 font-bold hover:underline">خروج</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          الصفحات الداخلية المصغرة (Mini-Modals) باللون الأبيض والأخضر
         ======================================================== */}

      {/* 1. صفحة مصغرة: طباعة الباركود */}
      {activeModal === "barcode" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="barcode" className="w-4 h-4" />
                طباعة ملصقات الباركود
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">اختر المنتج المراد طباعته</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none">
                  {products.map(p => <option key={p.id} value={p.name}>{p.name} - {p.price} ج.م</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">مقاس الملصق</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800">
                    <option>38 × 25 مم (حراري)</option>
                    <option>50 × 30 مم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">عدد الملصقات</label>
                  <input type="number" defaultValue="5" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-center font-mono" />
                </div>
              </div>

              {/* معاينة الملصق */}
              <div className="bg-slate-50 border border-dashed border-emerald-400 text-black p-4 rounded-xl text-center space-y-1">
                <p className="font-black text-xs text-emerald-800">الرسالة للإلكترونيات</p>
                <p className="text-[11px] font-bold text-slate-700">كابل فودفي تيب سي أصلي</p>
                <div className="font-mono text-2xl tracking-widest font-black py-1">|||| | ||||| || |||</div>
                <div className="flex justify-between text-[10px] font-mono font-bold px-4 text-slate-800">
                  <span>500001</span>
                  <span>السعر: 120 ج.م</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => { showToast("جاري إرسال الملصقات لطابعة الباركود..."); setActiveModal(null); }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl text-white shadow-sm">
                طباعة الملصقات الآن
              </button>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. صفحة مصغرة: الصيانة واستلام الأجهزة */}
      {activeModal === "repairs" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-5 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="repairs" className="w-4 h-4" />
                قسم الصيانة واستلام الأجهزة
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 space-y-2.5 text-xs">
              <p className="font-bold text-emerald-800">تسجيل استلام جهاز صيانة جديد</p>
              <div className="grid grid-cols-2 gap-2">
                <input id="rep_client" type="text" placeholder="اسم العميل..." className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
                <input id="rep_phone" type="tel" placeholder="رقم الهاتف..." className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input id="rep_device" type="text" placeholder="موديل الجهاز (مثال iPhone 11)..." className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
                <input id="rep_cost" type="number" placeholder="التكلفة التقديرية (ج.م)..." className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
              </div>
              <input id="rep_issue" type="text" placeholder="وصف العطل (شاشة مكسورة / سوكت شحن)..." className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              <button
                onClick={() => {
                  const client = document.getElementById("rep_client").value;
                  const phone = document.getElementById("rep_phone").value;
                  const device = document.getElementById("rep_device").value;
                  const cost = Number(document.getElementById("rep_cost").value) || 0;
                  const issue = document.getElementById("rep_issue").value || "فحص وصيانة";
                  if (client && device) {
                    const item = { id: Date.now(), client, phone, device, issue, cost, status: "قيد الفحص" };
                    const updated = [item, ...repairsList];
                    setRepairsList(updated);
                    localStorage.setItem("db_repairs", JSON.stringify(updated));
                    showToast("تم حفظ إيصال الصيانة بنجاح!");
                  }
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl shadow-sm"
              >
                + حفظ إيصال الصيانة
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600 font-bold">الأجهزة في الصيانة حالياً</p>
              {repairsList.map(r => (
                <div key={r.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{r.device} - {r.client}</span>
                    <p className="text-slate-500 text-[11px]">{r.issue} | {r.cost} ج.م</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. صفحة مصغرة: الهالك والتالف والمرتجعات */}
      {activeModal === "damaged" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-rose-600">
                <Icon name="returns" className="w-4 h-4" />
                الهالك والمرتجع من العملاء
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">اختر الصنف التالف أو المرتجع</label>
                <select id="dam_name" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800">
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">الكمية</label>
                  <input id="dam_qty" type="number" defaultValue="1" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">النوع</label>
                  <select id="dam_type" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800">
                    <option value="هالك وتالف">هالك وتالف</option>
                    <option value="مرتجع عميل">مرتجع عميل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">السبب</label>
                <input id="dam_reason" type="text" placeholder="كسر / عيب صناعة / غير متوافق..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              </div>

              <button
                onClick={() => {
                  const name = document.getElementById("dam_name").value;
                  const qty = document.getElementById("dam_qty").value;
                  const type = document.getElementById("dam_type").value;
                  const reason = document.getElementById("dam_reason").value || "بدون سبب";
                  const item = { id: Date.now(), name, qty, type, reason, time: new Date().toLocaleTimeString("ar-EG") };
                  const updated = [item, ...damagedList];
                  setDamagedList(updated);
                  localStorage.setItem("db_damaged", JSON.stringify(updated));
                  showToast("تم إثبات العملية وتحديث المخزون والخزينة!");
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 font-bold text-xs rounded-xl text-white shadow-sm"
              >
                تأكيد وقيد العملية
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 font-bold">العمليات السابقة:</p>
              {damagedList.map(d => (
                <div key={d.id} className="bg-slate-50 p-2 rounded-lg flex justify-between text-[11px] border border-slate-200">
                  <span className="text-rose-700 font-bold">{d.type}: {d.name} ({d.qty})</span>
                  <span className="text-slate-400 font-mono">{d.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. صفحة مصغرة: الخزينة النقدية */}
      {activeModal === "safe" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="drawer" className="w-4 h-4" />
                حركات الخزينة النقدية والدرج
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
              <p className="text-xs text-slate-600 font-medium">الرصيد النقدي الحالي في الدرج</p>
              <h2 className="text-3xl font-black text-emerald-800 mt-1">{liquidCash.toLocaleString()} ج.م</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">المبلغ المالي (ج.م)</label>
                <input id="safe_amt" type="number" placeholder="500" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">البيان / السبب</label>
                <input id="safe_desc" type="text" placeholder="مصروفات بوفيه / سحب نقدي للمالك / إيداع..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const amt = Number(document.getElementById("safe_amt").value);
                    const desc = document.getElementById("safe_desc").value || "إيداع نقدي";
                    if (amt > 0) {
                      const newAmt = liquidCash + amt;
                      setLiquidCash(newAmt);
                      localStorage.setItem("db_liquid", String(newAmt));
                      setDepositsTotal(p => p + amt);
                      setTransactions([{ id: Date.now(), type: "إيداع نقدي", desc, amount: amt, time: "الآن", cat: "deposit" }, ...transactions]);
                      showToast(`تم إيداع ${amt} ج.م في الدرج بنجاح!`);
                      setActiveModal(null);
                    }
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white shadow-sm"
                >
                  + إيداع نقدية
                </button>

                <button
                  onClick={() => {
                    const amt = Number(document.getElementById("safe_amt").value);
                    const desc = document.getElementById("safe_desc").value || "سحب مصروفات";
                    if (amt > 0 && amt <= liquidCash) {
                      const newAmt = liquidCash - amt;
                      setLiquidCash(newAmt);
                      localStorage.setItem("db_liquid", String(newAmt));
                      setWithdrawsTotal(p => p + amt);
                      setTransactions([{ id: Date.now(), type: "سحب مصروفات", desc, amount: amt, time: "الآن", cat: "withdraw" }, ...transactions]);
                      showToast(`تم سحب ${amt} ج.م من الدرج!`);
                      setActiveModal(null);
                    }
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 font-bold rounded-xl text-white shadow-sm"
                >
                  - سحب مصروفات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. صفحة مصغرة: المحافظ الإلكترونية */}
      {activeModal === "wallets" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-teal-700">
                <Icon name="wallet" className="w-4 h-4" />
                المحافظ الإلكترونية (فودافون كاش)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-teal-50 p-3 rounded-xl flex justify-between items-center border border-teal-200">
                <div>
                  <p className="font-bold text-teal-900">محفظة فودافون كاش 1 (محمد مصطفي)</p>
                  <p className="text-slate-500 font-mono text-[10px]">010xxxxxxxx</p>
                </div>
                <span className="font-mono font-bold text-teal-800 text-sm">{walletsTotal.toLocaleString()} ج.م</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center border border-slate-200">
                <div>
                  <p className="font-bold text-slate-800">محفظة أورنج كاش 2</p>
                  <p className="text-slate-400 font-mono text-[10px]">012xxxxxxxx</p>
                </div>
                <span className="font-mono font-bold text-slate-500 text-sm">0.00 ج.م</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const amt = Number(prompt("أدخل مبلغ التحويل من الكاش السائل للمحفظة:"));
                    if (amt > 0 && amt <= liquidCash) {
                      setLiquidCash(p => p - amt);
                      setWalletsTotal(p => p + amt);
                      showToast(`تم تحويل ${amt} ج.م إلى المحفظة بنجاح!`);
                      setActiveModal(null);
                    }
                  }}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 font-bold rounded-xl text-white shadow-sm"
                >
                  + تحويل رصيد من الكاش للمحفظة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. صفحة مصغرة: الحسابات البنكية وإنستاباي */}
      {activeModal === "bank" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="bank" className="w-4 h-4" />
                التحويلات البنكية وإنستاباي (InstaPay)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">الحساب الرئيسي:</span>
                <span className="font-bold text-slate-800">البنك الأهلي المصري (NBE)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">عنوان إنستاباي IPA:</span>
                <span className="font-mono font-bold text-emerald-700">elresala@instapay</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">الرصيد المتاح:</span>
                <span className="font-mono text-emerald-800">{bankTotal.toLocaleString()} ج.م</span>
              </div>
            </div>

            <button
              onClick={() => {
                const amt = Number(prompt("مبلغ التحويل المستلم عبر إنستاباي:"));
                if (amt > 0) {
                  setBankTotal(p => p + amt);
                  showToast("تم قيد التحويل البنكي بنجاح!");
                  setActiveModal(null);
                }
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm"
            >
              + تسجيل تحويل وارد عبر إنستاباي
            </button>
          </div>
        </div>
      )}

      {/* 7. صفحة مصغرة: سجل العملاء والآجل */}
      {activeModal === "customers" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="customers" className="w-4 h-4" />
                سجل العملاء والآجل (الشكك)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {customersList.map(c => (
                <div key={c.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-slate-500 font-mono text-[10px]">{c.phone}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-rose-600 font-mono font-bold block">{c.debt} ج.م</span>
                    <button
                      onClick={() => showToast(`تم تسجيل تسديد ديون العميل ${c.name}`)}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      تسديد دفعة
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const name = prompt("اسم العميل الجديد:");
                const phone = prompt("رقم التليفون:");
                if (name) {
                  const nu = { id: Date.now(), name, phone: phone || "-", debt: 0 };
                  setCustomersList([...customersList, nu]);
                  showToast("تمت إضافة العميل بنجاح!");
                }
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm"
            >
              + إضافة عميل جديد
            </button>
          </div>
        </div>
      )}

      {/* 8. صفحة مصغرة: الحضور والانصراف */}
      {activeModal === "attendance" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="attendance" className="w-4 h-4" />
                دفتر الحضور والانصراف
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {attendanceList.map(a => (
                <div key={a.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-slate-800">{a.name}</span>
                  <span className="text-emerald-700 font-mono font-bold">{a.time} - {a.status}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const item = { id: Date.now(), name: user.name, time: new Date().toLocaleTimeString("ar-EG"), status: "حاضر" };
                setAttendanceList([...attendanceList, item]);
                showToast("تم إثبات حضورك اليوم بنجاح!");
                setActiveModal(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm"
            >
              تسجيل حضور الوردية الآن
            </button>
          </div>
        </div>
      )}

      {/* 9. صفحة مصغرة: التقارير والأرباح */}
      {activeModal === "reports" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="reports" className="w-4 h-4" />
                تقرير المبيعات والأرباح اليومية
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between border border-slate-200">
                <span className="text-slate-600">إجمالي المبيعات المحققة:</span>
                <span className="font-bold text-slate-900 font-mono">{(liquidCash + 3850).toLocaleString()} ج.م</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl flex justify-between border border-emerald-200">
                <span className="text-emerald-800 font-medium">صافي الأرباح التقديرية:</span>
                <span className="font-bold text-emerald-700 font-mono">1,820 ج.م</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between border border-slate-200">
                <span className="text-slate-600">المصروفات والسحوبات:</span>
                <span className="font-bold text-rose-600 font-mono">{withdrawsTotal.toLocaleString()} ج.م</span>
              </div>
            </div>

            <button onClick={() => { showToast("جاري طباعة تقرير الإيرادات..."); setActiveModal(null); }} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm">
              طباعة تقرير الإيرادات
            </button>
          </div>
        </div>
      )}

      {/* 10. صفحة مصغرة: المستخدمون والصلاحيات */}
      {activeModal === "users" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                <Icon name="users" className="w-4 h-4" />
                إدارة المستخدمين والكاشير
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {usersList.map(u => (
                <div key={u.id} className="bg-slate-50 p-3 rounded-xl flex justify-between items-center border border-slate-200">
                  <div>
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-slate-400 font-mono text-[10px]">@{u.username}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">{u.role}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const name = prompt("اسم الموظف الجديد:");
                const u = prompt("اسم المستخدم (Username):");
                if (name && u) {
                  setUsersList([...usersList, { id: Date.now(), name, username: u, role: "كاشير" }]);
                  showToast("تم إنشاء حساب الموظف بنجاح! كلمة السر الافتراضية: 1234");
                }
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm"
            >
              + إضافة مستخدم جديد
            </button>
          </div>
        </div>
      )}

      {/* 11. صفحة مصغرة: الإعدادات والطابعات */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-5 text-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800">
                <Icon name="settings" className="w-4 h-4 text-emerald-600" />
                إعدادات النظام والطابعات
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">اسم المنشأة في الفاتورة</label>
                <input type="text" defaultValue="الرسالة للإلكترونيات ونقاط البيع" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">رقم الهاتف أسفل الفاتورة</label>
                <input type="text" defaultValue="01012345678" className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">طابعة الإيصالات الحرارية (Receipt Printer)</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800">
                  <option>طابعة USB حرارية 80 مم (الافتراضية)</option>
                  <option>طابعة شبكية عبر الشبكة IP: 192.168.1.200</option>
                </select>
              </div>
            </div>

            <button onClick={() => { showToast("تم حفظ الإعدادات بنجاح!"); setActiveModal(null); }} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white text-xs shadow-sm">
              حفظ التعديلات
            </button>
          </div>
        </div>
      )}

      {/* 12. صفحة مصغرة: شراء جهاز من عميل */}
      {activeModal === "buy_device" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-800 space-y-3.5 shadow-2xl">
            <h3 className="font-bold text-sm text-emerald-800">شراء جهاز مستعمل من عميل</h3>
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="اسم العميل ورقم هاتفه..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              <input type="text" placeholder="نوع وموديل الجهاز..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              <input type="text" placeholder="سيريال / IMEI الجهاز..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
              <input id="buy_dev_price" type="number" placeholder="سعر الشراء المتفق عليه (ج.م)..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  const p = Number(document.getElementById("buy_dev_price").value) || 0;
                  if (p > 0 && p <= liquidCash) {
                    setLiquidCash(prev => prev - p);
                    setWithdrawsTotal(prev => prev + p);
                  }
                  showToast("تم تسجيل شراء الجهاز وإصدار فاتورة الشراء بنجاح!");
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl text-white shadow-sm"
              >
                تأكيد الشراء وصرف المبلغ
              </button>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 13. صفحة مصغرة: استبدال جهاز */}
      {activeModal === "exchange" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-800 space-y-3.5 shadow-2xl">
            <h3 className="font-bold text-sm text-emerald-800">استبدال جهاز أو قطعة غيار</h3>
            <div className="space-y-2 text-xs">
              <input type="text" placeholder="الجهاز القديم المستلم..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              <input type="text" placeholder="الجهاز الجديد المسلم للعميل..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800" />
              <input type="number" placeholder="فارق السعر المستحق (ج.م)..." className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { showToast("تم قيد حركة الاستبدال بنجاح!"); setActiveModal(null); }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl text-white shadow-sm">
                تأكيد الاستبدال
              </button>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* 14. صفحة مصغرة: تقفيل الشفت بالخطوات والمطابقة */}
      {activeModal === "shift_close" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                  <Icon name="lock" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">تقفيل الشفت - ملخص ما سيتسجل في الخزينة</h3>
                  <p className="text-[11px] text-slate-500">وردية ({user.name})</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg p-1">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-200">
                <span className="text-slate-700 font-medium">كاش سائل - افتراضي (الدرج)</span>
                <span className="font-mono font-bold text-emerald-700">{liquidCash.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-200">
                <span className="text-slate-700 font-medium">محفظة إلكترونية (فودافون كاش)</span>
                <span className="font-mono font-bold text-teal-700">{walletsTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-xl flex justify-between items-center border border-slate-200">
                <span className="text-slate-700 font-medium">حساب بنكي (إنستاباي)</span>
                <span className="font-mono font-bold text-emerald-700">{bankTotal.toLocaleString()} ج.م</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-300 p-2.5 sm:p-3 rounded-xl flex justify-between items-center font-bold text-xs sm:text-sm">
                <span className="text-emerald-900 font-black">إجمالي ما سيتسجل في الخزينة:</span>
                <span className="font-mono text-emerald-800 text-base">{currentTotalInDrawer.toLocaleString()} ج.م</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <span className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                  <span>مطابقة الكاش السائل</span>
                </div>
                <input
                  type="number"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  placeholder="عد الكاش واكتب الرقم هنا..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span className="w-4 h-4 bg-slate-300 text-slate-800 rounded-full flex items-center justify-center text-[10px]">2</span>
                  <span>ملاحظات تقفيل الشفت (اختياري)</span>
                </div>
                <input
                  type="text"
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  placeholder="أي ملاحظات عن الوردية..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => showToast("جاري طباعة التقرير الحراري للشفت...")}
                className="flex-1 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>طباعة التقرير</span>
              </button>

              <button
                onClick={() => {
                  setLiquidCash(0);
                  localStorage.setItem("db_liquid", "0");
                  showToast("تم تقفيل الشفت بنجاح وترحيل الرصيد وبدء شفت جديد!");
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                تأكيد وبدء شفت جديد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          شريط التنقل السفلي السريع (Thumb Navigation) باللون الأبيض والأخضر
         ======================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-500 z-40 shadow-lg">
        <button
          onClick={() => setCurrentTab("cash_drawer")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "cash_drawer" ? "text-emerald-700 font-bold bg-emerald-50" : "hover:text-slate-800"
          }`}
        >
          <Icon name="drawer" className="w-4 h-4" />
          <span>درج الكاش</span>
        </button>

        <button
          onClick={() => setCurrentTab("pos")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "pos" ? "text-emerald-700 font-bold bg-emerald-50" : "hover:text-slate-800"
          }`}
        >
          <Icon name="pos" className="w-4 h-4" />
          <span>نقطة البيع</span>
        </button>

        <button
          onClick={() => setCurrentTab("audit")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
            currentTab === "audit" ? "text-emerald-700 font-bold bg-emerald-50" : "hover:text-slate-800"
          }`}
        >
          <Icon name="audit" className="w-4 h-4" />
          <span>الجرد</span>
        </button>

        <button
          onClick={() => setActiveModal("repairs")}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl hover:text-slate-800 transition"
        >
          <Icon name="repairs" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-emerald-700 font-bold hover:text-emerald-900 transition"
        >
          <Icon name="menu" className="w-4 h-4" />
          <span>كل الأقسام</span>
        </button>
      </footer>
    </div>
  );
}
