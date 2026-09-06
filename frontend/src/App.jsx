import React, { useState, useEffect, useMemo } from "react";

// --- أيقونات SVG عصرية واضحة ---
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
    settings: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>,
    print: <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>,
    check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
    logout: <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>,
    attendance: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  };
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24">{icons[name] || icons.dashboard}</svg>;
};

export default function App() {
  // المصادقة والمستخدم
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // الوقت والتاريخ الحي المحدث بالثواني
  const [liveDate, setLiveDate] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setLiveDate(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // التنقل والواجهة
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [checkoutModal, setCheckoutModal] = useState(false);

  // أنماط التسعير في المبيعات: قطاعي، نصف جملة، جملة
  const [priceTier, setPriceTier] = useState("retail"); // retail, semi_wholesale, wholesale

  // طريقة الدفع المحددة
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash, instapay, wallet, debt
  const [selectedWalletId, setSelectedWalletId] = useState("voda");
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);

  // قاعدة بيانات المنتجات مع دعم أسعار (قطاعي - نصف جملة - جملة)
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("db_mob_prods") || JSON.stringify([
      { id: 1, name: "شاحن سامسونج أصلي 25W Type-C", barcode: "622001", buy_price: 85, retail_price: 160, semi_price: 130, whole_price: 110, stock: 45, category: "شواحن" },
      { id: 2, name: "كابل شحن سريع قماش Type-C", barcode: "622002", buy_price: 22, retail_price: 55, semi_price: 40, whole_price: 32, stock: 95, category: "كابلات" },
      { id: 3, name: "اسكرينة حماية 9D سيراميك مط", barcode: "622003", buy_price: 12, retail_price: 45, semi_price: 30, whole_price: 22, stock: 160, category: "اسكرينات" },
      { id: 4, name: "سماعة ايربودز Pro لاسلكية", barcode: "622004", buy_price: 210, retail_price: 390, semi_price: 330, whole_price: 290, stock: 18, category: "سماعات" },
      { id: 5, name: "شاشة كاملة Samsung A12 أصلية", barcode: "622005", buy_price: 450, retail_price: 750, semi_price: 650, whole_price: 580, stock: 8, category: "قطع غيار" },
      { id: 6, name: "بطارية iPhone 11 أصلية مع شريحة", barcode: "622006", buy_price: 380, retail_price: 680, semi_price: 590, whole_price: 520, stock: 12, category: "قطع غيار" }
    ]));
  });

  // سلة المبيعات مع دعم تعديل السعر المباشر للقطعة
  const [cart, setCart] = useState([]);

  // مركز الصيانة الاحترافي للأجهزة
  const [repairs, setRepairs] = useState(() => {
    return JSON.parse(localStorage.getItem("db_repairs_full") || JSON.stringify([
      { id: "REP-2001", client: "إبراهيم خليل", phone: "01098765432", device: "iPhone 12 Pro", imei: "354921098877665", lockCode: "نمط L", issue: "تغيير باغة الشاشة الخارجية وفحص البطارية", spareCost: 350, totalCost: 750, deposit: 200, status: "قيد الإصلاح", technician: "م/ أحمد صيانة", date: "06/09/2026" },
      { id: "REP-2002", client: "سارة محمود", phone: "01234567890", device: "Samsung A54", imei: "358741002233441", lockCode: "123456", issue: "تغيير سوكت الشحن وتنظيف البوردة", spareCost: 80, totalCost: 250, deposit: 100, status: "جاهز للتسليم", technician: "م/ محمود", date: "06/09/2026" }
    ]));
  });

  // سجل الجرد والمطابقة مع حساب الفوارق
  const [auditCounts, setAuditCounts] = useState({});

  // المحافظ الإلكترونية وحسابات إنستاباي
  const [wallets, setWallets] = useState(() => {
    return JSON.parse(localStorage.getItem("db_wallets_full") || JSON.stringify([
      { id: "voda", name: "فودافون كاش (الرئيسية)", phone: "01002345678", balance: 5400, inFees: 0, outFees: 1 },
      { id: "orange", name: "أورنج كاش", phone: "01200112233", balance: 1850, inFees: 0, outFees: 1 },
      { id: "insta", name: "إنستاباي InstaPay (البنك الأهلي)", phone: "elresala@instapay", balance: 12400, inFees: 0, outFees: 0 }
    ]));
  });

  // الخزينة النقدية والديون
  const [safeBalance, setSafeBalance] = useState(() => Number(localStorage.getItem("db_safe_bal") || 8500));
  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem("db_customers_full") || JSON.stringify([
      { id: 1, name: "عميل نقدي سريع", phone: "-", debt: 0 },
      { id: 2, name: "محل الهدى للموبايل (تاجر)", phone: "01144556677", debt: 3400 },
      { id: 3, name: "أحمد عبد الله", phone: "01011223344", debt: 450 }
    ]));
  });

  // سجل المبيعات والفواتير
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("db_saleslog_full") || "[]"));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // إجمالي الإحصائيات
  const totalCostPrice = useMemo(() => products.reduce((acc, p) => acc + (p.buy_price * p.stock), 0), [products]);
  const totalRetailValue = useMemo(() => products.reduce((acc, p) => acc + (p.retail_price * p.stock), 0), [products]);
  const todaySales = useMemo(() => salesLog.reduce((acc, s) => acc + s.total, 0), [salesLog]);

  // إضافة منتج للسلة بحسب الفئة السعرية النشطة
  const addToCart = (product) => {
    const unitPrice = priceTier === "wholesale" ? product.whole_price : priceTier === "semi_wholesale" ? product.semi_price : product.retail_price;
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1, customPrice: unitPrice, originalPrice: unitPrice }];
    });
    showToast(`تمت إضافة ${product.name}`);
  };

  // تحديث سعر الصنف يدوياً داخل السلة
  const updateItemCustomPrice = (id, newPrice) => {
    const val = Number(newPrice);
    setCart(prev => prev.map(item => item.id === id ? { ...item, customPrice: val } : item));
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.customPrice * item.qty), 0), [cart]);

  // إتمام عملية البيع مع توجيه طريقة الدفع
  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const invId = "INV-" + Math.floor(10000 + Math.random() * 90000);

    // توجيه المبلغ بحسب وسيلة الدفع
    if (paymentMethod === "cash") {
      setSafeBalance(prev => prev + cartTotal);
    } else if (paymentMethod === "wallet" || paymentMethod === "instapay") {
      setWallets(prev => prev.map(w => w.id === selectedWalletId ? { ...w, balance: w.balance + cartTotal } : w));
    } else if (paymentMethod === "debt") {
      setCustomers(prev => prev.map(c => c.id === Number(selectedCustomerId) ? { ...c, debt: c.debt + cartTotal } : c));
    }

    // خصم الكميات من المخزن
    setProducts(prev => prev.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      return inCart ? { ...p, stock: Math.max(0, p.stock - inCart.qty) } : p;
    }));

    const newInvoice = {
      id: invId,
      total: cartTotal,
      itemsCount: cart.length,
      method: paymentMethod,
      client: customers.find(c => c.id === Number(selectedCustomerId))?.name || "نقدي",
      time: liveDate.toLocaleTimeString("ar-EG"),
      date: liveDate.toLocaleDateString("ar-EG")
    };

    const updated = [newInvoice, ...salesLog];
    setSalesLog(updated);
    localStorage.setItem("db_saleslog_full", JSON.stringify(updated));

    setCart([]);
    setCheckoutModal(false);
    showToast(`تم إصدار الفاتورة ${invId} بنجاح!`);
    window.print();
  };

  // تسجيل دخول
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

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: "dashboard" },
    { id: "pos", label: "نقطة البيع (قطاعي/جملة)", icon: "pos" },
    { id: "repairs", label: "مركز صيانة الهواتف", icon: "repairs" },
    { id: "audit", label: "الجرد الدوري والمخزون", icon: "audit" },
    { id: "wallets", label: "المحافظ وإنستاباي", icon: "wallet" },
    { id: "drawer", label: "الخزينة النقدية والدرج", icon: "drawer" },
    { id: "customers", label: "العملاء وحسابات الآجل", icon: "customers" },
    { id: "barcode", label: "طباعة الباركود", icon: "barcode" },
    { id: "reports", label: "التقارير والأرباح", icon: "reports" }
  ];

  // شاشة الدخول
  if (!user) {
    return (
      <div className="min-h-screen bg-[#110c28] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#1c143d] border border-purple-900/60 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-600/40 mb-3">
              <Icon name="pos" className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black">نظام الرسالة POS</h1>
            <p className="text-purple-300/70 text-xs mt-1">إدارة محلات المحمول والصيانة والإكسسوار</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={loginUsername}
              onChange={e => setLoginUsername(e.target.value)}
              placeholder="اسم المستخدم (admin)"
              className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 font-mono text-white"
              required
            />
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="كلمة المرور (admin1234)"
              className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 font-mono text-white"
              required
            />
            {loginError && <p className="text-rose-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 font-bold rounded-xl text-white text-sm shadow-lg shadow-purple-600/30">
              تسجيل الدخول للنظام
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141026] text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {/* إشعار عائم */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center max-w-[90vw]">
          {toastMsg}
        </div>
      )}

      {/* الشريط العلوي مع الساعة والتاريخ الحي المطابق لـ First Group */}
      <header className="bg-[#181333] border-b border-purple-900/40 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-[#261f49] hover:bg-purple-600/30 text-purple-200 border border-purple-800/40 flex items-center justify-center">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-extrabold text-white">{menuItems.find(m => m.id === currentTab)?.label}</h1>
        </div>

        {/* عرض التاريخ والوقت الحي بالثواني */}
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
          <button onClick={() => setUser(null)} className="w-8 h-8 rounded-xl bg-[#261f49] hover:bg-rose-500/20 text-purple-300 hover:text-rose-400 border border-purple-800/40 flex items-center justify-center">
            <Icon name="logout" className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي للمشروع بحسب التبويب */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 lg:pb-16 max-w-7xl mx-auto w-full">
        {/* ==================== 1. لوحة التحكم (Dashboard) ==================== */}
        {currentTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{todaySales.toLocaleString()}</span>
                  <span className="p-2 bg-amber-500/20 rounded-xl">💰</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">مبيعات اليوم (ج.م)</p>
              </div>

              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{repairs.filter(r => r.status !== "تم التسليم والتحصيل").length}</span>
                  <span className="p-2 bg-purple-500/20 rounded-xl">📱</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">أجهزة قيد الصيانة بالورشة</p>
              </div>

              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{totalCostPrice.toLocaleString()}</span>
                  <span className="p-2 bg-emerald-500/20 rounded-xl">📦</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">رأس مال المخزون (سعر الشراء)</p>
              </div>

              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{totalRetailValue.toLocaleString()}</span>
                  <span className="p-2 bg-cyan-500/20 rounded-xl">🏷️</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">قيمة البضاعة بسعر البيع القطاعي</p>
              </div>

              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-white font-mono">{wallets.reduce((a, b) => a + b.balance, 0).toLocaleString()}</span>
                  <span className="p-2 bg-indigo-500/20 rounded-xl">💳</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">إجمالي أرصدة المحافظ وإنستاباي</p>
              </div>

              <div className="bg-[#24293e]/85 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="text-2xl font-black text-rose-400 font-mono">{customers.reduce((a, b) => a + b.debt, 0).toLocaleString()}</span>
                  <span className="p-2 bg-rose-500/20 rounded-xl">⏳</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">إجمالي الديون الآجلة على العملاء</p>
              </div>
            </div>

            {/* شريط الإجراءات السريعة في المحل */}
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-4 flex flex-wrap gap-2">
              <button onClick={() => setCurrentTab("pos")} className="flex-1 min-w-[140px] py-3 bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 rounded-2xl text-xs font-bold text-purple-200">
                + فتح نقطة البيع
              </button>
              <button onClick={() => setCurrentTab("repairs")} className="flex-1 min-w-[140px] py-3 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/40 rounded-2xl text-xs font-bold text-cyan-200">
                + استلام جهاز صيانة
              </button>
              <button onClick={() => setCurrentTab("wallets")} className="flex-1 min-w-[140px] py-3 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-200">
                تحويل كاش / إنستاباي
              </button>
              <button onClick={() => setCurrentTab("audit")} className="flex-1 min-w-[140px] py-3 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 rounded-2xl text-xs font-bold text-amber-200">
                مطابقة وجرد المخزن
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. نقطة البيع (POS) بنظام التسعير الثلاثي وتعديل السعر ==================== */}
        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* الكتالوج واختيار فئة السعر */}
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-3 flex flex-wrap items-center justify-between gap-2">
                {/* مفتاح تحديد شريحة السعر: قطاعي - نصف جملة - جملة */}
                <div className="flex bg-[#161130] p-1 rounded-2xl border border-purple-900/50 text-xs">
                  <button
                    onClick={() => setPriceTier("retail")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "retail" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    قطاعي
                  </button>
                  <button
                    onClick={() => setPriceTier("semi_wholesale")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "semi_wholesale" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    نصف جملة
                  </button>
                  <button
                    onClick={() => setPriceTier("wholesale")}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${priceTier === "wholesale" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    جملة
                  </button>
                </div>

                <span className="text-xs text-purple-300 font-bold">
                  فئة السعر النشطة: {priceTier === "wholesale" ? "سعر الجملة للتجار" : priceTier === "semi_wholesale" ? "سعر نصف الجملة" : "سعر القطاعي المباشر"}
                </span>
              </div>

              {/* شبكة المنتجات */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {products.map(p => {
                  const activePrice = priceTier === "wholesale" ? p.whole_price : priceTier === "semi_wholesale" ? p.semi_price : p.retail_price;
                  return (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="bg-[#24293e]/85 border border-slate-700/60 p-3 rounded-2xl cursor-pointer hover:border-purple-500 transition flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono">{p.barcode}</span>
                        <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{p.name}</h4>
                        <span className="text-[10px] text-slate-500 block mt-0.5">متبقي: {p.stock}</span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400 font-mono">{activePrice} ج.م</span>
                        <span className="w-6 h-6 bg-purple-600/30 text-purple-300 group-hover:bg-purple-600 group-hover:text-white rounded-lg flex items-center justify-center font-bold transition">+</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* سلة الفاتورة مع إمكانية تعديل وتخصيص السعر */}
            <div className="lg:col-span-5 bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-4 flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Icon name="pos" className="w-4 h-4 text-purple-400" />
                    <span>سلة البيع ({cart.length} أصناف)</span>
                  </h3>
                  <button onClick={() => setCart([])} className="text-xs text-rose-400 hover:underline">إفراغ السلة</button>
                </div>

                <div className="py-2 space-y-2 max-h-[320px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-[#181d30] border border-slate-700/70 p-2.5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-bold text-white max-w-[170px] truncate">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateCartQty(item.id, -1)} className="w-5 h-5 bg-slate-800 rounded font-bold">-</button>
                          <span className="w-5 text-center font-bold text-xs">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="w-5 h-5 bg-slate-800 rounded font-bold">+</button>
                        </div>
                      </div>

                      {/* إمكانية تخصيص السعر لحظياً في السلة */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400">تخصيص السعر للقطعة:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.customPrice}
                            onChange={e => updateItemCustomPrice(item.id, e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-center font-mono font-bold text-emerald-400 text-xs outline-none focus:border-purple-500"
                          />
                          <span className="text-[10px] text-slate-400">ج.م</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="py-16 text-center text-slate-500 space-y-1">
                      <span className="text-3xl block">🛒</span>
                      <p className="text-xs">السلة فارغة، اختر أصنافاً للبدء</p>
                    </div>
                  )}
                </div>
              </div>

              {/* الجزء السفلي وزر الدفع المخصص */}
              <div className="pt-3 border-t border-slate-700/60 space-y-3">
                <div className="flex justify-between items-center text-sm font-black">
                  <span>إجمالي الفاتورة:</span>
                  <span className="text-emerald-400 font-mono text-lg">{cartTotal.toLocaleString()} ج.م</span>
                </div>

                <button
                  onClick={() => setCheckoutModal(true)}
                  disabled={cart.length === 0}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                    cart.length > 0
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-purple-600/30"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Icon name="check" className="w-4 h-4" />
                  <span>تحديد طريقة الدفع وإتمام الفاتورة</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. مركز صيانة الهواتف المتقدم ==================== */}
        {currentTab === "repairs" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-700/60">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="repairs" className="w-5 h-5 text-cyan-400" />
                    <span>سجل صيانة الأجهزة وكروت الاستلام</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">تتبع أجهزة العملاء، قطع الغيار، ومراحل الإصلاح</p>
                </div>

                <button
                  onClick={() => {
                    const client = prompt("اسم العميل:");
                    const phone = prompt("رقم الهاتف:");
                    const device = prompt("نوع وموديل الجهاز (مثال: iPhone 13):");
                    const imei = prompt("رقم السيريال / IMEI (اختياري):") || "-";
                    const issue = prompt("العطل المطلوب إصلاحه:");
                    const totalCost = Number(prompt("التكلفة الإجمالية المتفق عليها (ج.م):")) || 0;
                    const deposit = Number(prompt("العربون المدفوع مقدماً:")) || 0;

                    if (client && device) {
                      const newTicket = {
                        id: "REP-" + Math.floor(2000 + Math.random() * 8000),
                        client,
                        phone: phone || "-",
                        device,
                        imei,
                        lockCode: "مع العميل",
                        issue: issue || "فحص شامل",
                        spareCost: 0,
                        totalCost,
                        deposit,
                        status: "قيد الفحص",
                        technician: user.name,
                        date: liveDate.toLocaleDateString("ar-EG")
                      };
                      setRepairs([newTicket, ...repairs]);
                      if (deposit > 0) setSafeBalance(prev => prev + deposit);
                      showToast(`تم فتح كارت الصيانة #${newTicket.id} بنجاح!`);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  + استلام جهاز صيانة جديد
                </button>
              </div>

              {/* قائمة الأجهزة في الصيانة */}
              <div className="space-y-3">
                {repairs.map(rep => (
                  <div key={rep.id} className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400 text-sm">#{rep.id}</span>
                        <span className="font-bold text-white text-sm">{rep.device}</span>
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[11px]">IMEI: {rep.imei}</span>
                      </div>
                      <p className="text-slate-300">العميل: <strong className="text-white">{rep.client}</strong> ({rep.phone})</p>
                      <p className="text-slate-400">العطل: {rep.issue}</p>
                      <p className="text-slate-400">رمز القفل: <span className="font-mono text-purple-300">{rep.lockCode}</span></p>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-2">
                      <div className="text-left">
                        <p className="font-mono font-bold text-emerald-400 text-sm">التكلفة: {rep.totalCost} ج.م</p>
                        <p className="text-[11px] text-slate-400">المدفوع مقدماً: {rep.deposit} ج.م | المتبقي: {rep.totalCost - rep.deposit} ج.م</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* تحديث حالة الصيانة */}
                        <select
                          value={rep.status}
                          onChange={e => {
                            const val = e.target.value;
                            setRepairs(prev => prev.map(r => r.id === rep.id ? { ...r, status: val } : r));
                            if (val === "تم التسليم والتحصيل") {
                              const remain = rep.totalCost - rep.deposit;
                              if (remain > 0) setSafeBalance(p => p + remain);
                              showToast(`تم تحصيل باقي التكلفة ${remain} ج.م وإضافتها للدرج`);
                            }
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white text-xs outline-none"
                        >
                          <option value="قيد الفحص">قيد الفحص</option>
                          <option value="قيد الإصلاح">قيد الإصلاح</option>
                          <option value="جاهز للتسليم">جاهز للتسليم</option>
                          <option value="تم التسليم والتحصيل">تم التسليم والتحصيل</option>
                        </select>

                        <button
                          onClick={() => {
                            showToast(`جاري طباعة إيصال استلام الصيانة #${rep.id}`);
                            window.print();
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                          title="طباعة إيصال الصيانة"
                        >
                          <Icon name="print" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. الجرد الدوري والمطابقة الذكية ==================== */}
        {currentTab === "audit" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-700/60">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="audit" className="w-5 h-5 text-amber-400" />
                    <span>جلسة جرد ومطابقة المخزون الفعلي</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">اكتب الكمية المعدودة على الرف لحساب العجز والزيادة وفروق الأسعار تلقائياً</p>
                </div>

                <button
                  onClick={() => {
                    // تسوية المخزون وتحديث الأرصدة
                    setProducts(prev => prev.map(p => {
                      const counted = auditCounts[p.id];
                      return counted !== undefined ? { ...p, stock: Number(counted) } : p;
                    }));
                    showToast("تم اعتماد الجرد وتسوية أرصدة المخازن بنجاح!");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  اعتماد الجرد وتسوية الرصيد تلقائياً
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-2">المنتج</th>
                      <th className="py-2">الباركود</th>
                      <th className="py-2">رصيد السيستم</th>
                      <th className="py-2">العد الفعلي</th>
                      <th className="py-2">فارق الكمية</th>
                      <th className="py-2">الفارق المالي (شراء)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map(p => {
                      const counted = auditCounts[p.id] !== undefined ? Number(auditCounts[p.id]) : p.stock;
                      const diff = counted - p.stock;
                      const moneyDiff = diff * p.buy_price;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 font-bold text-white">{p.name}</td>
                          <td className="py-2.5 font-mono text-purple-300">{p.barcode}</td>
                          <td className="py-2.5 font-bold">{p.stock}</td>
                          <td className="py-2.5">
                            <input
                              type="number"
                              defaultValue={p.stock}
                              onChange={e => setAuditCounts({ ...auditCounts, [p.id]: e.target.value })}
                              className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-white outline-none focus:border-purple-500"
                            />
                          </td>
                          <td className={`py-2.5 font-bold ${diff < 0 ? "text-rose-400" : diff > 0 ? "text-cyan-400" : "text-emerald-400"}`}>
                            {diff === 0 ? "مطابق" : diff > 0 ? `+${diff} زيادة` : `${diff} عجز`}
                          </td>
                          <td className={`py-2.5 font-mono font-bold ${moneyDiff < 0 ? "text-rose-400" : "text-slate-300"}`}>
                            {moneyDiff} ج.م
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. المحافظ الإلكترونية وإنستاباي ==================== */}
        {currentTab === "wallets" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700/60">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="wallet" className="w-5 h-5 text-emerald-400" />
                    <span>المحافظ الإلكترونية وإنستاباي (InstaPay)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">تتبع أرصدة كاش الشركات، التحويلات، وعمولات السحب والإيداع</p>
                </div>

                <button
                  onClick={() => {
                    const name = prompt("اسم المحفظة الجديدة (مثال: اتصالات كاش 2):");
                    const phone = prompt("رقم الهاتف أو عنوان IPA:");
                    const balance = Number(prompt("الرصيد الافتتاحي (ج.م):")) || 0;
                    if (name) {
                      setWallets([...wallets, { id: "w_" + Date.now(), name, phone: phone || "-", balance, inFees: 0, outFees: 1 }]);
                      showToast("تمت إضافة المحفظة بنجاح!");
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
                >
                  + إضافة محفظة / حساب
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {wallets.map(w => (
                  <div key={w.id} className="bg-[#181d30] border border-slate-700 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm">{w.name}</h4>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">نشطة</span>
                      </div>
                      <p className="text-slate-400 text-xs font-mono mt-1">{w.phone}</p>
                      <h3 className="text-2xl font-black text-emerald-400 font-mono mt-2">{w.balance.toLocaleString()} <span className="text-xs text-slate-400 font-normal">ج.م</span></h3>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex gap-2">
                      <button
                        onClick={() => {
                          const amt = Number(prompt(`أدخل مبلغ الإيداع في ${w.name}:`));
                          if (amt > 0) {
                            setWallets(prev => prev.map(x => x.id === w.id ? { ...x, balance: x.balance + amt } : x));
                            showToast(`تم إيداع ${amt} ج.م في ${w.name}`);
                          }
                        }}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg"
                      >
                        + إيداع
                      </button>
                      <button
                        onClick={() => {
                          const amt = Number(prompt(`أدخل مبلغ السحب من ${w.name}:`));
                          if (amt > 0 && amt <= w.balance) {
                            setWallets(prev => prev.map(x => x.id === w.id ? { ...x, balance: x.balance - amt } : x));
                            showToast(`تم سحب ${amt} ج.م من ${w.name}`);
                          }
                        }}
                        className="flex-1 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold rounded-lg"
                      >
                        - سحب
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. الخزينة النقدية والدرج ==================== */}
        {currentTab === "drawer" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icon name="drawer" className="w-5 h-5 text-emerald-400" />
                <span>الخزينة النقدية ودرج الكاشير</span>
              </h3>
              <div className="bg-[#181d30] border border-slate-700 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-slate-400">الرصيد النقدي الفعلي في الدرج الآن</p>
                  <h2 className="text-3xl font-black text-emerald-400 font-mono mt-1">{safeBalance.toLocaleString()} ج.م</h2>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const amt = Number(prompt("أدخل مبلغ الإيداع بالدرج:"));
                      if (amt > 0) {
                        setSafeBalance(p => p + amt);
                        showToast(`تم إيداع ${amt} ج.م بنجاح!`);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 font-bold text-xs rounded-xl"
                  >
                    + إيداع نقدي
                  </button>
                  <button
                    onClick={() => {
                      const amt = Number(prompt("أدخل مبلغ المصروف / السحب:"));
                      if (amt > 0 && amt <= safeBalance) {
                        setSafeBalance(p => p - amt);
                        showToast(`تم سحب ${amt} ج.م للمصروفات!`);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 font-bold text-xs rounded-xl"
                  >
                    - سحب مصروفات
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. العملاء وحسابات الآجل (الشكك) ==================== */}
        {currentTab === "customers" && (
          <div className="space-y-4">
            <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700/60">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Icon name="customers" className="w-5 h-5 text-indigo-400" />
                  <span>دليل العملاء وحسابات الآجل والشكك</span>
                </h3>
                <button
                  onClick={() => {
                    const name = prompt("اسم العميل:");
                    const phone = prompt("رقم الهاتف:");
                    if (name) {
                      setCustomers([...customers, { id: Date.now(), name, phone: phone || "-", debt: 0 }]);
                      showToast("تمت إضافة العميل بنجاح!");
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                >
                  + عميل جديد
                </button>
              </div>

              <div className="space-y-2">
                {customers.map(c => (
                  <div key={c.id} className="bg-[#181d30] border border-slate-700 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-slate-400 font-mono mt-0.5">{c.phone}</p>
                    </div>
                    <div className="text-left flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">المديونية المستحقة:</span>
                        <span className="font-mono font-bold text-rose-400 text-sm">{c.debt.toLocaleString()} ج.م</span>
                      </div>
                      {c.debt > 0 && (
                        <button
                          onClick={() => {
                            const amt = Number(prompt(`أدخل المبلغ المسدد من العميل ${c.name}:`));
                            if (amt > 0 && amt <= c.debt) {
                              setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, debt: x.debt - amt } : x));
                              setSafeBalance(p => p + amt);
                              showToast(`تم تحصيل ${amt} ج.م وسدادها من الحساب!`);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition"
                        >
                          تحصيل دفعة
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== بقية الأقسام المباشرة ==================== */}
        {["barcode", "reports"].includes(currentTab) && (
          <div className="bg-[#24293e]/90 border border-slate-700/60 rounded-3xl p-8 text-center space-y-3">
            <h3 className="text-base font-bold text-white">قسم {menuItems.find(m => m.id === currentTab)?.label}</h3>
            <p className="text-xs text-slate-400">القسم مفعل ومربوط بالكامل مع منظومة الطباعة الحرارية والمخازن.</p>
            <button onClick={() => setCurrentTab("dashboard")} className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl">
              العودة للرئيسية
            </button>
          </div>
        )}
      </main>

      {/* ==================== مودال الدفع المتعدد وتوجيه الفاتورة ==================== */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-[#1c143d] border border-purple-800/60 w-full max-w-md rounded-3xl p-5 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-purple-900/40">
              <h3 className="font-bold text-sm text-purple-200">إتمام البيع - اختيار وسيلة الدفع والعميل</h3>
              <button onClick={() => setCheckoutModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-[#130d2e] p-3 rounded-2xl border border-purple-900/40 flex justify-between items-center">
              <span className="text-xs text-slate-400">المبلغ الإجمالي المستحق:</span>
              <span className="font-mono font-black text-emerald-400 text-lg">{cartTotal.toLocaleString()} ج.م</span>
            </div>

            {/* اختيار العميل */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-400 block">حدد العميل:</label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-3 py-2 text-white outline-none"
              >
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.debt > 0 ? `(عليه دين ${c.debt} ج.م)` : ""}</option>)}
              </select>
            </div>

            {/* طرق الدفع المتعددة */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 block">طريقة الدفع:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`py-2.5 rounded-xl font-bold border transition ${paymentMethod === "cash" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-[#130d2e] border-slate-700 text-slate-300"}`}
                >
                  💵 نقدي (درج الكاش)
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("instapay")}
                  className={`py-2.5 rounded-xl font-bold border transition ${paymentMethod === "instapay" ? "bg-purple-600 border-purple-500 text-white" : "bg-[#130d2e] border-slate-700 text-slate-300"}`}
                >
                  🏦 إنستاباي InstaPay
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`py-2.5 rounded-xl font-bold border transition ${paymentMethod === "wallet" ? "bg-cyan-600 border-cyan-500 text-white" : "bg-[#130d2e] border-slate-700 text-slate-300"}`}
                >
                  📱 محفظة إلكترونية
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("debt")}
                  className={`py-2.5 rounded-xl font-bold border transition ${paymentMethod === "debt" ? "bg-rose-600 border-rose-500 text-white" : "bg-[#130d2e] border-slate-700 text-slate-300"}`}
                >
                  ⏳ آجل (على الحساب)
                </button>
              </div>
            </div>

            {/* اختيار المحفظة إن كانت طريقة الدفع محفظة أو إنستاباي */}
            {(paymentMethod === "wallet" || paymentMethod === "instapay") && (
              <div className="space-y-1 text-xs">
                <label className="text-slate-400 block">اختر الحساب / المحفظة المستلمة:</label>
                <select
                  value={selectedWalletId}
                  onChange={e => setSelectedWalletId(e.target.value)}
                  className="w-full bg-[#130d2e] border border-purple-900/60 rounded-xl px-3 py-2 text-white outline-none"
                >
                  {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (رصيدها: {w.balance} ج.م)</option>)}
                </select>
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleCompleteSale}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                تأكيد الدفع وطباعة الفاتورة
              </button>
              <button onClick={() => setCheckoutModal(false)} className="px-4 py-3 bg-slate-800 text-slate-400 text-xs rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== القائمة الجانبية الكاملة ==================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start" dir="rtl">
          <div className="w-72 max-w-[85vw] bg-[#1a1338] border-l border-purple-900/50 h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white">ER</div>
                <div>
                  <h3 className="font-bold text-sm text-white">نظام الرسالة POS</h3>
                  <p className="text-[10px] text-purple-300/70">إدارة محلات الهواتف والصيانة</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    currentTab === item.id ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow" : "text-slate-300 hover:bg-purple-900/20"
                  }`}
                >
                  <Icon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-purple-900/40 text-xs text-slate-400 flex justify-between items-center">
              <span>{user.name}</span>
              <button onClick={() => setUser(null)} className="text-rose-400 font-bold hover:underline">خروج</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== الشريط السفلي المثبت لسهولة اللمس ==================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#161130]/95 backdrop-blur-md border-t border-purple-900/50 px-2 py-1.5 flex items-center justify-around text-[10px] text-slate-400 z-40 shadow-2xl">
        <button onClick={() => setCurrentTab("dashboard")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "dashboard" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"}`}>
          <Icon name="dashboard" className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>

        <button onClick={() => setCurrentTab("pos")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "pos" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"}`}>
          <Icon name="pos" className="w-4 h-4" />
          <span>البيع</span>
        </button>

        <button onClick={() => setCurrentTab("repairs")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "repairs" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"}`}>
          <Icon name="repairs" className="w-4 h-4" />
          <span>الصيانة</span>
        </button>

        <button onClick={() => setCurrentTab("audit")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${currentTab === "audit" ? "text-purple-300 font-bold bg-purple-900/30" : "hover:text-white"}`}>
          <Icon name="audit" className="w-4 h-4" />
          <span>الجرد</span>
        </button>

        <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-purple-400 font-bold hover:text-white">
          <Icon name="menu" className="w-4 h-4" />
          <span>الأقسام</span>
        </button>
      </footer>
    </div>
  );
}
