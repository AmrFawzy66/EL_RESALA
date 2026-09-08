#!/bin/bash
set -e

echo "🔍 جاري فحص ملفات مجلد frontend وتحديثه..."

# 1. الدخول لمجلد الواجهة الذي يقرأ منه Vercel
cd frontend

# 2. فحص نوع المشروع وإعداد نسخة متوافقة
if [ -f "src/App.jsx" ] || [ -f "src/App.tsx" ]; then
  echo "⚡ تم اكتشاف مشروع React/Vite - جاري تجهيز الـ App المباشر..."
fi

# 3. وضع كود الواجهة الكامل مباشرة داخل index.html في frontend
cat << 'HTML' > index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EL-RESALA ERP & POS V4.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brandDark: '#0b111e',
            panelDark: '#121a29',
            cardDark: '#182438',
            borderDark: '#22344f',
            accentGreen: '#10b981',
            accentOrange: '#f59e0b',
            accentCyan: '#06b6d4',
            accentBlue: '#3b82f6',
            accentRed: '#ef4444'
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    body { font-family: 'Cairo', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #0b111e; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #22344f; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
  </style>
</head>
<body class="bg-brandDark text-slate-100 h-screen w-screen overflow-hidden flex flex-col select-none">

  <!-- الشريط العلوي -->
  <header class="bg-panelDark border-b border-borderDark px-4 py-2 flex items-center justify-between z-30 shadow-md">
    <div class="flex items-center gap-2">
      <div class="bg-gradient-to-r from-accentCyan to-accentBlue text-white font-black px-3 py-1 rounded-xl text-sm tracking-wider flex items-center gap-1.5 ml-2 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
        <i data-lucide="zap" class="w-4 h-4 text-white"></i> EL-RESALA
      </div>
      <button onclick="openModal('modal-device')" class="bg-cardDark hover:bg-borderDark text-xs px-3 py-1.5 rounded-lg border border-borderDark flex items-center gap-1.5 font-bold transition">
        <i data-lucide="smartphone" class="w-4 h-4 text-accentCyan"></i> شراء جهاز
      </button>
      <button onclick="openModal('modal-exchange')" class="bg-cardDark hover:bg-borderDark text-xs px-3 py-1.5 rounded-lg border border-borderDark flex items-center gap-1.5 font-bold transition">
        <i data-lucide="repeat" class="w-4 h-4 text-accentCyan"></i> استبدال
      </button>
      <button onclick="openModal('modal-refund')" class="bg-cardDark hover:bg-borderDark text-xs px-3 py-1.5 rounded-lg border border-borderDark flex items-center gap-1.5 font-bold transition">
        <i data-lucide="rotate-ccw" class="w-4 h-4 text-accentOrange"></i> مرتجع
      </button>
      <button onclick="openModal('modal-repair-job')" class="bg-cardDark hover:bg-borderDark text-xs px-3 py-1.5 rounded-lg border border-borderDark flex items-center gap-1.5 font-bold transition">
        <i data-lucide="wrench" class="w-4 h-4 text-accentCyan"></i> استلام من عميل
      </button>
      <div class="h-5 w-[1px] bg-borderDark mx-1"></div>
      <div class="relative">
        <input type="text" placeholder="بحث شامل (Ctrl+K)..." class="bg-brandDark border border-borderDark rounded-lg px-3 py-1.5 text-xs w-52 focus:outline-none focus:border-accentCyan text-slate-200">
        <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2"></i>
      </div>
    </div>

    <!-- الرصيد والشفت (مطابق للصور) -->
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-400 font-bold flex items-center gap-1">
        <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i>
        <span>الأحد 6 سبتمبر 2026</span>
      </span>

      <div class="bg-cardDark border border-borderDark rounded-xl px-3 py-1 flex items-center gap-3">
        <div class="text-right">
          <div class="text-[10px] text-slate-400 font-bold">الرصيد الحالي</div>
          <div class="text-sm font-black text-accentGreen" id="topDrawerBalance">1,000.00 ج.م</div>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="openModal('modal-cash-drawer')" class="bg-accentGreen/15 hover:bg-accentGreen/25 text-accentGreen border border-accentGreen/30 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition">
            <i data-lucide="wallet" class="w-3.5 h-3.5"></i> درج الكاش (admin)
          </button>
          <button onclick="openModal('modal-close-shift')" class="bg-accentOrange/15 hover:bg-accentOrange/25 text-accentOrange border border-accentOrange/30 text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i> تقفيل الشفت
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- مساحة البيع والسلة -->
  <main class="flex-1 flex overflow-hidden p-3 gap-3">
    <!-- السلة (390px) -->
    <div class="w-[390px] bg-panelDark border border-borderDark rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div class="bg-cardDark/80 p-3 border-b border-borderDark flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-accentCyan/10 rounded-xl text-accentCyan"><i data-lucide="shopping-cart" class="w-5 h-5"></i></div>
          <div>
            <h2 class="font-bold text-sm">نقطة البيع الفورية</h2>
            <p class="text-[11px] text-slate-400">فاتورة رقم: #1092</p>
          </div>
        </div>
        <button onclick="clearCart()" class="text-xs text-rose-400 hover:text-rose-300 font-bold p-1">إفراغ</button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar" id="cartItemsList"></div>

      <div class="bg-cardDark/95 p-3 border-t border-borderDark space-y-2">
        <div class="flex justify-between text-xs text-slate-400">
          <span>المجموع الفرعي:</span>
          <span class="text-slate-200 font-bold" id="cartSubtotal">850.00 ج.م</span>
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-borderDark/60">
          <span class="font-bold text-sm">الإجمالي الصافي:</span>
          <span class="text-lg font-black text-accentGreen" id="cartGrandTotal">850.00 ج.م</span>
        </div>
        <button onclick="openModal('modal-checkout')" class="w-full bg-accentGreen hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition text-sm">
          <i data-lucide="check-circle" class="w-4 h-4"></i> إتمام البيع (F10)
        </button>
      </div>
    </div>

    <!-- قائمة الأصناف -->
    <div class="flex-1 bg-panelDark border border-borderDark rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div class="p-3 border-b border-borderDark flex items-center justify-between bg-cardDark/50">
        <div class="flex items-center gap-2">
          <button class="bg-accentCyan text-slate-900 font-black text-xs px-3.5 py-1.5 rounded-xl shadow">الكل</button>
          <button class="bg-cardDark text-slate-300 text-xs px-3 py-1.5 rounded-xl">هواتف محمولة</button>
          <button class="bg-cardDark text-slate-300 text-xs px-3 py-1.5 rounded-xl">قطع غيار</button>
          <button class="bg-cardDark text-slate-300 text-xs px-3 py-1.5 rounded-xl">إكسسوارات</button>
        </div>
      </div>
      <div class="flex-1 p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar" id="productsGrid"></div>
    </div>
  </main>

  <!-- شريط الملاحة السفلي -->
  <footer class="bg-panelDark border-t border-borderDark px-2 py-1 flex items-center justify-around z-30 text-[11px] font-bold">
    <button onclick="closeAllModals()" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan"><i data-lucide="home" class="w-4 h-4"></i><span>الرئيسية</span></button>
    <button onclick="closeAllModals()" class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl bg-accentCyan/20 text-accentCyan border border-accentCyan/30"><i data-lucide="shopping-cart" class="w-4 h-4"></i><span class="font-black">نقطة البيع</span></button>
    <button onclick="openModal('modal-repair-job')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan"><i data-lucide="wrench" class="w-4 h-4"></i><span>الصيانة</span></button>
    <button onclick="openModal('modal-cash-drawer')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan"><i data-lucide="credit-card" class="w-4 h-4"></i><span>الحسابات</span></button>
    <button onclick="openModal('modal-settings')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan"><i data-lucide="settings" class="w-4 h-4"></i><span>الإعدادات</span></button>
  </footer>

  <!-- Modal إتمام البيع -->
  <div id="modal-checkout" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#182335] border border-borderDark rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
      <div class="bg-cardDark px-4 py-2.5 border-b border-borderDark flex items-center justify-between">
        <h2 class="text-sm font-bold flex items-center gap-1.5"><i data-lucide="shopping-cart" class="w-4 h-4 text-accentCyan"></i> إتمام البيع - EL-RESALA</h2>
        <button onclick="closeModal('modal-checkout')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-5 gap-1.5">
          <button class="bg-accentCyan text-slate-900 font-black p-2 rounded-xl text-xs">كاش سائل</button>
          <button class="bg-cardDark text-slate-300 p-2 rounded-xl text-xs border border-borderDark">محفظة</button>
          <button class="bg-cardDark text-slate-300 p-2 rounded-xl text-xs border border-borderDark">حساب بنكي</button>
          <button class="bg-cardDark text-slate-300 p-2 rounded-xl text-xs border border-borderDark">آجل</button>
          <button class="bg-cardDark text-slate-300 p-2 rounded-xl text-xs border border-borderDark">تقسيم</button>
        </div>
        <select class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200">
          <option>كاش سائل - افتراضي (الخزينة)</option>
          <option>محمد مصطفي (Vodafone Cash)</option>
          <option>حساب بنكي (InstaPay)</option>
        </select>
        <button onclick="alert('✅ تم حفظ الفاتورة بنجاح في EL-RESALA'); closeModal('modal-checkout');" class="w-full bg-accentGreen hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs">تأكيد البيع وحفظ الفاتورة</button>
      </div>
    </div>
  </div>

  <!-- Modal درج الكاش -->
  <div id="modal-cash-drawer" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#121b2b] border border-borderDark rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-4 space-y-3">
      <div class="flex justify-between items-center border-b border-borderDark pb-2">
        <h2 class="font-black text-sm text-slate-100">درج الكاش والمحافظ (admin)</h2>
        <button onclick="closeModal('modal-cash-drawer')"><i data-lucide="x" class="w-5 h-5 text-slate-400"></i></button>
      </div>
      <div class="p-3 bg-brandDark rounded-xl flex justify-between items-center text-xs">
        <span class="text-accentCyan font-bold">محفظة محمد مصطفي (Vodafone Cash)</span>
        <span class="font-black text-accentGreen">1,000.00 ج.م</span>
      </div>
    </div>
  </div>

  <!-- Modal الصيانة واستلام جهاز -->
  <div id="modal-repair-job" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#141e2e] border border-borderDark rounded-2xl w-full max-w-lg shadow-2xl p-4 space-y-3">
      <div class="flex justify-between items-center border-b border-borderDark pb-2">
        <h2 class="text-sm font-black text-accentCyan">كارت استلام صيانة (EL-RESALA)</h2>
        <button onclick="closeModal('modal-repair-job')"><i data-lucide="x" class="w-5 h-5 text-slate-400"></i></button>
      </div>
      <input type="text" placeholder="اسم العميل" class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs">
      <input type="text" placeholder="موديل الجهاز والـ IMEI" class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs">
      <button onclick="alert('🛠️ تم تسجيل كارت الصيانة بنجاح'); closeModal('modal-repair-job');" class="w-full bg-accentCyan font-black py-2 rounded-xl text-xs text-slate-900">حفظ الكارت</button>
    </div>
  </div>

  <script>
    lucide.createIcons();
    function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); lucide.createIcons(); }
    function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }
    function closeAllModals() { document.querySelectorAll('[id^="modal-"]').forEach(m => m.classList.add('hidden')); }
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });

    const products = [
      { id: '1', name: 'شاشة a12 أصلية', price: 850, type: 'قطع غيار' },
      { id: '2', name: 'iPhone 13 128GB', price: 26500, type: 'موبايل' },
      { id: '3', name: 'جراب حماية MagSafe', price: 250, type: 'إكسسوار' },
      { id: '4', name: 'اسكرينة 11D سيراميك', price: 65, type: 'اسكرينة' }
    ];

    let cart = [{ id: '1', name: 'شاشة a12 أصلية', price: 850, qty: 1 }];

    function renderProducts() {
      const grid = document.getElementById('productsGrid');
      grid.innerHTML = '';
      products.forEach(p => {
        grid.innerHTML += `
          <div onclick="addToCart('${p.id}')" class="bg-cardDark hover:border-accentCyan border border-borderDark p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition">
            <div>
              <span class="text-[10px] bg-accentCyan/15 text-accentCyan px-2 py-0.5 rounded font-bold">${p.type}</span>
              <h3 class="font-bold text-sm mt-2">${p.name}</h3>
            </div>
            <div class="mt-3 flex justify-between items-center border-t border-borderDark/40 pt-2">
              <span class="text-xs font-black text-accentGreen">${p.price.toLocaleString()} ج.م</span>
              <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400"></i>
            </div>
          </div>`;
      });
      lucide.createIcons();
    }

    function addToCart(id) {
      const p = products.find(x => x.id === id);
      if (p) { cart.push({ ...p, qty: 1 }); renderCart(); }
    }

    function renderCart() {
      const list = document.getElementById('cartItemsList');
      list.innerHTML = '';
      let total = 0;
      cart.forEach((item, i) => {
        total += item.price * item.qty;
        list.innerHTML += `
          <div class="bg-cardDark p-2.5 rounded-xl border border-borderDark flex justify-between items-center">
            <div><div class="font-bold text-xs">${item.name}</div><div class="text-[11px] text-slate-400">${item.price} ج.م × ${item.qty}</div></div>
            <div class="flex items-center gap-2"><span class="font-bold text-accentGreen text-xs">${item.price * item.qty} ج.م</span><button onclick="cart.splice(${i},1);renderCart();" class="text-rose-400 text-xs font-bold">×</button></div>
          </div>`;
      });
      document.getElementById('cartSubtotal').innerText = total + ' ج.م';
      document.getElementById('cartGrandTotal').innerText = total + ' ج.م';
    }
    function clearCart() { cart = []; renderCart(); }

    renderProducts();
    renderCart();
  </script>
</body>
</html>
HTML

# 4. رفع التعديلات من المسار الرئيسي
cd ..
git add frontend/
git commit -m "fix(frontend): update frontend entry point for Vercel deployment"
git push origin main

echo "=========================================================="
echo "🚀 تم رفع التعديلات بنجاح لمجلد frontend الخاص بـ Vercel!"
echo "افتح Vercel الآن وستجد الـ Deployment الجديد تم تفعيله."
echo "=========================================================="
