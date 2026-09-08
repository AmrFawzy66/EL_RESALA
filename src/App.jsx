import React, { useState, useEffect, useMemo } from "react";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("elos_auth_v9")); } catch { return null; }
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
  const [activePopover, setActivePopover] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [shiftModal, setShiftModal] = useState(false);

  // قواعد البيانات القابلة للتحكم (CRUD)
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("elos_p_v9") || JSON.stringify([
    { id: 1, name: "اوبو رينو 13F (مستعمل)", barcode: "700001", category: "الأجهزة", buy_price: 7500, retail_price: 8900, whole_price: 8500, stock: 5 },
    { id: 2, name: "شاحن سامسونج أصلي 25W", barcode: "622001", category: "الإكسسوارات", buy_price: 85, retail_price: 160, whole_price: 110, stock: 45 },
    { id: 3, name: "شاشة كاملة Samsung A12", barcode: "622005", category: "قطع الغيار", buy_price: 450, retail_price: 750, whole_price: 580, stock: 8 }
  ])));

  const [cart, setCart] = useState([]);
  const [repairs, setRepairs] = useState(() => JSON.parse(localStorage.getItem("elos_r_v9") || JSON.stringify([
    { id: "R-202609-000001#", client: "محمود", phone: "012130", device: "Samsung A12", issue: "الشاشة مكسورة وتحتاج تغيير", status: "تم التسليم", cost: 650, date: "2026/9/3" },
    { id: "R-202609-000002#", client: "محمد محمود", phone: "01008235456", device: "Oppo reno13F", issue: "البطارية ضعيفة وتنفذ بسرعة", status: "جاهز للتسليم", cost: 500, date: "2026/9/3" }
  ])));

  const [wallets, setWallets] = useState(() => JSON.parse(localStorage.getItem("elos_w_v9") || JSON.stringify([
    { id: "w1", name: "فودافون كاش", phone: "01002345678", balance: 5400 },
    { id: "w2", name: "إنستاباي", phone: "elresala@instapay", balance: 12400 }
  ])));

  const [safeBalance, setSafeBalance] = useState(() => Number(localStorage.getItem("elos_s_v9") || 8500));
  const [salesLog, setSalesLog] = useState(() => JSON.parse(localStorage.getItem("elos_sl_v9") || "[]"));

  useEffect(() => { localStorage.setItem("elos_p_v9", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("elos_r_v9", JSON.stringify(repairs)); }, [repairs]);
  useEffect(() => { localStorage.setItem("elos_w_v9", JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem("elos_s_v9", String(safeBalance)); }, [safeBalance]);
  useEffect(() => { localStorage.setItem("elos_sl_v9", JSON.stringify(salesLog)); }, [salesLog]);

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
    showToast("تم التصدير بنجاح!");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if ((loginUsername === "admin" && loginPassword === "admin1234") || (loginUsername === "cashier" && loginPassword === "1234")) {
      const u = { username: loginUsername, name: loginUsername === "admin" ? "مدير النظام" : "كاشير" };
      setUser(u);
      localStorage.setItem("elos_auth_v9", JSON.stringify(u));
    } else {
      setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("elos_auth_v9");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111928] flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="w-full max-w-sm bg-[#182236] border border-slate-700 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-emerald-400">First Group - ELOS</h1>
            <p className="text-slate-400 text-xs mt-1">تسجيل الدخول إجباري للوصول للنظام</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم المستخدم</label>
              <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} placeholder="admin" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">كلمة المرور</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="admin1234" className="w-full bg-[#0d131f] border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none text-white font-mono" required />
            </div>
            {loginError && <p className="text-rose-400 text-xs text-center font-bold">{loginError}</p>}
            <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white text-sm shadow-lg">تسجيل الدخول</button>
          </form>
          <div className="mt-4 pt-3 border-t border-slate-700 text-[11px] text-slate-400 text-center">
            <p>الإدارة: <strong className="text-emerald-400">admin</strong> / <strong className="text-emerald-400">admin1234</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121826] text-slate-100 flex flex-col font-sans select-none relative" dir="rtl" onClick={() => setActivePopover(null)}>
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold animate-bounce text-center">
          {toastMsg}
        </div>
      )}

      <header className="bg-[#1a2234] border-b border-slate-700/60 px-3 sm:px-4 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-black text-sm text-white">First group</span>
          <span className="text-xs text-emerald-400 font-medium hidden xs:inline">● ليلة سعيدة</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#121826] border border-slate-700 px-3 py-1 rounded-xl text-xs font-mono text-slate-200 flex items-center gap-2">
            <span>{liveDate.toLocaleTimeString("ar-EG")}</span>
            <span className="text-slate-500">|</span>
            <span>{liveDate.toLocaleDateString("ar-EG", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>

          <button onClick={() => showToast("تم إرسال نبضة لفتح درج الكاش!")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg text-xs border border-slate-700">
            فتح الدرج
          </button>
          <button onClick={() => setShiftModal(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs border border-slate-700">
            تقفيل الشفت
          </button>
          <button onClick={handleLogout} className="px-2.5 py-1.5 bg-rose-600/20 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/30">
            خروج
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 max-w-7xl mx-auto w-full">
        {currentTab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xl font-black text-emerald-400 font-mono">{salesLog.reduce((a,b)=>a+b.total,0).toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">مبيعات اليوم</p>
              </div>
              <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xl font-black text-emerald-400 font-mono">{(salesLog.reduce((a,b)=>a+b.total,0)*0.2).toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">ربح اليوم</p>
              </div>
              <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xl font-black text-white font-mono">{safeBalance.toLocaleString()} ج.م</span>
                <p className="text-xs text-slate-400 mt-2">رصيد الخزينة الرئيسية</p>
              </div>
              <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-xl font-black text-white font-mono">{repairs.length} تذكرة</span>
                <p className="text-xs text-slate-400 mt-2">أجهزة الصيانة</p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "pos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700 text-xs font-bold">
                  <span>سلة المشتريات ({cart.length})</span>
                  <button onClick={() => setCart([])} className="text-rose-400">مسح</button>
                </div>
                <div className="py-3 space-y-2 max-h-[300px] overflow-y-auto text-xs">
                  {cart.map(item => (
                    <div key={item.id} className="bg-[#121826] p-2.5 rounded-xl flex justify-between items-center">
                      <span>{item.name} ({item.qty})</span>
                      <span className="font-mono font-bold text-emerald-400">{item.retail_price * item.qty} ج.م</span>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="text-center text-slate-500 py-16 text-xs">السلة فارغة</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 space-y-3">
                <div className="flex justify-between text-sm font-black">
                  <span>إجمالي السلة:</span>
                  <span className="text-emerald-400 font-mono">{cart.reduce((a,b)=>a+(b.retail_price*b.qty),0)} ج.م</span>
                </div>
                <button onClick={() => {
                  if(cart.length === 0) return;
                  const tot = cart.reduce((a,b)=>a+(b.retail_price*b.qty),0);
                  setSafeBalance(p => p + tot);
                  setSalesLog([{ id: "INV-"+Math.floor(1000+Math.random()*9000), total: tot, itemsCount: cart.length }, ...salesLog]);
                  setCart([]);
                  showToast("تم إتمام الفاتورة بنجاح!");
                }} disabled={cart.length === 0} className="w-full py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">إتمام البيع</button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => (
                  <div key={p.id} onClick={() => {
                    setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if(ex) return prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i);
                      return [...prev, {...p, qty: 1}];
                    });
                    showToast(`أضيف ${p.name}`);
                  }} className="bg-[#1f293d] hover:border-emerald-500 border border-slate-700/60 p-4 rounded-2xl cursor-pointer flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">{p.barcode}</span>
                      <h4 className="font-bold text-xs text-white mt-1 line-clamp-2">{p.name}</h4>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-700/60 flex justify-between items-center">
                      <span className="font-black text-sm text-emerald-400 font-mono">{p.retail_price} ج.م</span>
                      <span className="w-6 h-6 bg-emerald-600/30 text-emerald-300 rounded-lg flex items-center justify-center font-bold">+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === "repairs" && (
          <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-700/60">
              <button onClick={() => {
                const client = prompt("اسم العميل:");
                const phone = prompt("رقم الهاتف:");
                const device = prompt("نوع الجهاز:");
                const issue = prompt("العطل المطلوب:");
                const cost = Number(prompt("التكلفة:")) || 0;
                if(client && device) {
                  setRepairs([{ id: "R-"+Date.now()+"#", client, phone: phone||"-", device, issue, status: "قيد الفحص", cost, date: new Date().toLocaleDateString("ar-EG") }, ...repairs]);
                  showToast("تم استلام جهاز الصيانة بنجاح!");
                }
              }} className="px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ استلام جديد</button>
              <span className="text-xs text-slate-400 font-mono">عدد التذاكر: {repairs.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-2">رقم التذكرة</th>
                    <th className="py-2">اسم العميل</th>
                    <th className="py-2">رقم الموبايل</th>
                    <th className="py-2">الجهاز</th>
                    <th className="py-2">العطل / المشكلة</th>
                    <th className="py-2">الحالة</th>
                    <th className="py-2">التكلفة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {repairs.map(r => (
                    <tr key={r.id}>
                      <td className="py-3 font-mono font-bold text-emerald-400">{r.id}</td>
                      <td className="py-3 font-bold text-white">{r.client}</td>
                      <td className="py-3 font-mono">{r.phone}</td>
                      <td className="py-3 font-bold">{r.device}</td>
                      <td className="py-3 text-slate-300">{r.issue}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${r.status==="تم التسليم"?"bg-emerald-500/20 text-emerald-400":"bg-amber-500/20 text-amber-400"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-400">{r.cost} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === "transfers" && (
          <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 space-y-4">
            <h3 className="text-base font-bold text-white">التحويلات المالية والمحافظ الإلكترونية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wallets.map(w => (
                <div key={w.id} className="bg-[#121826] border border-slate-700 p-4 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{w.name}</h4>
                    <p className="text-slate-400 font-mono mt-0.5">{w.phone}</p>
                  </div>
                  <span className="font-mono font-black text-cyan-400 text-sm">{w.balance.toLocaleString()} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === "installments" && (
          <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">إدارة الأقساط وعقود التمويل</h3>
              <button onClick={() => showToast("فتح عقد تقسيط جديد")} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ عقد جديد</button>
            </div>
            <p className="text-xs text-slate-400 text-center py-12">لا توجد أقساط مستحقة اليوم</p>
          </div>
        )}

        {currentTab === "inventory" && (
          <div className="bg-[#1f293d] border border-slate-700/60 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white">إدارة المخازن والأصناف</h3>
              <div className="flex gap-2">
                <button onClick={() => exportToCSV("inventory", products)} className="px-3 py-1.5 bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl">تصدير Excel</button>
                <button onClick={() => {
                  const name = prompt("اسم الصنف أو الجهاز:");
                  const buy = Number(prompt("سعر الشراء:")) || 0;
                  const retail = Number(prompt("سعر القطاعي:")) || 0;
                  const stock = Number(prompt("الكمية:")) || 0;
                  if(name) setProducts([...products, { id: Date.now(), name, barcode: "622"+Math.floor(100+Math.random()*900), category: "الإكسسوارات", buy_price: buy, retail_price: retail, whole_price: retail-10, stock }]);
                }} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">+ إضافة صنف</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#121826] border border-slate-700 p-4 rounded-xl">
                <p className="text-slate-400">إجمالي الكمية بالمخزن</p>
                <h3 className="text-2xl font-black text-white mt-1">{products.reduce((a,b)=>a+b.stock,0)} قطعة</h3>
              </div>
              <div className="bg-[#121826] border border-slate-700 p-4 rounded-xl">
                <p className="text-slate-400">رأس مال المخزون (شراء)</p>
                <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">{products.reduce((a,b)=>a+(b.buy_price*b.stock),0).toLocaleString()} ج.م</h3>
              </div>
            </div>
          </div>
        )}
      </main>

      {shiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#1f293d] border border-slate-700 w-full max-w-md rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-black text-base">تأكيد تقفيل الشفت</h3>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setShiftModal(false); showToast("تم تقفيل الشفت بنجاح!"); }} className="flex-1 py-3 bg-emerald-600 font-bold text-xs rounded-xl text-white">تأكيد وبدء وردية جديدة</button>
              <button onClick={() => setShiftModal(false)} className="px-4 py-3 bg-slate-800 text-slate-400 text-xs rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {activePopover === "inventory" && (
        <div className="absolute bottom-16 left-1/2 -translate-x-32 bg-[#1f293d] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs w-48 space-y-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => { setCurrentTab("inventory"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white flex items-center gap-2"><span>📦</span> المخازن والأصناف</button>
          <button onClick={() => { setCurrentTab("inventory"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white flex items-center gap-2"><span>📋</span> جرد المخزن</button>
        </div>
      )}

      {activePopover === "sales" && (
        <div className="absolute bottom-16 left-1/2 -translate-x-20 bg-[#1f293d] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs w-48 space-y-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => { setCurrentTab("pos"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white">📈 المبيعات العامة</button>
          <button onClick={() => { setCurrentTab("pos"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white">📱 مبيعات الأجهزة</button>
        </div>
      )}

      {activePopover === "management" && (
        <div className="absolute bottom-16 left-1/2 -translate-x-44 bg-[#1f293d] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 text-xs w-48 space-y-1" onClick= {e => e.stopPropagation()}>
          <button onClick={() => { setCurrentTab("dashboard"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white">👥 الموظفين</button>
          <button onClick={() => { setCurrentTab("dashboard"); setActivePopover(null); }} className="w-full text-right px-3 py-2 hover:bg-[#121826] rounded-xl font-bold text-white">⚙️ الإعدادات العامة</button>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-[#1a2234]/95 backdrop-blur-md border-t border-slate-700/60 px-1 py-1.5 flex items-center justify-around text-[10px] text-slate-300 z-40 shadow-2xl">
        <button onClick={() => setCurrentTab("dashboard")} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="dashboard"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>الرئيسية</span>
        </button>
        <button onClick={() => setCurrentTab("pos")} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="pos"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>نقطة البيع</span>
        </button>
        <button onClick={() => setCurrentTab("repairs")} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="repairs"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>الصيانة</span>
        </button>
        <button onClick={() => setCurrentTab("transfers")} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="transfers"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>التحويلات</span>
        </button>
        <button onClick={() => setCurrentTab("installments")} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="installments"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>الأقسام</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setActivePopover(activePopover==="inventory"?null:"inventory"); }} className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition ${currentTab==="inventory"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>المخزون ▾</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setActivePopover(activePopover==="sales"?null:"sales"); }} className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl transition ${currentTab==="pos"?"text-emerald-400 font-bold bg-[#121826]":""}`}>
          <span>المبيعات ▾</span>
        </button>
        <button onClick={() => setCurrentTab("dashboard")} className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl">
          <span>المشتريات</span>
        </button>
        <button onClick={() => setCurrentTab("dashboard")} className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl">
          <span>الحسابات</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setActivePopover(activePopover==="management"?null:"management"); }} className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl">
          <span>الإدارة ▾</span>
        </button>
        <button onClick={() => showToast("أدوات النظام نشطة")} className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl">
          <span>أدوات</span>
        </button>
      </footer>
    </div>
  );
}
