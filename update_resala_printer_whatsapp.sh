#!/bin/bash
set -e

echo "⚙️ جاري تحديث إعدادات الواتساب والطابعات ومنع الأخطاء نهائياً في EL-RESALA..."

cat << 'HTML' > frontend/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EL-RESALA ERP & POS V4.0 | نظام إدارة محلات المحمول</title>
  <!-- Tailwind CSS & Lucide Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Chart.js للرسوم البيانية -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- SheetJS لتصدير Excel -->
  <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
  <!-- JsBarcode للباركود -->
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Cairo', sans-serif; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="bg-[#f4f7fb] text-slate-800 min-h-screen flex overflow-x-hidden">

  <!-- ================= 1. القائمة الجانبية (SIDEBAR) ================= -->
  <aside id="sidebar" class="w-64 bg-[#0a1224] text-slate-300 flex flex-col shrink-0 min-h-screen z-50 transition-all duration-300 fixed md:static -right-64 md:right-0 shadow-2xl md:shadow-none">
    <div class="p-4 border-b border-slate-800/80 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
          <i data-lucide="smartphone" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-white font-black text-base tracking-wide flex items-center gap-1">EL-RESALA</h1>
          <p class="text-[10px] text-slate-400 font-semibold">نظام إدارة محلات المحمول</p>
        </div>
      </div>
      <button onclick="toggleSidebar()" class="md:hidden text-slate-400 hover:text-white">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- روابط التنقل -->
    <nav class="flex-1 px-3 py-4 space-y-1 text-xs font-bold overflow-y-auto custom-scroll">
      <button onclick="navigateTo('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow-md transition">
        <i data-lucide="home" class="w-4 h-4"></i><span>الرئيسية والداشبورد</span>
      </button>
      <button onclick="navigateTo('pos')" id="nav-pos" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="shopping-cart" class="w-4 h-4 text-emerald-400"></i><span>المبيعات (POS)</span>
      </button>
      <button onclick="navigateTo('debts')" id="nav-debts" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="clock" class="w-4 h-4 text-amber-400"></i><span>الديون والآجل</span>
      </button>
      <button onclick="navigateTo('inventory')" id="nav-inventory" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="boxes" class="w-4 h-4 text-cyan-400"></i><span>المخزون والجرد</span>
      </button>
      <button onclick="navigateTo('waste')" id="nav-waste" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i><span>الهالك والمرتجعات</span>
      </button>
      <button onclick="navigateTo('devices')" id="nav-devices" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="smartphone" class="w-4 h-4 text-blue-400"></i><span>الأجهزة (IMEI)</span>
      </button>
      <button onclick="navigateTo('accessories')" id="nav-accessories" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="headphones" class="w-4 h-4 text-pink-400"></i><span>الإكسسوارات</span>
      </button>
      <button onclick="navigateTo('repairs')" id="nav-repairs" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="wrench" class="w-4 h-4 text-amber-400"></i><span>قسم الصيانة</span>
      </button>
      <button onclick="navigateTo('purchases')" id="nav-purchases" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="truck" class="w-4 h-4 text-purple-400"></i><span>المشتريات والتوريد</span>
      </button>
      <button onclick="navigateTo('customers')" id="nav-customers" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="users" class="w-4 h-4 text-teal-400"></i><span>العملاء</span>
      </button>
      <button onclick="navigateTo('suppliers')" id="nav-suppliers" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="building" class="w-4 h-4 text-indigo-400"></i><span>الموردين والشركات</span>
      </button>
      <button onclick="navigateTo('treasury')" id="nav-treasury" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="wallet" class="w-4 h-4 text-emerald-400"></i><span>الخزينة والمحافظ</span>
      </button>
      <button onclick="navigateTo('reports')" id="nav-reports" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="bar-chart-3" class="w-4 h-4 text-amber-500"></i><span>التقارير المالية</span>
      </button>
      <button onclick="navigateTo('settings')" id="nav-settings" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="settings" class="w-4 h-4 text-slate-400"></i><span>الإعدادات الشاملة</span>
      </button>
    </nav>
  </aside>

  <!-- ================= 2. شريط الرأس العلوي ================= -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-[#0b1329] text-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800/80 shadow-md">
      <div class="flex items-center gap-3 flex-1 max-w-xl">
        <button onclick="toggleSidebar()" class="md:hidden text-slate-300 hover:text-white p-1">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <div class="relative w-full max-w-md hidden sm:block">
          <input type="text" placeholder="بحث شامل في النظام (هاتف، باركود، عميل)..." class="w-full bg-[#131d36] border border-slate-700/60 rounded-xl py-1.5 pr-9 pl-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-2"></i>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button onclick="openChangePasswordModal('1')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition">
          <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">تغيير الباسوورد</span>
        </button>

        <div class="flex items-center gap-2.5 border-r border-slate-800 pr-3">
          <div class="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <i data-lucide="user" class="w-4 h-4"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-extrabold text-slate-100" id="headerUserDisplayName">محمد مصطفى عماشه</div>
            <div class="text-[10px] text-slate-400 font-semibold">مدير النظام (admin)</div>
          </div>
        </div>
      </div>
    </header>

    <!-- ================= 3. المحتوى الرئيسي والشاشات ================= -->
    <main class="flex-1 p-3 md:p-6 overflow-y-auto custom-scroll">

      <!-- ================= 1. شاشة الرئيسية (DASHBOARD) ================= -->
      <section id="view-dashboard" class="page-view space-y-5">
        <div class="relative bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div class="space-y-2 text-right">
            <div class="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> EL-RESALA V4.0
            </div>
            <h2 class="text-xl md:text-3xl font-black text-slate-900 leading-tight">
              كل ما تحتاجه في مكان واحد<br>
              <span class="text-blue-600">أجهزة - إكسسوارات - صيانة</span>
            </h2>
            <p class="text-xs md:text-sm text-slate-600 font-semibold">إدارة أسهل .. مبيعات أكثر .. نمو أكبر لنشاطك التجاري</p>
          </div>
          <div class="w-48 md:w-64 h-28 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-200">
            <span class="text-xs font-black text-blue-700">نظام الرسالة المتكامل</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">عدد العملاء</div><div class="text-2xl font-black text-slate-800">356</div></div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><i data-lucide="users" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">طلبات الصيانة</div><div class="text-2xl font-black text-slate-800">18</div></div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><i data-lucide="wrench" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">المنتجات المتوفرة</div><div class="text-2xl font-black text-slate-800">1,248</div></div>
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><i data-lucide="package" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">إجمالي المبيعات اليوم</div><div class="text-2xl font-black text-emerald-600">12,450 ج.م</div></div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><i data-lucide="banknote" class="w-6 h-6"></i></div>
          </div>
        </div>

        <!-- الرسوم البيانية -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-black text-sm text-slate-800 flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4 text-blue-600"></i> مؤشر المبيعات والأرباح اليومية</h3>
                <p class="text-[11px] text-slate-400">متابعة دقيقة للإيرادات وصافي الربح</p>
              </div>
              <span class="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 font-black px-2.5 py-1 rounded-xl">+14.8% نمو</span>
            </div>
            <div class="h-64 relative">
              <canvas id="salesTrendChart"></canvas>
            </div>
          </div>

          <div class="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="font-black text-sm text-slate-800 flex items-center gap-2"><i data-lucide="pie-chart" class="w-4 h-4 text-purple-600"></i> مصادر الإيرادات</h3>
              <p class="text-[11px] text-slate-400">نسبة دخل الأجهزة، الإكسسوارات، والصيانة</p>
            </div>
            <div class="h-48 relative flex items-center justify-center">
              <canvas id="categoryRevenueChart"></canvas>
            </div>
            <div class="pt-2 border-t border-slate-100 grid grid-cols-3 text-center text-[10px] font-bold">
              <div><span class="text-blue-600 block text-xs font-black">58%</span>أجهزة</div>
              <div><span class="text-emerald-500 block text-xs font-black">27%</span>إكسسوار</div>
              <div><span class="text-amber-500 block text-xs font-black">15%</span>صيانة</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 2. شاشة المبيعات (POS) ================= -->
      <section id="view-pos" class="page-view hidden space-y-4">
        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="shopping-cart" class="w-5 h-5 text-blue-600"></i> نقطة البيع (POS) وتخصيص الأسعار</h2>
            <p class="text-xs text-slate-400">يمكنك تعديل سعر أي صنف يدوياً داخل السلة قبل إتمام الفاتورة</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div class="lg:col-span-5 bg-white rounded-2xl p-4 border shadow-sm space-y-3">
            <div class="flex justify-between items-center border-b pb-2">
              <span class="font-bold text-xs">سلة الفاتورة (#<span id="posInvNum">1098</span>)</span>
              <button onclick="clearCart()" class="text-rose-500 text-xs font-bold hover:underline">تفريغ السلة</button>
            </div>
            <div class="space-y-2 max-h-72 overflow-y-auto custom-scroll" id="posCartList"></div>
            
            <div class="border-t pt-2 space-y-1.5 text-xs">
              <div class="flex justify-between text-slate-500"><span>المجموع:</span><span id="posCartSubtotal" class="font-bold text-slate-800">0.00 ج.م</span></div>
              <div class="flex justify-between text-slate-500"><span>الخصم:</span><input type="number" id="posCartDiscount" value="0" class="w-16 border rounded text-center font-bold text-amber-600" oninput="renderCart()"></div>
              <div class="flex justify-between text-base font-black text-emerald-600 pt-1"><span>الصافي المطلوب:</span><span id="posCartTotal">0.00 ج.م</span></div>
              <button onclick="openCheckoutModal()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl mt-2 text-xs shadow-md flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i> اختيار وسيلة الدفع وإتمام الفاتورة
              </button>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white rounded-2xl p-4 border shadow-sm space-y-3">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="posProductsGrid"></div>
          </div>
        </div>
      </section>

      <!-- ================= 3. شاشة الديون والآجل ================= -->
      <section id="view-debts" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="clock" class="w-5 h-5 text-amber-500"></i> إدارة الديون والآجل ومتابعة المستحقات</h2>
            <p class="text-xs text-slate-400">سجل فواتير البيع الآجل ومتابعة سداد باقي الحسابات</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr><th class="p-3">رقم الفاتورة</th><th class="p-3">اسم العميل</th><th class="p-3">الهاتف</th><th class="p-3">إجمالي الفاتورة</th><th class="p-3">المسدد نقداً</th><th class="p-3">المتبقي (الدين)</th><th class="p-3">التاريخ</th><th class="p-3 text-center">إجراء سداد</th></tr>
            </thead>
            <tbody id="debtsTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 4. شاشة المخزون والجرد ================= -->
      <section id="view-inventory" class="page-view hidden space-y-4">
        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="boxes" class="w-5 h-5 text-cyan-600"></i> المخزون العام وجرد المحل</h2>
            <p class="text-xs text-slate-400">متابعة الكميات، رأس المال، والحد الأدنى</p>
          </div>
          <button onclick="openAddProductModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> إضافة منتج
          </button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr><th class="p-3">الصورة</th><th class="p-3">اسم الصنف</th><th class="p-3">الباركود</th><th class="p-3">الفئة</th><th class="p-3">الرصيد</th><th class="p-3">سعر التكلفة</th><th class="p-3">سعر البيع</th><th class="p-3 text-center">إجراءات</th></tr>
            </thead>
            <tbody id="inventoryTableRows" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 5. شاشة الهالك والمرتجعات ================= -->
      <section id="view-waste" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="alert-triangle" class="w-5 h-5 text-rose-500"></i> إدارة الهالك والمرتجعات</h2>
            <p class="text-xs text-slate-400">فصل هالك العميل عن عيوب صناعة الموردين ومرتجع المبيعات</p>
          </div>
          <button onclick="openModal('modal-add-waste')" class="bg-rose-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow">+ تسجيل هالك</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr><th class="p-3">نوع الهالك</th><th class="p-3">الصنف</th><th class="p-3">الكمية</th><th class="p-3">التكلفة</th><th class="p-3">السبب</th><th class="p-3">التاريخ</th></tr>
            </thead>
            <tbody id="wasteTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 6. شاشة الهواتف والـ IMEI ================= -->
      <section id="view-devices" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="smartphone" class="w-5 h-5 text-blue-600"></i> مخزن الهواتف والـ IMEI</h2>
            <p class="text-xs text-slate-400">سيريالات الأجهزة الجديدة والمستعملة وحالة الضمان</p>
          </div>
          <button onclick="openAddProductModal()" class="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">+ تسجيل هاتف</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b"><tr><th class="p-3">الموديل والجهاز</th><th class="p-3">الـ IMEI</th><th class="p-3">اللون والسعة</th><th class="p-3">سعر الشراء</th><th class="p-3">سعر البيع</th></tr></thead>
            <tbody id="devicesTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 7. شاشة الإكسسوارات ================= -->
      <section id="view-accessories" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="headphones" class="w-5 h-5 text-pink-500"></i> قسم الإكسسوارات والجرابات</h2>
          <button onclick="openAddProductModal()" class="bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">+ إضافة إكسسوار</button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="accessoriesCardsGrid"></div>
      </section>

      <!-- ================= 8. شاشة الصيانة ================= -->
      <section id="view-repairs" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="wrench" class="w-5 h-5 text-amber-500"></i> قسم الصيانة وكروت الاستلام</h2>
          <button onclick="openModal('modal-repair-job')" class="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">+ استلام صيانة</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="repairCardsGrid"></div>
      </section>

      <!-- ================= 9. شاشة المشتريات ================= -->
      <section id="view-purchases" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="truck" class="w-5 h-5 text-purple-600"></i> فواتير المشتريات والتوريد</h2>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b"><tr><th class="p-3">رقم الفاتورة</th><th class="p-3">المورد</th><th class="p-3">الأصناف</th><th class="p-3">الكمية</th><th class="p-3">الإجمالي</th><th class="p-3">طريقة الدفع</th><th class="p-3">التاريخ</th></tr></thead>
            <tbody id="purchasesTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 10. شاشة العملاء ================= -->
      <section id="view-customers" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5 text-teal-600"></i> دليل وحسابات العملاء</h2>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b"><tr><th class="p-3">اسم العميل</th><th class="p-3">الهاتف</th><th class="p-3">العنوان</th><th class="p-3">إجمالي التعاملات</th><th class="p-3">الرصيد والآجل</th></tr></thead>
            <tbody id="customersTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 11. شاشة الموردين والشركات ================= -->
      <section id="view-suppliers" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="building" class="w-5 h-5 text-indigo-600"></i> الموردين والشركات</h2>
            <p class="text-xs text-slate-400">سجل شركات الأجهزة والإكسسوار وقطع الغيار والمستحقات</p>
          </div>
          <button onclick="alert('جاري فتح نافذة إضافة مورد جديد...');" class="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow">
            + إضافة مورد جديد
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-2xl border shadow-sm">
            <span class="text-xs text-slate-400 font-bold">إجمالي الموردين</span>
            <div class="text-2xl font-black text-slate-800 mt-1">4 شركات</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm">
            <span class="text-xs text-slate-400 font-bold">إجمالي التوريدات المسجلة</span>
            <div class="text-2xl font-black text-blue-600 mt-1">565,000 ج.م</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm">
            <span class="text-xs text-slate-400 font-bold">المستحق للموردين (الآجل)</span>
            <div class="text-2xl font-black text-rose-500 mt-1">4,200 ج.م</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th class="p-3">اسم المورد / الشركة</th>
                <th class="p-3">الهاتف</th>
                <th class="p-3">التصنيف والتخصص</th>
                <th class="p-3">إجمالي التوريدات</th>
                <th class="p-3">المستحق للمورد</th>
                <th class="p-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody id="suppliersTableBody" class="divide-y font-semibold">
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-800">شركة ألفا جروب للموبايلات</td>
                <td class="p-3 font-mono text-slate-600">01099887766</td>
                <td class="p-3"><span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold">هواتف جديدة وضمان</span></td>
                <td class="p-3 font-black text-slate-900">380,000 ج.م</td>
                <td class="p-3 font-bold text-emerald-600">0.00 ج.م (خالص)</td>
                <td class="p-3 text-center"><button class="text-blue-600 font-bold hover:underline">كشف حساب</button></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-800">الصفا للإكسسوار وقطع الغيار</td>
                <td class="p-3 font-mono text-slate-600">01188776655</td>
                <td class="p-3"><span class="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-[11px] font-bold">إكسسوار وشاشات</span></td>
                <td class="p-3 font-black text-slate-900">45,000 ج.م</td>
                <td class="p-3 font-black text-rose-500">4,200 ج.م (آجل)</td>
                <td class="p-3 text-center"><button class="text-blue-600 font-bold hover:underline">سداد دفعة</button></td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-800">مستورد دبي فون (كسر زيرو)</td>
                <td class="p-3 font-mono text-slate-600">01277665544</td>
                <td class="p-3"><span class="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[11px] font-bold">آيفون وسامسونج مستعمل</span></td>
                <td class="p-3 font-black text-slate-900">95,000 ج.م</td>
                <td class="p-3 font-bold text-emerald-600">0.00 ج.م (خالص)</td>
                <td class="p-3 text-center"><button class="text-blue-600 font-bold hover:underline">كشف حساب</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ================= 12. شاشة الخزينة والمحافظ ================= -->
      <section id="view-treasury" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="wallet" class="w-5 h-5 text-emerald-600"></i> الخزينة والمحافظ الإلكترونية</h2>
          <button onclick="openModal('modal-wallet-transfer')" class="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">+ تحويل / سحب كاش</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">خزينة المحل (كاش)</span><div class="text-2xl font-black text-slate-800 mt-1">1,240.00 ج.م</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">فودافون كاش</span><div class="text-2xl font-black text-blue-600 mt-1">4,500.00 ج.م</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">أورنج / اتصالات / وي</span><div class="text-2xl font-black text-purple-600 mt-1">2,800.00 ج.م</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">انستاباي / بنك</span><div class="text-2xl font-black text-emerald-600 mt-1">8,300.00 ج.م</div></div>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm p-4 space-y-2">
          <h3 class="font-bold text-xs">سجل الحركات الأخير</h3>
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b"><tr><th class="p-2">النوع</th><th class="p-2">الحساب</th><th class="p-2">المبلغ</th><th class="p-2">العمولة</th><th class="p-2">الوقت</th></tr></thead>
            <tbody id="treasuryTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 13. شاشة التقارير ================= -->
      <section id="view-reports" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="bar-chart-3" class="w-5 h-5 text-amber-500"></i> التقارير المالية والأرباح</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">المبيعات الشهرية</span><div class="text-2xl font-black text-slate-800 mt-1">148,600 ج.م</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">أرباح الصيانة والعمولات</span><div class="text-2xl font-black text-blue-600 mt-1">14,250 ج.م</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-emerald-600 font-bold">صافي الربح الكلي</span><div class="text-2xl font-black text-emerald-600 mt-1">26,500 ج.م</div></div>
        </div>
      </section>

      <!-- ================= 14. شاشة الإعدادات الشاملة (مع التحكم الكامل في الطابعات والواتساب) ================= -->
      <section id="view-settings" class="page-view hidden space-y-4">
        <div class="bg-[#121c2e] text-slate-200 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          
          <div class="w-full md:w-72 bg-[#0c1322] border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-2 shrink-0">
            <div class="text-[10px] text-slate-400 font-black px-2 mb-1">الأساسيات</div>
            <button onclick="switchSettingTab('printers')" id="stab-printers" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs">
              <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i><span>إعدادات الطابعات والفواتير</span>
            </button>
            <button onclick="switchSettingTab('whatsapp')" id="stab-whatsapp" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i><span>إعدادات ورقم الواتساب</span>
            </button>
            <button onclick="switchSettingTab('policies')" id="stab-policies" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black flex items-center gap-2.5 text-xs shadow-md">
              <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i><span>سياسات التشغيل</span>
            </button>
            <button onclick="switchSettingTab('users')" id="stab-users" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-amber-400 hover:bg-slate-800/80 flex items-center gap-2.5 font-black text-xs">
              <i data-lucide="users" class="w-4 h-4 text-amber-400"></i><span>المستخدمين وكلمات المرور</span>
            </button>
          </div>

          <div class="flex-1 p-5 md:p-6 overflow-y-auto custom-scroll space-y-4" id="settingsPanelsContainer">
            
            <!-- 1. إعدادات الطابعات والريسيت الاحترافية (المقاسات، الانحياز، حجم الخط، إظهار وإخفاء السعر) -->
            <div id="spane-printers" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 class="text-base font-black text-amber-400 flex items-center gap-2">
                    <i data-lucide="printer" class="w-5 h-5"></i> تخصيص الطابعة والريسيت والباركود
                  </h2>
                  <p class="text-slate-400 text-[11px]">تحكم كامل في مقاس الورق، المحاذاة، الإزاحة بالمليمتر، وإظهار أو إخفاء الأسعار</p>
                </div>
                <button onclick="testPrintConfiguredReceipt()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl shadow flex items-center gap-1.5">
                  <i data-lucide="printer" class="w-4 h-4"></i> تجربة طباعة فورية
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">مقاس الورق (الرول):</label>
                  <select id="cfgPaperSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100" onchange="savePrinterOptions()">
                    <option value="80mm">حرارية 80 مم (القياسي لـ EL-RESALA)</option>
                    <option value="58mm">حرارية 58 مم (طابعات الفواتير الصغيرة)</option>
                    <option value="A4">ورق قياسي A4</option>
                  </select>
                </div>

                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">حجم خط الفاتورة:</label>
                  <select id="cfgFontSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100" onchange="savePrinterOptions()">
                    <option value="11px">صغير (11px) — موفر للورق</option>
                    <option value="13px" selected>متوسط (13px) — قياسي</option>
                    <option value="15px">كبير (15px) — عريض وواضح</option>
                    <option value="17px">ضخم (17px)</option>
                  </select>
                </div>

                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">انحياز النص والمحاذاة:</label>
                  <select id="cfgTextAlign" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100" onchange="savePrinterOptions()">
                    <option value="right">انحياز جهة اليمين (عربي قياسي)</option>
                    <option value="center">انحياز في المنتصف (سنتر)</option>
                    <option value="left">انحياز جهة اليسار</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">معايرة الإزاحة الأفقية (يمين وشمال بالـ mm):</label>
                  <input type="number" id="cfgHorizontalOffset" value="2" min="-20" max="20" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono font-bold text-slate-100" oninput="savePrinterOptions()">
                  <p class="text-[10px] text-slate-500 mt-1">لتوسيط الطباعة على بكرة الورق في حال خروج الكلام عن الحافة.</p>
                </div>

                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">مقاس استيكر الباركود لظهر الهاتف:</label>
                  <select id="cfgBarcodeStickerSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100" onchange="savePrinterOptions()">
                    <option value="38x25mm">38 × 25 مم (المقاس الأكثر شيوعاً)</option>
                    <option value="50x30mm">50 × 30 مم (كبير مع تفاصيل أكثر)</option>
                  </select>
                </div>
              </div>

              <!-- تحكم إظهار وإخفاء السعر والـ IMEI -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="bg-[#172338] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="font-bold text-slate-100">إظهار أسعار الأصناف في الفاتورة</div>
                    <div class="text-[10px] text-slate-400">إظهار أو إخفاء سعر كل قطعة وتفاصيل الحساب</div>
                  </div>
                  <input type="checkbox" id="cfgShowItemPrice" checked class="w-5 h-5 accent-emerald-400 cursor-pointer" onchange="savePrinterOptions()">
                </div>

                <div class="bg-[#172338] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="font-bold text-slate-100">إظهار رقم الـ IMEI والسيريال</div>
                    <div class="text-[10px] text-slate-400">طباعة السيريال والضمان أسفل اسم الجهاز</div>
                  </div>
                  <input type="checkbox" id="cfgShowIMEI" checked class="w-5 h-5 accent-emerald-400 cursor-pointer" onchange="savePrinterOptions()">
                </div>

                <div class="bg-[#172338] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="font-bold text-slate-100">إظهار السعر على ملصقات الباركود</div>
                    <div class="text-[10px] text-slate-400">طباعة سعر البيع على الاستيكر اللاصق</div>
                  </div>
                  <input type="checkbox" id="cfgShowBarcodePrice" checked class="w-5 h-5 accent-emerald-400 cursor-pointer" onchange="savePrinterOptions()">
                </div>

                <div class="bg-[#172338] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="font-bold text-slate-100">القص التلقائي للورق (Auto-Cut)</div>
                    <div class="text-[10px] text-slate-400">إرسال أمر قطع الورقة بعد نهاية الطباعة</div>
                  </div>
                  <input type="checkbox" id="cfgAutoCut" checked class="w-5 h-5 accent-emerald-400 cursor-pointer" onchange="savePrinterOptions()">
                </div>
              </div>
            </div>

            <!-- 2. إعدادات الواتساب مع إمكانية تحديد وتغيير الرقم بحرية -->
            <div id="spane-whatsapp" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3">
                <h2 class="text-base font-black text-emerald-400 flex items-center gap-2">
                  <i data-lucide="message-square" class="w-5 h-5"></i> إعدادات ورقم واتساب المحل (WhatsApp Gateway)
                </h2>
                <p class="text-slate-400 text-[11px]">يمكنك كتابة وتعديل أي رقم هاتف تريده هنا وسيعتمد عليه السيستم فوراً</p>
              </div>

              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div>
                  <label class="text-slate-200 font-bold block mb-1.5">رقم هاتف واتساب المحل المعتمد (يمكنك تغييره بحرية):</label>
                  <input type="text" id="cfgCustomWhatsAppNumber" placeholder="مثال: 01070900711 أو 012XXXXXXXX" class="w-full bg-[#16233b] border border-emerald-500/60 rounded-xl p-2.5 font-mono text-slate-100 font-bold text-sm focus:outline-none focus:border-emerald-400" oninput="saveWhatsAppOptions()">
                  <p class="text-[10px] text-slate-400 mt-1">هذا الرقم يطبع على الفواتير وكروت الصيانة ويستخدم في روابط التواصل المباشرة.</p>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-slate-800">
                  <label class="text-slate-200 font-bold block">قالب رسالة الفاتورة الإلكترونية عبر واتساب:</label>
                  <textarea id="cfgWhatsAppInvTpl" rows="2" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2.5 text-slate-100" oninput="saveWhatsAppOptions()">مرحباً بك أستاذ {customer}، تم إصدار فاتورتك رقم {invoice} من محل EL-RESALA بقيمة {total} ج.م. شكراً لتعاملكم معنا!</textarea>
                </div>

                <div class="space-y-1.5">
                  <label class="text-slate-200 font-bold block">قالب إشعار جهاز الصيانة جاهز:</label>
                  <textarea id="cfgWhatsAppReadyTpl" rows="2" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2.5 text-slate-100" oninput="saveWhatsAppOptions()">بشرى سارة أستاذ {customer}! جهازك ({device}) تم إصلاحه بنجاح وهو جاهز للاستلام الآن بمحل EL-RESALA. المطلوب سداده: {total} ج.م.</textarea>
                </div>

                <button onclick="saveWhatsAppOptions(true)" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2 rounded-xl shadow transition">
                  حفظ رقم وقوالب الواتساب
                </button>
              </div>
            </div>

            <!-- 3. سياسات التشغيل -->
            <div id="spane-policies" class="setting-pane space-y-4">
              <h2 class="text-base font-black text-slate-100 flex items-center gap-2"><i data-lucide="bell" class="w-5 h-5 text-cyan-400"></i> إعدادات الإشعارات وسياسات التشغيل</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div><div class="font-bold text-slate-100">تفعيل الإشعارات</div><div class="text-[10px] text-slate-400">إظهار إشعارات النظام المباشرة</div></div>
                  <input type="checkbox" checked class="w-5 h-5 accent-cyan-400">
                </div>
                <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div><div class="font-bold text-slate-100">الأصوات</div><div class="text-[10px] text-slate-400">تشغيل أصوات التنبيهات والأزرار</div></div>
                  <input type="checkbox" checked class="w-5 h-5 accent-cyan-400">
                </div>
              </div>
            </div>

            <!-- 4. المستخدمين وكلمات المرور -->
            <div id="spane-users" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 class="text-base font-black text-amber-400 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5"></i> إدارة المستخدمين وصلاحيات الدخول</h2>
                  <p class="text-xs text-slate-400">يمكنك تعديل باسوورد المدير (admin) أو أي مستخدم بحرية</p>
                </div>
                <button onclick="alert('جاري فتح إضافة مستخدم...');" class="bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow">+ مستخدم جديد</button>
              </div>

              <div class="bg-[#172338] rounded-2xl border border-slate-800 overflow-hidden">
                <table class="w-full text-right text-xs">
                  <thead class="bg-[#0c1322] text-slate-400 text-[11px] border-b border-slate-800">
                    <tr><th class="p-3">الاسم</th><th class="p-3">اسم المستخدم (Login)</th><th class="p-3">كلمة المرور الحالية</th><th class="p-3">الصلاحية</th><th class="p-3 text-center">إجراءات</th></tr>
                  </thead>
                  <tbody id="usersTableBody" class="divide-y divide-slate-800 font-semibold"></tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- ================= MODAL: إضافة منتج المطابق للصورة 1788723408105 ================= -->
  <div id="modal-add-product" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95">
      <div class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <button onclick="closeModal('modal-add-product')" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"><i data-lucide="x" class="w-5 h-5"></i></button>
        <h3 class="font-extrabold text-sm text-slate-800">إضافة منتج</h3>
      </div>

      <div class="p-5 space-y-3.5 overflow-y-auto custom-scroll text-xs">
        <div>
          <label class="font-bold text-slate-700 block mb-1">اسم المنتج *</label>
          <input type="text" id="prodNameInput" placeholder="مثال : سماعة بلوتوث JBL" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition">
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">صورة المنتج</label>
          <div class="border border-slate-200 rounded-xl p-2 bg-slate-50">
            <input type="file" id="prodImageFile" accept="image/*" class="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:border file:border-slate-300 file:text-slate-700 hover:file:bg-slate-100 cursor-pointer" onchange="previewProductImage(event)">
            <div id="imagePreviewContainer" class="hidden mt-2 text-center">
              <img id="imagePreviewImg" class="w-20 h-20 object-contain mx-auto rounded-lg border bg-white p-1">
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-1 leading-relaxed">التحسين التلقائي يضبط السطوع والتباين ويزيل الصورة ويحطها على خلفية بيضاء نظيفة تناسب عرض المنتج.</p>
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">الباركود</label>
          <div class="flex gap-2">
            <input type="text" id="prodBarcodeInput" value="FG7253771" placeholder="FG7253771" class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition">
            <button type="button" onclick="generateNewBarcodeCode()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl font-bold text-xs transition">توليد</button>
          </div>
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">الفئة</label>
          <select id="prodCategorySelect" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition">
            <option value="اكسسوارات / قطع غيار">اكسسوارات / قطع غيار</option>
            <option value="هواتف محمولة">هواتف محمولة (جديد / مستعمل)</option>
            <option value="جرابات واسكرينات">جرابات واسكرينات</option>
            <option value="شواحن وكابلات">شواحن وكابلات</option>
            <option value="سماعات وبلوتوث">سماعات وبلوتوث</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">سعر الشراء</label>
          <input type="number" id="prodCostInput" value="0" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition">
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">سعر البيع *</label>
          <input type="number" id="prodPriceInput" value="0" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-emerald-600 font-black focus:outline-none focus:border-blue-500 focus:bg-white transition">
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">الكمية بالمخزون</label>
          <input type="number" id="prodStockInput" value="0" min="0" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition">
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">الحد الأدنى للتنبيه</label>
          <input type="number" id="prodMinAlertInput" value="3" min="1" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition">
        </div>
      </div>

      <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
        <button onclick="saveProductFromNewModal()" class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-2.5 px-4 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5">
          <span>حفظ المنتج</span><span>💾</span>
        </button>
        <button onclick="closeModal('modal-add-product')" class="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold rounded-xl text-xs transition">إلغاء</button>
      </div>
    </div>
  </div>

  <!-- MODAL: تعديل باسوورد المدير -->
  <div id="modal-edit-user-pass" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 text-xs">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 class="font-black text-sm text-blue-400">تعديل باسوورد المدير</h3>
        <button onclick="closeModal('modal-edit-user-pass')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="editUserId">
      <div><label class="text-slate-400 block mb-1">الاسم:</label><input type="text" id="editUserName" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100 font-bold"></div>
      <div><label class="text-slate-400 block mb-1">اسم الدخول:</label><input type="text" id="editUserLogin" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100 font-mono font-bold"></div>
      <div><label class="text-amber-400 block mb-1 font-bold">الباسوورد الجديد:</label><input type="text" id="editUserPass" placeholder="اكتب الباسوورد الجديد..." class="w-full bg-[#16233b] border border-amber-500/50 rounded-xl p-2 text-amber-300 font-mono font-bold"></div>
      <button onclick="saveUserPasswordChange()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl shadow mt-2">حفظ الباسوورد الجديد</button>
    </div>
  </div>

  <!-- ================= JAVASCRIPT ENGINE ================= -->
  <script>
    // قاعدة البيانات المركزية الآمنة
    const defaultDatabase = {
      users: [
        { id: '1', name: 'محمد مصطفى عماشه', username: 'admin', pass: '123456', role: 'مدير النظام' }
      ],
      printerSettings: {
        paperSize: '80mm',
        fontSize: '13px',
        textAlign: 'right',
        horizontalOffset: 2,
        barcodeStickerSize: '38x25mm',
        showItemPrice: true,
        showIMEI: true,
        showBarcodePrice: true,
        autoCut: true
      },
      whatsappSettings: {
        storeNumber: '01070900711',
        invTpl: 'مرحباً بك أستاذ {customer}، تم إصدار فاتورتك رقم {invoice} من محل EL-RESALA بقيمة {total} ج.م. شكراً لتعاملكم معنا!',
        readyTpl: 'بشرى سارة أستاذ {customer}! جهازك ({device}) تم إصلاحه بنجاح وهو جاهز للاستلام الآن بمحل EL-RESALA. المطلوب سداده: {total} ج.م.'
      },
      products: [
        { id: '1', name: 'iPhone 15 128GB', barcode: 'FG9281721', type: 'هواتف محمولة', cost: 32000, price: 34500, stock: 4, minAlert: 2, image: '' },
        { id: '2', name: 'جراب سيليكون MagSafe', barcode: 'FG8374910', type: 'اكسسوارات / قطع غيار', cost: 120, price: 250, stock: 35, minAlert: 5, image: '' },
        { id: '3', name: 'سماعة بلوتوث لاسلكية P9', barcode: 'FG7253771', type: 'اكسسوارات / قطع غيار', cost: 450, price: 850, stock: 12, minAlert: 3, image: '' },
        { id: '4', name: 'شاشة سامسونج A12 أصلية', barcode: 'FG6251892', type: 'اكسسوارات / قطع غيار', cost: 650, price: 850, stock: 6, minAlert: 3, image: '' }
      ],
      devices: [
        { model: 'iPhone 15 Pro Max', imei: '354892019284910', color: 'تيتانيوم طبيعي', storage: '256GB', cond: 'جديد متبرشم', cost: 58000, price: 61500, warranty: 'سنة دولي' }
      ],
      debts: [
        { id: 'INV-1082', customer: 'أحمد خالد إبراهيم', phone: '01122334455', total: 4200, paid: 3700, remaining: 500, date: '2026-09-05' }
      ],
      wasteRecords: [],
      purchases: [],
      customers: [],
      repairs: [],
      transfers: [],
      cart: [{ id: '4', name: 'شاشة سامسونج A12 أصلية', price: 850, qty: 1 }]
    };

    let App = JSON.parse(localStorage.getItem('EL_RESALA_V4_SAFE_MASTER')) || defaultDatabase;

    function saveApp() {
      localStorage.setItem('EL_RESALA_V4_SAFE_MASTER', JSON.stringify(App));
    }

    // تنقل الشاشات
    function navigateTo(pageId) {
      document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition';
      });

      const target = document.getElementById('view-' + pageId);
      if (target) target.classList.remove('hidden');

      const activeNav = document.getElementById('nav-' + pageId);
      if (activeNav) {
        activeNav.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow-md transition';
      }

      if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.add('-right-64');
      }

      try {
        if (pageId === 'dashboard') initCharts();
        if (pageId === 'pos') renderPos();
        if (pageId === 'inventory') renderInventory();
        if (pageId === 'settings') loadSettingsToInputs();
      } catch (e) {
        console.error(e);
      }
      lucide.createIcons();
    }

    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-right-64'); }
    function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); lucide.createIcons(); }
    function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

    // ================= محرك تخصيص الطابعات والريسيت =================
    function loadSettingsToInputs() {
      const pr = App.printerSettings || defaultDatabase.printerSettings;
      if (document.getElementById('cfgPaperSize')) document.getElementById('cfgPaperSize').value = pr.paperSize || '80mm';
      if (document.getElementById('cfgFontSize')) document.getElementById('cfgFontSize').value = pr.fontSize || '13px';
      if (document.getElementById('cfgTextAlign')) document.getElementById('cfgTextAlign').value = pr.textAlign || 'right';
      if (document.getElementById('cfgHorizontalOffset')) document.getElementById('cfgHorizontalOffset').value = pr.horizontalOffset !== undefined ? pr.horizontalOffset : 2;
      if (document.getElementById('cfgBarcodeStickerSize')) document.getElementById('cfgBarcodeStickerSize').value = pr.barcodeStickerSize || '38x25mm';
      if (document.getElementById('cfgShowItemPrice')) document.getElementById('cfgShowItemPrice').checked = pr.showItemPrice !== false;
      if (document.getElementById('cfgShowIMEI')) document.getElementById('cfgShowIMEI').checked = pr.showIMEI !== false;
      if (document.getElementById('cfgShowBarcodePrice')) document.getElementById('cfgShowBarcodePrice').checked = pr.showBarcodePrice !== false;
      if (document.getElementById('cfgAutoCut')) document.getElementById('cfgAutoCut').checked = pr.autoCut !== false;

      const wa = App.whatsappSettings || defaultDatabase.whatsappSettings;
      if (document.getElementById('cfgCustomWhatsAppNumber')) document.getElementById('cfgCustomWhatsAppNumber').value = wa.storeNumber || '01070900711';
      if (document.getElementById('cfgWhatsAppInvTpl')) document.getElementById('cfgWhatsAppInvTpl').value = wa.invTpl || '';
      if (document.getElementById('cfgWhatsAppReadyTpl')) document.getElementById('cfgWhatsAppReadyTpl').value = wa.readyTpl || '';

      renderUsersTable();
      switchSettingTab('printers');
    }

    function savePrinterOptions() {
      App.printerSettings = {
        paperSize: document.getElementById('cfgPaperSize').value,
        fontSize: document.getElementById('cfgFontSize').value,
        textAlign: document.getElementById('cfgTextAlign').value,
        horizontalOffset: parseFloat(document.getElementById('cfgHorizontalOffset').value) || 0,
        barcodeStickerSize: document.getElementById('cfgBarcodeStickerSize').value,
        showItemPrice: document.getElementById('cfgShowItemPrice').checked,
        showIMEI: document.getElementById('cfgShowIMEI').checked,
        showBarcodePrice: document.getElementById('cfgShowBarcodePrice').checked,
        autoCut: document.getElementById('cfgAutoCut').checked
      };
      saveApp();
    }

    function saveWhatsAppOptions(showAlert = false) {
      const num = document.getElementById('cfgCustomWhatsAppNumber').value.trim();
      App.whatsappSettings = {
        storeNumber: num || '01070900711',
        invTpl: document.getElementById('cfgWhatsAppInvTpl').value,
        readyTpl: document.getElementById('cfgWhatsAppReadyTpl').value
      };
      saveApp();
      if (showAlert) alert(`✅ تم حفظ رقم واتساب المحل المعتمد بنجاح: [${App.whatsappSettings.storeNumber}]`);
    }

    function testPrintConfiguredReceipt() {
      savePrinterOptions();
      const pr = App.printerSettings;
      const waNum = App.whatsappSettings?.storeNumber || '01070900711';
      const width = pr.paperSize === '58mm' ? '54mm' : (pr.paperSize === '80mm' ? '76mm' : '100%');
      const offset = `${pr.horizontalOffset}mm`;

      const html = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <style>
            @page { margin: 0; }
            body {
              font-family: 'Courier New', monospace, sans-serif;
              font-size: ${pr.fontSize};
              text-align: ${pr.textAlign};
              width: ${width};
              margin-right: ${offset};
              padding: 6px;
              color: #000;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 1.2em;">EL-RESALA</div>
          <div class="center">هاتف الواتساب: ${waNum}</div>
          <hr style="border: 0; border-top: 1px dashed #000;">
          <div>فاتورة تجريبية رقم: #INV-TEST</div>
          <div>التاريخ: ${new Date().toLocaleString('ar-EG')}</div>
          <table>
            <thead>
              <tr style="border-bottom: 1px solid #000;">
                <th style="text-align: right;">الصنف</th>
                ${pr.showItemPrice ? '<th style="text-align: left;">السعر</th>' : ''}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>شاشة سامسونج A12 أصلية × 1</td>
                ${pr.showItemPrice ? '<td style="text-align: left;">850.00</td>' : ''}
              </tr>
              ${pr.showIMEI ? '<tr><td colspan="2" style="font-size: 0.85em; color: #555;">S/N: 354892019284910 (ضمان 30 يوم)</td></tr>' : ''}
            </tbody>
          </table>
          <hr style="border: 0; border-top: 1px solid #000;">
          <div class="bold" style="display: flex; justify-content: space-between;">
            <span>الصافي:</span>
            <span>850.00 ج.م</span>
          </div>
          <div class="center" style="font-size: 0.85em; margin-top: 6px;">* البضاعة المباعة ترد وتستبدل خلال 14 يوماً *</div>
          <script>window.onload = function(){ window.print(); window.close(); };<\/script>
        </body>
        </html>
      `;
      const w = window.open('', '_blank', 'width=380,height=600');
      w.document.write(html);
      w.document.close();
    }

    function switchSettingTab(key) {
      document.querySelectorAll('.setting-pane').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.setting-nav-btn').forEach(btn => {
        btn.className = 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs';
      });
      document.getElementById('spane-' + key)?.classList.remove('hidden');
      document.getElementById('stab-' + key)?.setAttribute('class', 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black flex items-center gap-2.5 text-xs shadow-md');
      if (key === 'users') renderUsersTable();
      lucide.createIcons();
    }

    // ================= محرك إضافة منتج =================
    let currentUploadedProductImage = '';

    function openAddProductModal() {
      document.getElementById('prodNameInput').value = '';
      document.getElementById('prodBarcodeInput').value = 'FG' + Math.floor(1000000 + Math.random() * 9000000);
      document.getElementById('prodCategorySelect').value = 'اكسسوارات / قطع غيار';
      document.getElementById('prodCostInput').value = '0';
      document.getElementById('prodPriceInput').value = '0';
      document.getElementById('prodStockInput').value = '0';
      document.getElementById('prodMinAlertInput').value = '3';
      document.getElementById('prodImageFile').value = '';
      document.getElementById('imagePreviewContainer').classList.add('hidden');
      currentUploadedProductImage = '';
      openModal('modal-add-product');
    }

    function generateNewBarcodeCode() {
      document.getElementById('prodBarcodeInput').value = 'FG' + Math.floor(1000000 + Math.random() * 9000000);
    }

    function previewProductImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          currentUploadedProductImage = e.target.result;
          document.getElementById('imagePreviewImg').src = currentUploadedProductImage;
          document.getElementById('imagePreviewContainer').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    }

    function saveProductFromNewModal() {
      const name = document.getElementById('prodNameInput').value.trim();
      const barcode = document.getElementById('prodBarcodeInput').value.trim() || ('FG' + Math.floor(1000000 + Math.random() * 9000000));
      const category = document.getElementById('prodCategorySelect').value;
      const cost = parseFloat(document.getElementById('prodCostInput').value) || 0;
      const price = parseFloat(document.getElementById('prodPriceInput').value) || 0;
      const stock = parseInt(document.getElementById('prodStockInput').value) || 0;
      const minAlert = parseInt(document.getElementById('prodMinAlertInput').value) || 3;

      if (!name) return alert('يرجى كتابة اسم المنتج أولاً!');

      App.products.unshift({
        id: Date.now().toString(),
        name, barcode, type: category,
        cost, price, stock, minAlert,
        image: currentUploadedProductImage
      });

      saveApp();
      closeModal('modal-add-product');
      renderInventory();
      renderPos();
      alert(`✅ تم حفظ المنتج (${name}) بنجاح!`);
    }

    // ================= محرك المبيعات (POS) =================
    function renderPos() {
      const grid = document.getElementById('posProductsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      App.products.forEach(p => {
        grid.innerHTML += `
          <div onclick="addToCart('${p.id}')" class="bg-slate-50 hover:bg-blue-50/60 border border-slate-200 p-3 rounded-2xl cursor-pointer transition flex flex-col justify-between">
            <div>
              <span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">${p.type}</span>
              <h4 class="font-bold text-xs mt-1.5 text-slate-800">${p.name}</h4>
              <p class="text-[10px] text-slate-400 font-mono">${p.barcode || ''}</p>
            </div>
            <div class="mt-2 flex justify-between items-center">
              <span class="text-xs font-black text-emerald-600">${p.price} ج.م</span>
              <i data-lucide="plus" class="w-4 h-4 text-blue-600"></i>
            </div>
          </div>
        `;
      });
      renderCart();
    }

    function addToCart(id) {
      const p = App.products.find(x => x.id === id);
      if (!p) return;
      const item = App.cart.find(x => x.id === id);
      if (item) item.qty++; else App.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      saveApp(); renderCart();
    }

    function updateCartItemPrice(index, newPrice) {
      App.cart[index].price = parseFloat(newPrice) || 0;
      saveApp();
      renderCart(false);
    }

    function renderCart(renderItems = true) {
      const box = document.getElementById('posCartList');
      if (!box) return;
      if (renderItems) {
        box.innerHTML = '';
        App.cart.forEach((i, idx) => {
          box.innerHTML += `
            <div class="p-2.5 rounded-xl bg-slate-50 border space-y-1.5 text-xs">
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-800">${i.name}</span>
                <button onclick="App.cart.splice(${idx},1);saveApp();renderCart();" class="text-rose-500 font-bold hover:underline">حذف</button>
              </div>
              <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                <div class="flex items-center gap-1">
                  <span class="text-slate-400">الكمية:</span>
                  <input type="number" min="1" value="${i.qty}" class="w-12 border rounded text-center font-bold" oninput="App.cart[${idx}].qty=parseInt(this.value)||1;saveApp();renderCart(false);">
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-slate-400">سعر مخصص:</span>
                  <input type="number" value="${i.price}" class="w-20 border border-blue-400 rounded p-1 font-black text-emerald-600 text-center" oninput="updateCartItemPrice(${idx}, this.value)">
                </div>
              </div>
            </div>
          `;
        });
      }
      let sum = 0; App.cart.forEach(i => sum += (i.price * i.qty));
      const disc = parseFloat(document.getElementById('posCartDiscount')?.value) || 0;
      const net = Math.max(0, sum - disc);
      document.getElementById('posCartSubtotal').innerText = `${sum} ج.م`;
      document.getElementById('posCartTotal').innerText = `${net} ج.م`;
    }

    function clearCart() { App.cart = []; saveApp(); renderCart(); }

    function renderInventory() {
      const tbody = document.getElementById('inventoryTableRows');
      if (!tbody) return;
      tbody.innerHTML = '';
      App.products.forEach(p => {
        const imgTag = p.image 
          ? `<img src="${p.image}" class="w-8 h-8 rounded-lg object-contain bg-white border p-0.5">`
          : `<div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><i data-lucide="package" class="w-4 h-4"></i></div>`;
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3">${imgTag}</td>
            <td class="p-3 font-bold text-slate-800">${p.name}</td>
            <td class="p-3 font-mono font-bold text-blue-600">${p.barcode || '—'}</td>
            <td class="p-3"><span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">${p.type}</span></td>
            <td class="p-3 font-black ${p.stock <= (p.minAlert || 3) ? 'text-rose-500' : 'text-emerald-600'}">${p.stock}</td>
            <td class="p-3 text-slate-600">${p.cost} ج.م</td>
            <td class="p-3 font-black text-slate-900">${p.price} ج.م</td>
            <td class="p-3 text-center"><button onclick="p.stock = parseInt(prompt('تعديل الرصيد:', p.stock)); saveApp(); renderInventory();" class="text-blue-600 font-bold hover:underline">تعديل</button></td>
          </tr>
        `;
      });
      lucide.createIcons();
    }

    function renderUsersTable() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      App.users.forEach((u) => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-800/40">
            <td class="p-3 font-bold text-slate-100 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg ${u.id === '1' ? 'bg-blue-600' : 'bg-slate-700'} text-white flex items-center justify-center text-[10px]"><i data-lucide="user" class="w-3.5 h-3.5"></i></span>
              ${u.name}
            </td>
            <td class="p-3 font-mono text-cyan-400 font-bold">${u.username}</td>
            <td class="p-3 font-mono text-amber-300 font-bold">${u.pass}</td>
            <td class="p-3"><span class="bg-[#0c1322] px-2.5 py-0.5 rounded-lg border border-slate-700 text-[10px] text-slate-300 font-bold">${u.role}</span></td>
            <td class="p-3 text-center">
              <button onclick="openChangePasswordModal('${u.id}')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition">تعديل الباسوورد</button>
            </td>
          </tr>
        `;
      });
      lucide.createIcons();
    }

    function openChangePasswordModal(userId) {
      const user = App.users.find(x => x.id === userId);
      if (!user) return;
      document.getElementById('editUserId').value = user.id;
      document.getElementById('editUserName').value = user.name;
      document.getElementById('editUserLogin').value = user.username;
      document.getElementById('editUserPass').value = user.pass;
      openModal('modal-edit-user-pass');
    }

    function saveUserPasswordChange() {
      const id = document.getElementById('editUserId').value;
      const newName = document.getElementById('editUserName').value.trim();
      const newLogin = document.getElementById('editUserLogin').value.trim();
      const newPass = document.getElementById('editUserPass').value.trim();
      if (!newName || !newLogin || !newPass) return alert('يرجى ملء كافة الحقول!');
      const user = App.users.find(x => x.id === id);
      if (user) {
        user.name = newName; user.username = newLogin; user.pass = newPass;
        document.getElementById('headerUserDisplayName').innerText = newName;
        saveApp();
        renderUsersTable();
        closeModal('modal-edit-user-pass');
        alert(`✅ تم تحديث كلمة المرور لـ (${newName}) بنجاح إلى: [${newPass}]`);
      }
    }

    // التهيئة المبدئية
    loadSettingsToInputs();
    renderInventory();
    renderPos();
    lucide.createIcons();
  </script>
</body>
</html>
HTML

# نسخ نفس التعديل للمسار الرئيسي
cp frontend/index.html index.html

# رفع التعديلات فوراً لـ GitHub
git add frontend/index.html index.html
git commit -m "feat(settings): allow full custom WhatsApp phone input, comprehensive printer alignment, bias, offset and price toggle controls"
git push origin main

echo "=========================================================="
echo "✨ تم رفع التحديث بنجاح!"
echo "يمكنك الآن تحديد رقم الواتساب بحرية والتحكم في تفاصيل الطابعة بدقة."
echo "=========================================================="
