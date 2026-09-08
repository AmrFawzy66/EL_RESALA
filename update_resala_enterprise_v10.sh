#!/bin/bash
set -e

echo "🚀 جاري تطبيق التحديث الشامل: إدارة المحافظ، التسوية، الثيمات، الفواتير، والترخيص..."

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
    body { font-family: 'Cairo', sans-serif; transition: background-color 0.3s, color 0.3s; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* أنماط الثيمات المتعددة ووضع إراحة العين */
    body.theme-eye-comfort {
      background-color: #26211a !important;
      color: #f3ebd7 !important;
    }
    body.theme-eye-comfort .bg-white {
      background-color: #332c23 !important;
      border-color: #4a3f31 !important;
      color: #f3ebd7 !important;
    }
    body.theme-eye-comfort input, body.theme-eye-comfort select, body.theme-eye-comfort textarea {
      background-color: #1f1a14 !important;
      border-color: #5c4e3c !important;
      color: #fffaed !important;
    }
    body.theme-eye-comfort .text-slate-800, body.theme-eye-comfort .text-slate-900 {
      color: #fdf6e7 !important;
    }

    body.theme-midnight {
      background-color: #050811 !important;
      color: #e2e8f0 !important;
    }
    body.theme-midnight .bg-white {
      background-color: #0e1526 !important;
      border-color: #1e293b !important;
      color: #f8fafc !important;
    }

    /* محرك الطباعة المباشر المقاوم للمشاكل */
    @media print {
      body * { visibility: hidden !important; }
      #printableInvoiceArea, #printableInvoiceArea * { visibility: visible !important; }
      #printableInvoiceArea {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        display: block !important;
        background: white !important;
        color: black !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body class="bg-[#f4f7fb] text-slate-800 min-h-screen flex overflow-x-hidden">

  <!-- ================= 1. القائمة الجانبية (SIDEBAR) ================= -->
  <aside id="sidebar" class="w-64 bg-[#0a1224] text-slate-300 flex flex-col shrink-0 min-h-screen z-50 transition-all duration-300 fixed md:static -right-64 md:right-0 shadow-2xl md:shadow-none">
    <div class="p-4 border-b border-slate-800/80 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/30">
          <i data-lucide="smartphone" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h1 class="text-white font-black text-base tracking-wider">EL-RESALA</h1>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p class="text-[10px] text-cyan-400 font-bold">نظام إدارة محلات المحمول</p>
        </div>
      </div>
      <button onclick="toggleSidebar()" class="md:hidden text-slate-400 hover:text-white p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- روابط التنقل الـ 14 الشاملة -->
    <nav class="flex-1 px-3 py-4 space-y-1 text-xs font-bold overflow-y-auto custom-scroll">
      <button onclick="navigateTo('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow-md transition">
        <i data-lucide="home" class="w-4 h-4"></i><span>الرئيسية والداشبورد</span>
      </button>
      <button onclick="navigateTo('pos')" id="nav-pos" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="shopping-cart" class="w-4 h-4 text-emerald-400"></i><span>المبيعات (POS) [F10]</span>
      </button>
      <button onclick="navigateTo('treasury')" id="nav-treasury" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="wallet" class="w-4 h-4 text-emerald-400"></i><span>المحافظ والخزائن والتسوية</span>
      </button>
      <button onclick="navigateTo('debts')" id="nav-debts" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="clock" class="w-4 h-4 text-amber-400"></i><span>الديون والآجل</span>
      </button>
      <button onclick="navigateTo('inventory')" id="nav-inventory" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="boxes" class="w-4 h-4 text-cyan-400"></i><span>المخزون وجرد المحل</span>
      </button>
      <button onclick="navigateTo('spare-parts')" id="nav-spare-parts" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="cpu" class="w-4 h-4 text-amber-500"></i><span>قطع الغيار والتسعير</span>
      </button>
      <button onclick="navigateTo('waste')" id="nav-waste" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400"></i><span>الهالك والمرتجعات (RMA)</span>
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
      <button onclick="navigateTo('customers')" id="nav-customers" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="users" class="w-4 h-4 text-teal-400"></i><span>العملاء</span>
      </button>
      <button onclick="navigateTo('suppliers')" id="nav-suppliers" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="building" class="w-4 h-4 text-indigo-400"></i><span>الموردين والشركات</span>
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
        <div class="flex items-center gap-2 bg-[#131d36] border border-slate-700/60 px-3 py-1 rounded-xl shadow-inner cursor-pointer" onclick="navigateTo('dashboard')">
          <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">R</div>
          <span class="font-black text-xs tracking-wider text-slate-100 hidden sm:inline">EL-RESALA</span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- زر التبديل السريع لثيم إراحة العين من الهيدر -->
        <button onclick="toggleEyeComfortQuick()" id="btnEyeComfortHeader" title="تبديل وضع إراحة العين" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition">
          <i data-lucide="sun" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">إراحة العين</span>
        </button>

        <button onclick="openChangePasswordModal('1')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition">
          <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">تغيير الباسوورد</span>
        </button>

        <div class="flex items-center gap-2 border-r border-slate-800 pr-3">
          <div class="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black text-xs">M</div>
          <div class="text-right hidden sm:block">
            <div class="text-xs font-extrabold text-slate-100" id="headerUserDisplayName">محمد مصطفى عماشه</div>
            <div class="text-[10px] text-slate-400 font-semibold">مدير النظام (admin)</div>
          </div>
        </div>
      </div>
    </header>

    <!-- ================= 3. المحتوى الرئيسي والشاشات ================= -->
    <main class="flex-1 p-3 md:p-6 overflow-y-auto custom-scroll">

      <!-- ================= شاشة الرئيسية ================= -->
      <section id="view-dashboard" class="page-view space-y-5">
        <div class="relative bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div class="space-y-3 text-right z-10 max-w-xl">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
              <i data-lucide="sparkles" class="w-4 h-4 text-cyan-300"></i>
              <span>EL-RESALA ERP V4.0 PRO</span>
            </div>
            <h2 class="text-xl md:text-3xl font-black text-slate-900 leading-tight">
              كل ما تحتاجه في مكان واحد<br>
              <span class="text-blue-600">أجهزة - قطع غيار - صيانة - محافظ وتسوية</span>
            </h2>
            <p class="text-xs md:text-sm text-slate-600 font-semibold">إدارة أسهل .. مبيعات أكثر .. تحكم كامل 100%</p>
          </div>
          <div class="w-56 h-36 bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-blue-200/80 shadow-xl flex flex-col items-center justify-center text-center space-y-1.5 shrink-0">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg border-2 border-white">
              <i data-lucide="smartphone" class="w-8 h-8"></i>
            </div>
            <div class="font-black text-sm text-slate-900 tracking-wider">EL-RESALA</div>
            <div class="text-[10px] text-blue-600 font-bold">لخدمات المحمول والمبيعات</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">عدد العملاء</div><div class="text-2xl font-black text-slate-800" id="dashCustCount">4</div></div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><i data-lucide="users" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">طلبات الصيانة</div><div class="text-2xl font-black text-slate-800" id="dashRepCount">2</div></div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><i data-lucide="wrench" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">الأصناف بالمخزن</div><div class="text-2xl font-black text-slate-800" id="dashProdCount">4</div></div>
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><i data-lucide="package" class="w-6 h-6"></i></div>
          </div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between">
            <div><div class="text-xs text-slate-500 font-bold">مبيعات اليوم</div><div class="text-2xl font-black text-emerald-600">12,450 ج.م</div></div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><i data-lucide="banknote" class="w-6 h-6"></i></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div class="lg:col-span-8 bg-white rounded-3xl p-5 border shadow-sm space-y-3">
            <h3 class="font-black text-sm text-slate-800 flex items-center gap-2"><i data-lucide="trending-up" class="w-4 h-4 text-blue-600"></i> مؤشر المبيعات والأرباح اليومية</h3>
            <div class="h-64 relative"><canvas id="salesTrendChart"></canvas></div>
          </div>
          <div class="lg:col-span-4 bg-white rounded-3xl p-5 border shadow-sm space-y-3 flex flex-col justify-between">
            <h3 class="font-black text-sm text-slate-800 flex items-center gap-2"><i data-lucide="pie-chart" class="w-4 h-4 text-purple-600"></i> مصادر الإيرادات</h3>
            <div class="h-48 relative flex items-center justify-center"><canvas id="categoryRevenueChart"></canvas></div>
            <div class="pt-2 border-t grid grid-cols-3 text-center text-[10px] font-bold">
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
            <p class="text-xs text-slate-400">تعديل سعر أي صنف يدوياً داخل السلة قبل تأكيد الفاتورة [F10]</p>
          </div>
          <button onclick="testPrintSampleReceipt()" class="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> تجربة الطباعة
          </button>
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
                <i data-lucide="check-circle" class="w-4 h-4"></i> اختيار وسيلة الدفع وإتمام الفاتورة [F10]
              </button>
            </div>
          </div>

          <div class="lg:col-span-7 bg-white rounded-2xl p-4 border shadow-sm space-y-3">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="posProductsGrid"></div>
          </div>
        </div>
      </section>

      <!-- ================= 3. شاشة المحافظ والخزائن والتسوية (محدثة بالكامل مع أزرار إيداع وسحب وتسوية) ================= -->
      <section id="view-treasury" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2">
              <i data-lucide="wallet" class="w-5 h-5 text-emerald-600"></i> إدارة المحافظ والخزائن والتسوية
            </h2>
            <p class="text-xs text-slate-400">إضافة المحافظ، الحسابات البنكية، انستاباي، وإجراء عمليات الإيداع والسحب ومطابقة الرصيد (التسوية)</p>
          </div>
          <button onclick="openModal('modal-add-account')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition">
            <i data-lucide="plus" class="w-4 h-4"></i> إضافة محفظة / حساب جديد
          </button>
        </div>

        <!-- شبكة كروت المحافظ الديناميكية مع أزرار الإيداع والسحب والتسوية لكل محفظة -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="accountsCardsGrid"></div>

        <!-- جدول الحركات المالية -->
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm p-4 space-y-2">
          <div class="flex justify-between items-center border-b pb-2">
            <h3 class="font-black text-xs text-slate-800">سجل حركات الإيداع، السحب، والتسويات الأخير</h3>
            <button onclick="exportToExcel(App.accountTransactions, 'سجل_الحركات_المالية')" class="text-emerald-600 font-bold text-xs hover:underline">تصدير إكسيل</button>
          </div>
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th class="p-2.5">النوع</th>
                <th class="p-2.5">المحفظة / الحساب</th>
                <th class="p-2.5">المبلغ</th>
                <th class="p-2.5">البيان / السبب</th>
                <th class="p-2.5">التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody id="treasuryTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 4. شاشة الديون والآجل ================= -->
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

      <!-- ================= 5. شاشة المخزون والجرد ================= -->
      <section id="view-inventory" class="page-view hidden space-y-4">
        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="boxes" class="w-5 h-5 text-cyan-600"></i> المخزون العام وجرد المحل</h2>
            <p class="text-xs text-slate-400">متابعة الكميات، رأس المال، والحد الأدنى للنواقص</p>
          </div>
          <button onclick="openAddProductModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> إضافة منتج جديد
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

      <!-- ================= 6. قسم قطع الغيار والتسعير ================= -->
      <section id="view-spare-parts" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="cpu" class="w-5 h-5 text-amber-500"></i> قسم قطع الغيار والتسعير</h2>
            <p class="text-xs text-slate-400">شاشات، بطاريات، فلاتات مع تسعير الجملة والقطاعي</p>
          </div>
          <button onclick="openModal('modal-add-spare-part')" class="bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow">+ إضافة قطعة غيار</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b"><tr><th class="p-3">القطعة</th><th class="p-3">الموديل</th><th class="p-3">المورد</th><th class="p-3">الشراء</th><th class="p-3">الجملة</th><th class="p-3">القطاعي</th><th class="p-3">الرصيد</th><th class="p-3 text-center">إجراء</th></tr></thead>
            <tbody id="sparePartsTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 7. شاشة الهالك والمرتجعات ================= -->
      <section id="view-waste" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="alert-triangle" class="w-5 h-5 text-rose-500"></i> إدارة الهالك والمرتجعات (RMA)</h2>
            <p class="text-xs text-slate-400">فصل هالك العميل عن عيوب صناعة الموردين والتالف الداخلي</p>
          </div>
          <button onclick="openModal('modal-add-waste')" class="bg-rose-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow">+ تسجيل هالك</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 text-slate-500 border-b">
              <tr><th class="p-3">النوع</th><th class="p-3">الصنف</th><th class="p-3">الـ IMEI</th><th class="p-3">الكمية</th><th class="p-3">التكلفة</th><th class="p-3">المسؤول</th><th class="p-3">الحالة</th><th class="p-3">التاريخ</th></tr>
            </thead>
            <tbody id="wasteTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- باقي الشاشات الوظيفية (الأجهزة، الإكسسوارات، الصيانة، العملاء، الموردين، التقارير) -->
      <section id="view-devices" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800">مخزن الهواتف والـ IMEI</h2>
          <button onclick="openModal('modal-add-device')" class="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">+ تسجيل هاتف</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs"><thead class="bg-slate-50 border-b"><tr><th class="p-3">الموديل</th><th class="p-3">الـ IMEI</th><th class="p-3">اللون</th><th class="p-3">سعر الشراء</th><th class="p-3">سعر البيع</th></tr></thead><tbody id="devicesTableBody" class="divide-y font-semibold"></tbody></table>
        </div>
      </section>

      <section id="view-accessories" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800">الإكسسوارات والجرابات</h2>
          <button onclick="openAddProductModal()" class="bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">+ إضافة إكسسوار</button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="accessoriesCardsGrid"></div>
      </section>

      <section id="view-repairs" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800">قسم الصيانة وكروت الاستلام</h2>
          <button onclick="openModal('modal-repair-job')" class="bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow">+ استلام جهاز جديد</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="repairCardsGrid"></div>
      </section>

      <section id="view-customers" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800">دليل العملاء</h2>
          <button onclick="openModal('modal-add-customer')" class="bg-teal-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl">+ إضافة عميل</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs"><thead class="bg-slate-50 border-b"><tr><th class="p-3">الاسم</th><th class="p-3">الهاتف</th><th class="p-3">العنوان</th><th class="p-3">الرصيد والآجل</th><th class="p-3 text-center">إجراءات</th></tr></thead><tbody id="customersTableBody" class="divide-y font-semibold"></tbody></table>
        </div>
      </section>

      <section id="view-suppliers" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <h2 class="text-base font-black text-slate-800">الموردين والشركات</h2>
          <button onclick="openModal('modal-add-supplier')" class="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow">+ إضافة مورد</button>
        </div>
        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table class="w-full text-right text-xs"><thead class="bg-slate-50 border-b"><tr><th class="p-3">الشركة</th><th class="p-3">الهاتف</th><th class="p-3">التخصص</th><th class="p-3">المستحق</th></tr></thead><tbody id="suppliersTableBody" class="divide-y font-semibold"></tbody></table>
        </div>
      </section>

      <section id="view-reports" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="text-base font-black text-slate-800">التقارير المالية</h2></div>
      </section>

      <!-- ================= 8. شاشة الإعدادات المتقدمة (الثيمات، الفواتير باللوجو، الباركود، التراخيص) ================= -->
      <section id="view-settings" class="page-view hidden space-y-4">
        <div class="bg-[#121c2e] text-slate-200 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[660px]">
          
          <div class="w-full md:w-72 bg-[#0c1322] border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-1.5 shrink-0 text-xs font-bold">
            <div class="text-[10px] text-slate-400 font-black px-2 mb-1">تخصيص النظام</div>
            <button onclick="switchSettingTab('themes')" id="stab-themes" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black flex items-center gap-2.5 shadow-md">
              <i data-lucide="palette" class="w-4 h-4"></i><span>الثيمات وإراحة العين</span>
            </button>
            <button onclick="switchSettingTab('invoices')" id="stab-invoices" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="file-text" class="w-4 h-4 text-emerald-400"></i><span>تخصيص الفاتورة واللوجو</span>
            </button>
            <button onclick="switchSettingTab('barcodes')" id="stab-barcodes" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="barcode" class="w-4 h-4 text-pink-400"></i><span>إعدادات الباركود والاستيكر</span>
            </button>
            <button onclick="switchSettingTab('printers')" id="stab-printers" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i><span>الطابعات والورق</span>
            </button>
            <button onclick="switchSettingTab('whatsapp')" id="stab-whatsapp" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i><span>رقم وقوالب الواتساب</span>
            </button>
            <button onclick="switchSettingTab('licenses')" id="stab-licenses" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="key" class="w-4 h-4 text-rose-400"></i><span>الترخيص والبرنامج</span>
            </button>
            <button onclick="switchSettingTab('users')" id="stab-users" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-amber-400 hover:bg-slate-800/80 flex items-center gap-2.5 font-black">
              <i data-lucide="users" class="w-4 h-4 text-amber-400"></i><span>المستخدمين وكلمات المرور</span>
            </button>
          </div>

          <div class="flex-1 p-5 md:p-6 overflow-y-auto custom-scroll space-y-4" id="settingsPanelsContainer">
            
            <!-- 1. تبويب الثيمات ووضع إراحة العين -->
            <div id="spane-themes" class="setting-pane space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3">
                <h2 class="text-base font-black text-cyan-400 flex items-center gap-2">
                  <i data-lucide="palette" class="w-5 h-5"></i> تخصيص الثيمات ووضع إراحة العين
                </h2>
                <p class="text-slate-400 text-[11px]">اختر الثيم المفضل لك لتوفير أقصى درجات الراحة أثناء العمل في المحل</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <!-- وضع إراحة العين -->
                <div onclick="selectTheme('eye-comfort')" class="bg-[#172338] hover:border-amber-400 border border-slate-700 p-4 rounded-2xl cursor-pointer transition space-y-2 group">
                  <div class="flex justify-between items-center">
                    <span class="font-black text-amber-400 text-sm flex items-center gap-2"><i data-lucide="sun" class="w-4 h-4"></i> وضع إراحة العين (Warm Amber)</span>
                    <span class="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">موصى به للعمل الطويل</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">يقلل الضوء الأزرق الضار ويعتمد درجات خشبية وصفراء دافئة تريح العين تماماً.</p>
                </div>

                <!-- الثيم الليلي الافتراضي -->
                <div onclick="selectTheme('default')" class="bg-[#172338] hover:border-blue-400 border border-slate-700 p-4 rounded-2xl cursor-pointer transition space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-black text-blue-400 text-sm flex items-center gap-2"><i data-lucide="moon" class="w-4 h-4"></i> كحلي احترافي (Default Navy)</span>
                    <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">الافتراضي</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">الثيم الكحلي الأنيق عالي التباين مع عناصر إضاءة نيون جذابة.</p>
                </div>

                <!-- ثيم أسود فاحم -->
                <div onclick="selectTheme('midnight')" class="bg-[#172338] hover:border-slate-400 border border-slate-700 p-4 rounded-2xl cursor-pointer transition space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-black text-slate-200 text-sm flex items-center gap-2"><i data-lucide="sparkles" class="w-4 h-4"></i> أسود ليلي فاحم (OLED Midnight)</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">أسود نقي لتوفير الطاقة وتقليل الوهج في الإضاءة الخافتة.</p>
                </div>

                <!-- ثيم نهاري فاتح -->
                <div onclick="selectTheme('light')" class="bg-[#172338] hover:border-emerald-400 border border-slate-700 p-4 rounded-2xl cursor-pointer transition space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="font-black text-emerald-400 text-sm flex items-center gap-2"><i data-lucide="sun-medium" class="w-4 h-4"></i> نهاري ناصع (Clean White)</span>
                  </div>
                  <p class="text-slate-400 text-[11px]">خلفية بيضاء نقية تناسب العمل الصباحي تحت إضاءة الشمس.</p>
                </div>
              </div>
            </div>

            <!-- 2. تبويب تخصيص الفاتورة ورفع اللوجو والتحكم بالنصوص -->
            <div id="spane-invoices" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3">
                <h2 class="text-base font-black text-emerald-400 flex items-center gap-2">
                  <i data-lucide="file-text" class="w-5 h-5"></i> تخصيص الفاتورة واللوجو والعبارات المطبوعة
                </h2>
                <p class="text-slate-400 text-[11px]">تحكم في لوجو المحل، اسم المحل، الترويسة، وشروط الضمان المطبوعة في الأسفل</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- إعدادات نصوص ولوجو الفاتورة -->
                <div class="space-y-3 bg-[#172338] p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label class="font-bold block mb-1 text-slate-200">لوجو الفاتورة المطبوع:</label>
                    <input type="file" id="invoiceLogoInput" accept="image/*" class="w-full border border-slate-700 rounded-xl p-2 bg-[#16233b] text-slate-300" onchange="previewInvoiceLogo(event)">
                    <button onclick="removeInvoiceLogo()" class="text-rose-400 text-[11px] font-bold mt-1 hover:underline">حذف اللوجو والاعتماد على النص فقط</button>
                  </div>
                  <div>
                    <label class="font-bold block mb-1 text-slate-200">اسم المحل الرئيسي بالفاتورة:</label>
                    <input type="text" id="cfgInvStoreName" value="EL-RESALA" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100" oninput="updateLiveReceiptPreview()">
                  </div>
                  <div>
                    <label class="font-bold block mb-1 text-slate-200">الترويسة (السطر الثاني):</label>
                    <input type="text" id="cfgInvSubtitle" value="لخدمات ومبيعات وصيانة الهواتف المحمولة" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100" oninput="updateLiveReceiptPreview()">
                  </div>
                  <div>
                    <label class="font-bold block mb-1 text-slate-200">العنوان ورقم التليفون المطبوع:</label>
                    <input type="text" id="cfgInvAddressPhone" value="شبرا الخيمة - هاتف: 01070900711" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100" oninput="updateLiveReceiptPreview()">
                  </div>
                  <div>
                    <label class="font-bold block mb-1 text-slate-200">شروط الاسترجاع والضمان أسفل الريسيت:</label>
                    <textarea id="cfgInvFooterTerms" rows="2" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100" oninput="updateLiveReceiptPreview()">البضاعة المباعة ترد وتستبدل خلال 14 يوماً مع أصل الفاتورة والعلبة بحالتها الأصلية - شكراً لثقتكم بنا!</textarea>
                  </div>
                  <button onclick="saveInvoiceCustomization(true)" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow">حفظ إعدادات الفاتورة</button>
                </div>

                <!-- معاينة حية لشكل الفاتورة المطبوعة -->
                <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <div class="text-[11px] font-bold text-slate-400">معاينة حية لشكل الفاتورة على الورق الحراري:</div>
                  <div id="liveInvoicePreviewBox" class="bg-white p-4 shadow-xl border text-black font-mono w-[68mm] rounded text-[11px] space-y-1 text-center"></div>
                </div>
              </div>
            </div>

            <!-- 3. تبويب تخصيص الباركود والاستيكر -->
            <div id="spane-barcodes" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3">
                <h2 class="text-base font-black text-pink-400 flex items-center gap-2">
                  <i data-lucide="barcode" class="w-5 h-5"></i> تحكم كامل في ملصقات واستيكرات الباركود
                </h2>
                <p class="text-slate-400 text-[11px]">تعديل أبعاد الخطوط، الارتفاع، الهامش، وإظهار السعر أو اسم المحل</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="font-bold block mb-1">عرض الخطوط (Width):</label>
                  <input type="number" id="cfgBcWidth" value="1.2" step="0.1" min="0.8" max="3" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-center font-bold" oninput="updateBarcodeLivePreview()">
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="font-bold block mb-1">ارتفاع الخطوط (Height):</label>
                  <input type="number" id="cfgBcHeight" value="35" min="15" max="80" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-center font-bold" oninput="updateBarcodeLivePreview()">
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="font-bold block mb-1">إزاحة الاستيكر (الهامش بالـ mm):</label>
                  <input type="number" id="cfgBcOffset" value="0" min="-10" max="10" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-center font-bold" oninput="updateBarcodeLivePreview()">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span class="font-bold">إظهار سعر البيع بالاستيكر</span>
                  <input type="checkbox" id="cfgBcShowPrice" checked class="w-5 h-5 accent-pink-500" onchange="updateBarcodeLivePreview()">
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span class="font-bold">إظهار اسم المحل (EL-RESALA)</span>
                  <input type="checkbox" id="cfgBcShowStore" checked class="w-5 h-5 accent-pink-500" onchange="updateBarcodeLivePreview()">
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span class="font-bold">إظهار اسم وموديل القطعة</span>
                  <input type="checkbox" id="cfgBcShowName" checked class="w-5 h-5 accent-pink-500" onchange="updateBarcodeLivePreview()">
                </div>
              </div>

              <!-- معاينة حية لشكل الاستيكر المطبوع -->
              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                <div class="text-[11px] font-bold text-slate-400">معاينة استيكر ظهر الموبايل والإكسسوار:</div>
                <div class="bg-white p-3 rounded-xl border inline-block text-black text-center space-y-1 shadow-md">
                  <div id="pvBcStore" class="font-black text-[9px]">EL-RESALA</div>
                  <div id="pvBcName" class="font-bold text-[10px]">شاشة سامسونج A12 توكيل</div>
                  <svg id="liveBarcodeSvg" class="mx-auto"></svg>
                  <div id="pvBcPrice" class="font-black text-xs text-emerald-700">850.00 ج.م</div>
                </div>
              </div>
            </div>

            <!-- 4. تبويب الطابعات والورق -->
            <div id="spane-printers" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-amber-400 flex items-center gap-2"><i data-lucide="printer" class="w-5 h-5"></i> تخصيص الطابعة والريسيت والورق</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">مقاس الورق:</label>
                  <select id="cfgPaperSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100">
                    <option value="80mm">حرارية 80 مم (القياسي)</option>
                    <option value="58mm">حرارية 58 مم</option>
                  </select>
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">حجم الخط:</label>
                  <select id="cfgFontSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100">
                    <option value="11px">صغير (11px)</option>
                    <option value="13px" selected>متوسط (13px)</option>
                    <option value="15px">كبير (15px)</option>
                  </select>
                </div>
                <div class="bg-[#172338] p-3 rounded-2xl border border-slate-800">
                  <label class="text-slate-400 block mb-1 font-bold">الإزاحة الأفقية (mm):</label>
                  <input type="number" id="cfgHorizontalOffset" value="2" min="-20" max="20" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold text-slate-100">
                </div>
              </div>
              <button onclick="testPrintSampleReceipt()" class="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow">تجربة طباعة ريسيت فورية</button>
            </div>

            <!-- 5. تبويب رقم الواتساب -->
            <div id="spane-whatsapp" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-emerald-400 flex items-center gap-2"><i data-lucide="message-square" class="w-5 h-5"></i> رقم وقوالب واتساب المحل</h2>
              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div>
                  <label class="text-slate-200 font-bold block mb-1">رقم واتساب المحل (يمكنك تعديله بحرية):</label>
                  <input type="text" id="cfgCustomWhatsAppNumber" value="01070900711" class="w-full bg-[#16233b] border border-emerald-500 rounded-xl p-2.5 font-mono text-slate-100 font-bold">
                </div>
                <button onclick="saveWhatsAppOptions(true)" class="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl shadow">حفظ رقم الواتساب</button>
              </div>
            </div>

            <!-- 6. تبويب التراخيص والبرنامج -->
            <div id="spane-licenses" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-rose-400 flex items-center gap-2"><i data-lucide="key" class="w-5 h-5"></i> حالة الترخيص ومعلومات النسخة</h2>
              <div class="bg-[#172338] p-5 rounded-2xl border border-slate-800 space-y-3">
                <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">حالة التفعيل:</span><span class="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl font-black">نسخة مرخصة ومدفوعة (Lifetime Pro)</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">إصدار النظام:</span><span class="font-mono text-cyan-400 font-bold">EL-RESALA ERP V4.0.2</span></div>
                <div class="flex justify-between items-center"><span class="text-slate-400 font-bold">مفتاح الترخيص:</span><span class="font-mono text-slate-300">RESALA-ENTERPRISE-PRO-2026</span></div>
              </div>
            </div>

            <!-- 7. تبويب المستخدمين -->
            <div id="spane-users" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h2 class="text-base font-black text-amber-400">إدارة المستخدمين وصلاحيات الدخول</h2>
                <button onclick="openModal('modal-add-user')" class="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow">+ إضافة مستخدم جديد</button>
              </div>
              <div class="bg-[#172338] rounded-2xl border border-slate-800 overflow-hidden">
                <table class="w-full text-right text-xs">
                  <thead class="bg-[#0c1322] text-slate-400 border-b border-slate-800">
                    <tr><th class="p-3">الاسم</th><th class="p-3">اليوزر</th><th class="p-3">الباسوورد</th><th class="p-3">الصلاحية</th><th class="p-3 text-center">إجراء</th></tr>
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

  <!-- ================= MODALS النوافذ التفاعلية ================= -->

  <!-- 1. نافذة إضافة محفظة أو حساب جديد (ديناميكية) -->
  <div id="modal-add-account" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="font-black text-sm text-emerald-600 flex items-center gap-1.5"><i data-lucide="plus-circle" class="w-4 h-4"></i> إضافة محفظة أو حساب بنكي جديد</h3>
        <button onclick="closeModal('modal-add-account')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <div>
        <label class="font-bold block mb-1">اسم الحساب / المحفظة *</label>
        <input type="text" id="newAccName" placeholder="مثال: فودافون كاش - الكاشير 1" class="w-full border rounded-xl p-2.5 font-bold">
      </div>
      <div>
        <label class="font-bold block mb-1">نوع الحساب *</label>
        <select id="newAccType" class="w-full border rounded-xl p-2.5 font-bold bg-slate-50">
          <option value="محفظة إلكترونية">محفظة إلكترونية (فودافون / أورنج / اتصالات / وي)</option>
          <option value="انستاباي / بنك">انستاباي (InstaPay) / حساب بنكي</option>
          <option value="خزينة نقدية">خزينة نقدية (درج كاش)</option>
        </select>
      </div>
      <div>
        <label class="font-bold block mb-1">رقم الهاتف أو رقم الحساب:</label>
        <input type="text" id="newAccNumber" placeholder="010XXXXXXXX" class="w-full border rounded-xl p-2 font-mono font-bold">
      </div>
      <div>
        <label class="font-bold block mb-1">الرصيد الافتتاحي (ج.م):</label>
        <input type="number" id="newAccInitialBal" value="0" min="0" class="w-full border rounded-xl p-2 font-black text-emerald-600">
      </div>
      <button onclick="saveNewAccountAction()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow mt-2">
        حفظ وتفعيل الحساب فوراً
      </button>
    </div>
  </div>

  <!-- 2. نافذة عمليات المحفظة (إيداع / سحب) -->
  <div id="modal-account-action" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="font-black text-sm text-slate-800" id="accActionTitle">إيداع رصيد</h3>
        <button onclick="closeModal('modal-account-action')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="targetAccountId">
      <input type="hidden" id="targetActionType">
      <div>
        <span class="text-slate-400 block">المحفظة المستهدفة:</span>
        <span class="font-black text-sm text-blue-600" id="accActionTargetName"></span>
      </div>
      <div>
        <label class="font-bold block mb-1">المبلغ (ج.م) *</label>
        <input type="number" id="accActionAmount" placeholder="المبلغ" class="w-full border rounded-xl p-2.5 text-base font-black text-slate-800 text-center">
      </div>
      <div>
        <label class="font-bold block mb-1">السبب أو البيان (اختياري):</label>
        <input type="text" id="accActionNotes" placeholder="مثال: تغذية رصيد أو سحب مصروف..." class="w-full border rounded-xl p-2">
      </div>
      <button onclick="confirmAccountAction()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow">
        تأكيد العملية وتحديث الرصيد
      </button>
    </div>
  </div>

  <!-- 3. نافذة تسوية الرصيد والمطابقة (Settlement Reconciliation) -->
  <div id="modal-account-settle" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="font-black text-sm text-amber-600 flex items-center gap-1.5"><i data-lucide="scale" class="w-4 h-4"></i> تسوية ومطابقة الرصيد</h3>
        <button onclick="closeModal('modal-account-settle')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="settleAccId">
      <div>
        <span class="text-slate-400 block">المحفظة / الحساب:</span>
        <span class="font-black text-sm text-slate-800" id="settleAccName"></span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-xl border flex justify-between font-bold">
        <span>الرصيد المسجل بالسيستم:</span>
        <span class="text-blue-600 font-black" id="settleSystemBal">0.00 ج.م</span>
      </div>
      <div>
        <label class="font-bold block mb-1">الرصيد الفعلي الحالي (المعدود / في التطبيق):</label>
        <input type="number" id="settleActualBal" placeholder="اكتب الرصيد الفعلي الآن" class="w-full border rounded-xl p-2.5 text-base font-black text-slate-800 text-center" oninput="calcSettleDiff()">
      </div>
      <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex justify-between font-bold">
        <span>الفارق المحسوب:</span>
        <span id="settleDiffDisplay" class="font-black">0.00 ج.م</span>
      </div>
      <button onclick="confirmAccountSettlement()" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl shadow">
        اعتماد التسوية وتعديل الرصيد
      </button>
    </div>
  </div>

  <!-- 4. باقي الموديلات المعتمدة الشاملة -->
  <div id="modal-add-user" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2 font-bold text-amber-400">
        <span>إضافة مستخدم جديد</span>
        <button onclick="closeModal('modal-add-user')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="text" id="newUserNameInput" placeholder="الاسم بالكامل" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100">
      <input type="text" id="newUserLoginInput" placeholder="اسم الدخول (Username)" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono">
      <input type="text" id="newUserPassInput" placeholder="كلمة المرور" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono">
      <select id="newUserRoleSelect" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold">
        <option value="كاشير مبيعات">كاشير مبيعات</option>
        <option value="فني صيانة">فني صيانة</option>
        <option value="مدير فرع">مدير فرع</option>
      </select>
      <button onclick="saveNewUserAction()" class="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl shadow">حفظ وتفعيل الحساب</button>
    </div>
  </div>

  <div id="modal-edit-user-pass" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2 font-bold text-blue-400">
        <span>تعديل باسوورد المدير</span>
        <button onclick="closeModal('modal-edit-user-pass')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="editUserId">
      <input type="text" id="editUserName" placeholder="الاسم" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold">
      <input type="text" id="editUserLogin" placeholder="اسم الدخول" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono font-bold">
      <input type="text" id="editUserPass" placeholder="الباسوورد الجديد" class="w-full bg-[#16233b] border border-amber-500/50 rounded-xl p-2 font-mono font-bold text-amber-300">
      <button onclick="saveUserPasswordChange()" class="w-full bg-blue-600 text-white font-black py-2 rounded-xl shadow">حفظ الباسوورد</button>
    </div>
  </div>

  <div id="modal-add-product" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs">
      <div class="flex justify-between items-center border-b pb-2 font-bold">
        <span>إضافة منتج</span>
        <button onclick="closeModal('modal-add-product')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="text" id="prodNameInput" placeholder="اسم المنتج" class="w-full border rounded-xl p-2 font-bold">
      <div class="flex gap-2">
        <input type="text" id="prodBarcodeInput" value="FG7253771" class="flex-1 border rounded-xl p-2 font-mono font-bold">
        <button onclick="generateNewBarcodeCode()" class="bg-slate-100 border px-3 py-1.5 rounded-xl font-bold">توليد</button>
      </div>
      <select id="prodCategorySelect" class="w-full border rounded-xl p-2 font-bold"><option>اكسسوارات / قطع غيار</option><option>هواتف محمولة</option></select>
      <div class="grid grid-cols-2 gap-2">
        <input type="number" id="prodCostInput" value="0" placeholder="سعر الشراء" class="border rounded-xl p-2 font-bold">
        <input type="number" id="prodPriceInput" value="0" placeholder="سعر البيع" class="border rounded-xl p-2 font-bold text-emerald-600">
      </div>
      <button onclick="saveProductFromNewModal()" class="w-full bg-blue-600 text-white font-black py-2 rounded-xl shadow">حفظ المنتج 💾</button>
    </div>
  </div>

  <div id="modal-checkout-pos" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-emerald-600">
        <span>إتمام عملية الدفع (F10)</span>
        <button onclick="closeModal('modal-checkout-pos')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <div class="bg-slate-50 p-3 rounded-2xl border flex justify-between items-center font-bold">
        <span>الإجمالي المطلوب:</span>
        <span class="text-base font-black text-emerald-600" id="checkoutTotalAmount">0.00 ج.م</span>
      </div>
      <select id="payMethodSelect" class="w-full border rounded-xl p-2 font-bold" onchange="toggleDebtInputs()">
        <option value="CASH">نقدي (كاش سائل)</option>
        <option value="VODAFONE">محفظة فودافون كاش</option>
        <option value="INSTAPAY">انستاباي / بنك</option>
        <option value="CREDIT">آجل (دفع جزء ومتبقي دين)</option>
      </select>
      <div id="creditFields" class="hidden space-y-2 p-3 bg-amber-50 rounded-2xl border border-amber-200">
        <div class="grid grid-cols-2 gap-2">
          <input type="number" id="creditPaidNow" value="0" placeholder="المدفوع الآن" class="border rounded-xl p-2 font-bold" oninput="calcRemainingDebt()">
          <input type="text" id="creditRemainingDebt" value="0.00 ج.م" readonly class="border rounded-xl p-2 font-bold text-rose-600 bg-white">
        </div>
        <input type="text" id="creditCustName" placeholder="اسم العميل صاحب الدين" class="w-full border rounded-xl p-2 font-bold">
        <input type="text" id="creditCustPhone" placeholder="رقم هاتف العميل" class="w-full border rounded-xl p-2 font-mono">
      </div>
      <button onclick="confirmFinalCheckout()" class="w-full bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow">تأكيد الفاتورة</button>
    </div>
  </div>

  <div id="modal-add-spare-part" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-amber-500">
        <span>إضافة قطعة غيار جديدة</span>
        <button onclick="closeModal('modal-add-spare-part')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="text" id="spName" placeholder="اسم القطعة" class="w-full border rounded-xl p-2 font-bold">
      <input type="text" id="spModels" placeholder="الموديل المتوافق" class="w-full border rounded-xl p-2">
      <div class="grid grid-cols-2 gap-2">
        <input type="number" id="spCost" value="800" placeholder="الشراء" class="border rounded-xl p-2 font-bold text-center">
        <input type="number" id="spRetail" value="1200" placeholder="البيع" class="border rounded-xl p-2 font-bold text-emerald-600 text-center">
      </div>
      <button onclick="saveSparePartAction()" class="w-full bg-amber-500 text-slate-950 font-black py-2.5 rounded-xl shadow">حفظ قطعة الغيار</button>
    </div>
  </div>

  <div id="modal-add-waste" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-rose-600">
        <span>تسجيل هالك أو مرتجع</span>
        <button onclick="closeModal('modal-add-waste')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <select id="wasteTypeSelect" class="w-full border rounded-xl p-2 font-bold">
        <option value="هالك مورد (RMA استبدال شركة)">هالك مورد (عيوب صناعة RMA)</option>
        <option value="هالك عميل (كسر / سوء استخدام)">هالك عميل (كسر / سوء استخدام)</option>
      </select>
      <input type="text" id="wasteItemName" placeholder="اسم الصنف أو الجهاز" class="w-full border rounded-xl p-2 font-bold">
      <div class="grid grid-cols-2 gap-2">
        <input type="number" id="wasteQty" value="1" class="border rounded-xl p-2 font-bold">
        <input type="number" id="wasteCost" value="850" class="border rounded-xl p-2 font-bold text-rose-600">
      </div>
      <button onclick="saveDetailedWasteRecord()" class="w-full bg-rose-600 text-white font-black py-2 rounded-xl shadow">حفظ الهالك</button>
    </div>
  </div>

  <div id="modal-print-preview" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-3 border-b flex justify-between items-center text-xs font-bold text-slate-700">
        <span>معاينة الفاتورة قبل الطباعة</span>
        <button onclick="closeModal('modal-print-preview')"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="p-4 overflow-y-auto custom-scroll bg-slate-100 flex justify-center">
        <div id="receiptPreviewBox" class="bg-white p-4 shadow border text-black text-xs font-mono w-[76mm]"></div>
      </div>
      <div class="p-3 border-t bg-slate-50 flex gap-2">
        <button onclick="window.print()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow">
          <i data-lucide="printer" class="w-4 h-4"></i> أمر الطباعة الفعلي
        </button>
        <button onclick="closeModal('modal-print-preview')" class="px-4 py-2 border rounded-xl text-xs font-bold">إغلاق</button>
      </div>
    </div>
  </div>

  <div id="printableInvoiceArea" class="hidden"></div>

  <!-- ================= JAVASCRIPT ENGINE ================= -->
  <script>
    // قاعدة البيانات المركزية المتكاملة
    const defaultData = {
      theme: 'default',
      users: [{ id: '1', name: 'محمد مصطفى عماشه', username: 'admin', pass: '123456', role: 'مدير النظام' }],
      // المحافظ والحسابات المالية القابلة للإيداع والسحب والتسوية
      accounts: [
        { id: '1', name: 'خزينة المحل الرئيسية', type: 'خزينة نقدية', balance: 1240, number: 'درج الكاش' },
        { id: '2', name: 'فودافون كاش - محمد مصطفى', type: 'محفظة إلكترونية', balance: 4500, number: '01070900711' },
        { id: '3', name: 'انستاباي - البنك الأهلي', type: 'انستاباي / بنك', balance: 8300, number: 'InstaPay' }
      ],
      accountTransactions: [
        { type: 'إيداع نقدي', account: 'خزينة المحل الرئيسية', amount: 1240, notes: 'رصيد افتتاحي للدرج', time: '10:00 ص' }
      ],
      customInvoice: {
        logo: '',
        storeName: 'EL-RESALA',
        subtitle: 'لخدمات ومبيعات وصيانة الهواتف المحمولة',
        addressPhone: 'شبرا الخيمة - هاتف: 01070900711',
        footerTerms: 'البضاعة المباعة ترد وتستبدل خلال 14 يوماً مع أصل الفاتورة والعلبة بحالتها الأصلية - شكراً لثقتكم بنا!'
      },
      barcodeConfig: {
        width: 1.2, height: 35, offset: 0, showPrice: true, showStore: true, showName: true
      },
      printerSettings: { paperSize: '80mm', fontSize: '13px', horizontalOffset: 2 },
      whatsappSettings: { storeNumber: '01070900711' },
      products: [
        { id: '1', name: 'iPhone 15 128GB', barcode: 'FG9281721', type: 'هواتف محمولة', cost: 32000, price: 34500, stock: 4 },
        { id: '2', name: 'جراب سيليكون MagSafe', barcode: 'FG8374910', type: 'اكسسوارات / قطع غيار', cost: 120, price: 250, stock: 35 },
        { id: '3', name: 'سماعة بلوتوث لاسلكية P9', barcode: 'FG7253771', type: 'اكسسوارات / قطع غيار', cost: 450, price: 850, stock: 12 },
        { id: '4', name: 'شاشة سامسونج A12 أصلية', barcode: 'FG6251892', type: 'اكسسوارات / قطع غيار', cost: 650, price: 850, stock: 6 }
      ],
      spareParts: [
        { id: '1', name: 'شاشة سامسونج A12 توكيل', models: 'A12 / M12', supplier: 'الصفا لقطع الغيار', cost: 650, wholesale: 750, retail: 850, stock: 6 }
      ],
      wasteRecords: [],
      customers: [
        { name: 'محمود سامي عثمان', phone: '01012345678', address: 'شبرا الخيمة', total: 34500, balance: '0.00 ج.م' }
      ],
      suppliers: [
        { name: 'شركة ألفا جروب للموبايلات', phone: '01099887766', type: 'هواتف جديدة وضمان', total: 380000, due: '0.00 ج.م' }
      ],
      debts: [
        { id: 'INV-1082', customer: 'أحمد خالد إبراهيم', phone: '01122334455', total: 4200, paid: 3700, remaining: 500, date: '2026-09-05' }
      ],
      cart: [{ id: '4', name: 'شاشة سامسونج A12 أصلية', price: 850, qty: 1 }]
    };

    let App = JSON.parse(localStorage.getItem('EL_RESALA_ENTERPRISE_MASTER_V13')) || defaultData;

    function saveApp() {
      localStorage.setItem('EL_RESALA_ENTERPRISE_MASTER_V13', JSON.stringify(App));
      updateTreasuryStats();
    }

    function openModal(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('hidden'); lucide.createIcons(); }
    }
    function closeModal(id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    }
    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-right-64'); }

    // ================= محرك الثيمات ووضع إراحة العين =================
    function selectTheme(themeName) {
      App.theme = themeName;
      document.body.className = '';
      if (themeName === 'eye-comfort') document.body.classList.add('theme-eye-comfort');
      else if (themeName === 'midnight') document.body.classList.add('theme-midnight');
      saveApp();
    }

    function toggleEyeComfortQuick() {
      const isComfort = document.body.classList.contains('theme-eye-comfort');
      selectTheme(isComfort ? 'default' : 'eye-comfort');
    }

    // ================= محرك المحافظ والخزائن والتسوية الشامل =================
    function renderTreasury() {
      const grid = document.getElementById('accountsCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';

      (App.accounts || []).forEach(acc => {
        const typeBadge = acc.type.includes('محفظة') 
          ? '<span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-bold">محفظة إلكترونية</span>'
          : (acc.type.includes('انستاباي') 
            ? '<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">انستاباي / بنك</span>'
            : '<span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-bold">كاش سائل</span>');

        grid.innerHTML += `
          <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center">
                <h3 class="font-black text-sm text-slate-800">${acc.name}</h3>
                ${typeBadge}
              </div>
              <div class="text-[11px] text-slate-400 font-mono mt-0.5">${acc.number || 'بدون رقم'}</div>
              <div class="text-2xl font-black text-slate-900 mt-2">${(acc.balance || 0).toLocaleString()} <span class="text-xs font-bold text-slate-400">ج.م</span></div>
            </div>

            <!-- أزرار العمليات الثلاثة: إيداع وسحب وتسوية -->
            <div class="pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button onclick="openAccountActionModal('${acc.id}', 'DEPOSIT')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="arrow-down-circle" class="w-3.5 h-3.5"></i> إيداع
              </button>
              <button onclick="openAccountActionModal('${acc.id}', 'WITHDRAW')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i> سحب
              </button>
              <button onclick="openAccountSettleModal('${acc.id}')" class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="scale" class="w-3.5 h-3.5"></i> تسوية
              </button>
            </div>
          </div>
        `;
      });

      // ريندر جدول الحركات المالية
      const tbody = document.getElementById('treasuryTableBody');
      if (tbody) {
        tbody.innerHTML = '';
        (App.accountTransactions || []).slice(0, 15).forEach(tx => {
          tbody.innerHTML += `
            <tr class="hover:bg-slate-50">
              <td class="p-2.5 font-bold ${tx.type.includes('إيداع') ? 'text-emerald-600' : (tx.type.includes('سحب') ? 'text-rose-600' : 'text-amber-600')}">${tx.type}</td>
              <td class="p-2.5 text-slate-800 font-bold">${tx.account}</td>
              <td class="p-2.5 font-black text-slate-900">${(tx.amount || 0).toLocaleString()} ج.م</td>
              <td class="p-2.5 text-slate-500">${tx.notes || '—'}</td>
              <td class="p-2.5 font-mono text-slate-400 text-[10px]">${tx.time}</td>
            </tr>
          `;
        });
      }
      lucide.createIcons();
    }

    function updateTreasuryStats() {
      const cash = (App.accounts || []).find(a => a.type.includes('خزينة') || a.id === '1')?.balance || 1240;
      document.getElementById('headerDrawerAmount').innerText = `${cash.toLocaleString()} ج.م`;
    }

    function saveNewAccountAction() {
      const name = document.getElementById('newAccName').value.trim();
      const type = document.getElementById('newAccType').value;
      const number = document.getElementById('newAccNumber').value.trim();
      const bal = parseFloat(document.getElementById('newAccInitialBal').value) || 0;

      if (!name) return alert('يرجى كتابة اسم المحفظة أو الحساب!');

      App.accounts.push({ id: Date.now().toString(), name, type, number, balance: bal });
      if (bal > 0) {
        App.accountTransactions.unshift({
          type: 'إيداع افتتاحي', account: name, amount: bal, notes: 'رصيد افتتاحي للحساب',
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });
      }

      saveApp();
      closeModal('modal-add-account');
      renderTreasury();
      alert(`✅ تم حفظ وتفعيل المحفظة (${name}) بنجاح!`);
    }

    function openAccountActionModal(accId, actionType) {
      const acc = App.accounts.find(a => a.id === accId);
      if (!acc) return;
      document.getElementById('targetAccountId').value = acc.id;
      document.getElementById('targetActionType').value = actionType;
      document.getElementById('accActionTargetName').innerText = acc.name;
      document.getElementById('accActionTitle').innerText = actionType === 'DEPOSIT' ? 'إيداع رصيد بالمحفظة' : 'سحب رصيد من المحفظة';
      document.getElementById('accActionAmount').value = '';
      document.getElementById('accActionNotes').value = '';
      openModal('modal-account-action');
    }

    function confirmAccountAction() {
      const id = document.getElementById('targetAccountId').value;
      const type = document.getElementById('targetActionType').value;
      const amt = parseFloat(document.getElementById('accActionAmount').value) || 0;
      const notes = document.getElementById('accActionNotes').value.trim() || (type === 'DEPOSIT' ? 'إيداع نقدية' : 'سحب نقدية');

      if (amt <= 0) return alert('أدخل مبلغاً صحيحاً!');
      const acc = App.accounts.find(a => a.id === id);
      if (!acc) return;

      if (type === 'WITHDRAW' && acc.balance < amt) {
        return alert(`رصيد المحفظة لا يكفي! المتاح: ${acc.balance} ج.م`);
      }

      if (type === 'DEPOSIT') acc.balance += amt;
      else acc.balance -= amt;

      App.accountTransactions.unshift({
        type: type === 'DEPOSIT' ? 'إيداع' : 'سحب',
        account: acc.name, amount: amt, notes: notes,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      });

      saveApp();
      closeModal('modal-account-action');
      renderTreasury();
      alert(`✅ تم تأكيد عملية ${type === 'DEPOSIT' ? 'الإيداع' : 'السحب'} بمبلغ ${amt} ج.م.`);
    }

    function openAccountSettleModal(accId) {
      const acc = App.accounts.find(a => a.id === accId);
      if (!acc) return;
      document.getElementById('settleAccId').value = acc.id;
      document.getElementById('settleAccName').innerText = acc.name;
      document.getElementById('settleSystemBal').innerText = `${acc.balance.toLocaleString()} ج.م`;
      document.getElementById('settleActualBal').value = acc.balance;
      calcSettleDiff();
      openModal('modal-account-settle');
    }

    function calcSettleDiff() {
      const id = document.getElementById('settleAccId').value;
      const acc = App.accounts.find(a => a.id === id);
      const actual = parseFloat(document.getElementById('settleActualBal').value) || 0;
      const diff = actual - (acc?.balance || 0);
      const disp = document.getElementById('settleDiffDisplay');
      if (diff === 0) { disp.innerText = '0.00 ج.م (مطابق)'; disp.className = 'font-black text-emerald-600'; }
      else if (diff > 0) { disp.innerText = `+${diff.toFixed(2)} ج.م (زيادة)`; disp.className = 'font-black text-blue-600'; }
      else { disp.innerText = `${diff.toFixed(2)} ج.م (عجز)`; disp.className = 'font-black text-rose-600'; }
    }

    function confirmAccountSettlement() {
      const id = document.getElementById('settleAccId').value;
      const acc = App.accounts.find(a => a.id === id);
      const actual = parseFloat(document.getElementById('settleActualBal').value) || 0;
      const diff = actual - (acc.balance || 0);

      acc.balance = actual;
      App.accountTransactions.unshift({
        type: 'تسوية رصيد',
        account: acc.name,
        amount: Math.abs(diff),
        notes: diff >= 0 ? `تسوية ومطابقة (زيادة ${diff} ج.م)` : `تسوية ومطابقة (عجز ${Math.abs(diff)} ج.م)`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      });

      saveApp();
      closeModal('modal-account-settle');
      renderTreasury();
      alert(`⚖️ تم اعتماد التسوية بنجاح وضبط رصيد (${acc.name}) على: ${actual} ج.م.`);
    }

    // ================= تخصيص الفواتير ورفع اللوجو والباركود =================
    function previewInvoiceLogo(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          App.customInvoice.logo = evt.target.result;
          saveApp();
          updateLiveReceiptPreview();
        };
        reader.readAsDataURL(file);
      }
    }

    function removeInvoiceLogo() {
      App.customInvoice.logo = '';
      saveApp();
      updateLiveReceiptPreview();
    }

    function updateLiveReceiptPreview() {
      const inv = App.customInvoice;
      const name = document.getElementById('cfgInvStoreName')?.value || inv.storeName;
      const sub = document.getElementById('cfgInvSubtitle')?.value || inv.subtitle;
      const addr = document.getElementById('cfgInvAddressPhone')?.value || inv.addressPhone;
      const terms = document.getElementById('cfgInvFooterTerms')?.value || inv.footerTerms;

      const logoHTML = inv.logo ? `<img src="${inv.logo}" class="h-10 mx-auto mb-1 object-contain">` : '';

      document.getElementById('liveInvoicePreviewBox').innerHTML = `
        ${logoHTML}
        <div class="font-black text-sm">${name}</div>
        <div class="text-[9px] text-gray-600">${sub}</div>
        <div class="text-[9px]">${addr}</div>
        <hr class="my-1 border-dashed">
        <div class="flex justify-between"><span>رقم الفاتورة:</span><span>#INV-1098</span></div>
        <div class="flex justify-between"><span>التاريخ:</span><span>${new Date().toLocaleDateString('ar-EG')}</span></div>
        <hr class="my-1 border-black">
        <div class="flex justify-between font-bold"><span>شاشة سامسونج A12</span><span>850 ج.م</span></div>
        <hr class="my-1 border-black">
        <div class="flex justify-between font-black text-xs"><span>الصافي:</span><span>850.00 ج.م</span></div>
        <hr class="my-1 border-dashed">
        <div class="text-[8px] text-gray-500 leading-tight">${terms}</div>
      `;
    }

    function saveInvoiceCustomization(showMsg) {
      App.customInvoice.storeName = document.getElementById('cfgInvStoreName').value;
      App.customInvoice.subtitle = document.getElementById('cfgInvSubtitle').value;
      App.customInvoice.addressPhone = document.getElementById('cfgInvAddressPhone').value;
      App.customInvoice.footerTerms = document.getElementById('cfgInvFooterTerms').value;
      saveApp();
      if (showMsg) alert('✅ تم حفظ نصوص وتنسيق الفاتورة بنجاح!');
    }

    function updateBarcodeLivePreview() {
      const w = parseFloat(document.getElementById('cfgBcWidth').value) || 1.2;
      const h = parseInt(document.getElementById('cfgBcHeight').value) || 35;
      const showP = document.getElementById('cfgBcShowPrice').checked;
      const showS = document.getElementById('cfgBcShowStore').checked;
      const showN = document.getElementById('cfgBcShowName').checked;

      document.getElementById('pvBcStore').style.display = showS ? 'block' : 'none';
      document.getElementById('pvBcName').style.display = showN ? 'block' : 'none';
      document.getElementById('pvBcPrice').style.display = showP ? 'block' : 'none';

      JsBarcode("#liveBarcodeSvg", "FG7253771", {
        format: "CODE128",
        width: w,
        height: h,
        displayValue: true,
        fontSize: 10,
        margin: 0
      });
    }

    // التنقل العام والريندر
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

      if (window.innerWidth < 768) document.getElementById('sidebar').classList.add('-right-64');

      try {
        if (pageId === 'dashboard') initCharts();
        if (pageId === 'treasury') renderTreasury();
        if (pageId === 'pos') renderPos();
        if (pageId === 'inventory') renderInventory();
        if (pageId === 'spare-parts') renderSpareParts();
        if (pageId === 'waste') renderWaste();
        if (pageId === 'debts') renderDebts();
        if (pageId === 'customers') renderCustomers();
        if (pageId === 'suppliers') renderSuppliers();
        if (pageId === 'devices') renderDevices();
        if (pageId === 'accessories') renderAccessories();
        if (pageId === 'repairs') renderRepairs();
        if (pageId === 'settings') {
          switchSettingTab('themes');
          updateLiveReceiptPreview();
          updateBarcodeLivePreview();
        }
      } catch (e) { console.error(e); }
      lucide.createIcons();
    }

    function switchSettingTab(key) {
      document.querySelectorAll('.setting-pane').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.setting-nav-btn').forEach(btn => {
        btn.className = 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs';
      });
      document.getElementById('spane-' + key)?.classList.remove('hidden');
      document.getElementById('stab-' + key)?.setAttribute('class', 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black flex items-center gap-2.5 text-xs shadow-md');
      if (key === 'users') renderUsersTable();
      if (key === 'invoices') updateLiveReceiptPreview();
      if (key === 'barcodes') updateBarcodeLivePreview();
      lucide.createIcons();
    }

    // دوال المبيعات والمخزون
    function renderInventory() {
      const tbody = document.getElementById('inventoryTableRows');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.products || []).forEach(p => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3"><div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><i data-lucide="package" class="w-4 h-4"></i></div></td>
            <td class="p-3 font-bold text-slate-800">${p.name}</td>
            <td class="p-3 font-mono font-bold text-blue-600">${p.barcode || '—'}</td>
            <td class="p-3"><span class="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">${p.type}</span></td>
            <td class="p-3 font-black text-emerald-600">${p.stock || 0}</td>
            <td class="p-3 text-slate-600">${p.cost || 0} ج.م</td>
            <td class="p-3 font-black text-slate-900">${p.price || 0} ج.م</td>
            <td class="p-3 text-center"><button onclick="p.stock=parseInt(prompt('تعديل الرصيد:', p.stock)); saveApp(); renderInventory();" class="text-blue-600 font-bold hover:underline">تعديل</button></td>
          </tr>
        `;
      });
      lucide.createIcons();
    }

    function openAddProductModal() {
      document.getElementById('prodNameInput').value = '';
      document.getElementById('prodBarcodeInput').value = 'FG' + Math.floor(1000000 + Math.random() * 9000000);
      openModal('modal-add-product');
    }
    function generateNewBarcodeCode() { document.getElementById('prodBarcodeInput').value = 'FG' + Math.floor(1000000 + Math.random() * 9000000); }
    function previewProductImage(event) {}
    function saveProductFromNewModal() {
      const name = document.getElementById('prodNameInput').value.trim();
      const barcode = document.getElementById('prodBarcodeInput').value.trim();
      const category = document.getElementById('prodCategorySelect').value;
      const cost = parseFloat(document.getElementById('prodCostInput').value) || 0;
      const price = parseFloat(document.getElementById('prodPriceInput').value) || 0;
      if (!name) return alert('اكتب اسم المنتج!');
      App.products.unshift({ id: Date.now().toString(), name, barcode, type: category, cost, price, stock: 5 });
      saveApp();
      closeModal('modal-add-product');
      renderInventory();
      renderPos();
      alert(`✅ تم حفظ المنتج (${name}) بنجاح!`);
    }

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
            <div class="p-2.5 rounded-xl bg-slate-50 border space-y-1 text-xs">
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-800">${i.name}</span>
                <button onclick="App.cart.splice(${idx},1);saveApp();renderCart();" class="text-rose-500 font-bold hover:underline">حذف</button>
              </div>
              <div class="flex items-center justify-between gap-2 pt-1 border-t">
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

    function openCheckoutModal() {
      if (App.cart.length === 0) return alert('السلة فارغة!');
      let sum = 0; App.cart.forEach(i => sum += (i.price * i.qty));
      const disc = parseFloat(document.getElementById('posCartDiscount')?.value) || 0;
      document.getElementById('checkoutTotalAmount').innerText = `${Math.max(0, sum - disc)} ج.م`;
      openModal('modal-checkout-pos');
    }

    function toggleDebtInputs() {
      const mode = document.getElementById('payMethodSelect').value;
      const creditBox = document.getElementById('creditFields');
      if (mode === 'CREDIT') { creditBox.classList.remove('hidden'); calcRemainingDebt(); }
      else { creditBox.classList.add('hidden'); }
    }

    function calcRemainingDebt() {
      let sum = 0; App.cart.forEach(i => sum += (i.price * i.qty));
      const disc = parseFloat(document.getElementById('posCartDiscount')?.value) || 0;
      const net = Math.max(0, sum - disc);
      const paid = parseFloat(document.getElementById('creditPaidNow').value) || 0;
      document.getElementById('creditRemainingDebt').value = `${Math.max(0, net - paid).toFixed(2)} ج.م`;
    }

    function confirmFinalCheckout() {
      const mode = document.getElementById('payMethodSelect').value;
      let sum = 0; App.cart.forEach(i => sum += (i.price * i.qty));
      const disc = parseFloat(document.getElementById('posCartDiscount')?.value) || 0;
      const net = Math.max(0, sum - disc);

      if (mode === 'CREDIT') {
        const paid = parseFloat(document.getElementById('creditPaidNow').value) || 0;
        const remain = Math.max(0, net - paid);
        const cust = document.getElementById('creditCustName').value.trim();
        const phone = document.getElementById('creditCustPhone').value.trim() || '—';
        if (!cust) return alert('يرجى كتابة اسم العميل!');
        App.debts.unshift({ id: `INV-${Date.now().toString().slice(-4)}`, customer: cust, phone, total: net, paid, remaining: remain, date: new Date().toISOString().slice(0, 10) });
      }

      saveApp();
      closeModal('modal-checkout-pos');
      testPrintSampleReceipt();
      clearCart();
    }

    function testPrintSampleReceipt() {
      const inv = App.customInvoice;
      const logoHTML = inv.logo ? `<img src="${inv.logo}" style="max-height: 45px; margin: 0 auto 5px auto; display: block;">` : '';
      const receiptHTML = `
        <div style="font-family: monospace; font-size: 13px; text-align: center; padding: 6px; color: black;">
          ${logoHTML}
          <div style="font-weight: 900; font-size: 1.3em;">${inv.storeName}</div>
          <div style="font-size: 0.85em; color: #333;">${inv.subtitle}</div>
          <div style="font-size: 0.85em;">${inv.addressPhone}</div>
          <hr style="border-top: 1px dashed black; margin: 5px 0;">
          <div style="text-align: right;">رقم الفاتورة: #INV-1098</div>
          <div style="text-align: right;">التاريخ: ${new Date().toLocaleString('ar-EG')}</div>
          <hr style="border-top: 1px solid black; margin: 5px 0;">
          <table style="width: 100%; text-align: right; font-size: 0.95em;">
            <tr><th>الصنف</th><th style="text-align: left;">السعر</th></tr>
            <tr><td>شاشة سامسونج A12 أصلية × 1</td><td style="text-align: left;">850.00</td></tr>
          </table>
          <hr style="border-top: 1px solid black; margin: 5px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
            <span>الإجمالي:</span><span>850.00 ج.م</span>
          </div>
          <div style="font-size: 0.8em; margin-top: 6px;">${inv.footerTerms}</div>
        </div>
      `;
      document.getElementById('receiptPreviewBox').innerHTML = receiptHTML;
      document.getElementById('printableInvoiceArea').innerHTML = receiptHTML;
      openModal('modal-print-preview');
    }

    // دوال الريندر الباقية
    function renderSpareParts() {
      const tbody = document.getElementById('sparePartsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.spareParts || []).forEach(p => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-800">${p.name}</td>
            <td class="p-3 text-slate-500 font-mono">${p.models}</td>
            <td class="p-3"><span class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-bold">${p.supplier}</span></td>
            <td class="p-3 text-slate-600">${p.cost} ج.م</td>
            <td class="p-3 font-bold text-amber-600">${p.wholesale} ج.م</td>
            <td class="p-3 font-black text-emerald-600">${p.retail} ج.م</td>
            <td class="p-3 font-black">${p.stock}</td>
            <td class="p-3 text-center"><button onclick="addSparePartToCartDirect('${p.name}', ${p.retail})" class="text-blue-600 font-bold hover:underline">بيع</button></td>
          </tr>
        `;
      });
    }

    function saveSparePartAction() {
      const name = document.getElementById('spName').value.trim();
      const models = document.getElementById('spModels').value.trim() || 'عام';
      const cost = parseFloat(document.getElementById('spCost').value) || 0;
      const wholesale = parseFloat(document.getElementById('spWholesale').value) || 0;
      const retail = parseFloat(document.getElementById('spRetail').value) || 0;
      if (!name) return alert('اكتب اسم القطعة!');
      App.spareParts.unshift({ id: Date.now().toString(), name, models, cost, wholesale, retail, stock: 5, supplier: 'الصفا' });
      App.products.unshift({ id: Date.now().toString(), name, barcode: 'SP'+Math.floor(100000+Math.random()*900000), type: 'قطع غيار', cost, price: retail, stock: 5 });
      saveApp();
      closeModal('modal-add-spare-part');
      renderSpareParts();
      alert(`✅ تم حفظ قطعة الغيار (${name}) بنجاح.`);
    }

    function addSparePartToCartDirect(name, price) {
      App.cart.push({ id: Date.now().toString(), name, price, qty: 1 });
      saveApp();
      navigateTo('pos');
    }

    function renderWaste() {
      const tbody = document.getElementById('wasteTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.wasteRecords || []).forEach(w => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-rose-600">${w.type}</td>
            <td class="p-3 font-bold text-slate-800">${w.item}</td>
            <td class="p-3 font-mono text-blue-600">${w.imei || '—'}</td>
            <td class="p-3 font-black">${w.qty}</td>
            <td class="p-3 font-black text-slate-900">${(w.cost || 0).toLocaleString()} ج.م</td>
            <td class="p-3 text-slate-600">${w.responsible || 'فني'}</td>
            <td class="p-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">${w.status || 'مسجل'}</span></td>
            <td class="p-3 font-mono text-slate-400">${w.date}</td>
          </tr>
        `;
      });
    }

    function saveDetailedWasteRecord() {
      const type = document.getElementById('wasteTypeSelect').value;
      const item = document.getElementById('wasteItemName').value.trim();
      const qty = parseInt(document.getElementById('wasteQty').value) || 1;
      const cost = parseFloat(document.getElementById('wasteCost').value) || 0;
      if (!item) return alert('اكتب اسم الصنف التالف!');
      App.wasteRecords.unshift({ id: Date.now().toString(), type, item, imei: '—', qty, cost, responsible: 'فني الصيانة', status: 'مسجل', date: new Date().toISOString().slice(0, 10) });
      saveApp();
      closeModal('modal-add-waste');
      renderWaste();
      alert(`✅ تم حفظ الهالك (${item}).`);
    }

    function renderDebts() {
      const tbody = document.getElementById('debtsTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.debts || []).forEach((d, idx) => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-mono font-bold text-blue-600">${d.id}</td>
            <td class="p-3 font-bold text-slate-800">${d.customer}</td>
            <td class="p-3 font-mono text-slate-500">${d.phone}</td>
            <td class="p-3 font-bold text-slate-600">${(d.total || 0).toLocaleString()} ج.م</td>
            <td class="p-3 font-bold text-emerald-600">${(d.paid || 0).toLocaleString()} ج.م</td>
            <td class="p-3 font-black text-rose-600">${(d.remaining || 0).toLocaleString()} ج.م</td>
            <td class="p-3 font-mono text-slate-400">${d.date}</td>
            <td class="p-3 text-center"><button onclick="settleDebtAction(${idx})" class="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-xl font-bold text-xs">سداد دفعة</button></td>
          </tr>
        `;
      });
    }

    function settleDebtAction(idx) {
      const d = App.debts[idx];
      const val = prompt(`سداد دين للعميل (${d.customer}):\nالمتبقي عليه: ${d.remaining} ج.م\nأدخل المبلغ المسدد:`, d.remaining);
      if (val && !isNaN(val)) {
        const amt = parseFloat(val);
        d.paid += amt;
        d.remaining = Math.max(0, d.remaining - amt);
        if (d.remaining <= 0) App.debts.splice(idx, 1);
        saveApp();
        renderDebts();
        alert('✅ تم تسجيل السداد بنجاح.');
      }
    }

    function renderCustomers() {
      const tbody = document.getElementById('customersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.customers || []).forEach(c => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-800">${c.name}</td>
            <td class="p-3 font-mono text-slate-600">${c.phone}</td>
            <td class="p-3 text-slate-500">${c.address}</td>
            <td class="p-3 font-bold">${c.balance}</td>
            <td class="p-3 text-center"><button onclick="window.open('https://wa.me/2${c.phone}','_blank')" class="text-emerald-600 font-bold hover:underline">واتساب</button></td>
          </tr>
        `;
      });
    }

    function renderSuppliers() {
      const tbody = document.getElementById('suppliersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.suppliers || []).forEach(s => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-800">${s.name}</td>
            <td class="p-3 font-mono text-slate-600">${s.phone}</td>
            <td class="p-3"><span class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold">${s.type}</span></td>
            <td class="p-3 font-bold text-rose-500">${s.due}</td>
          </tr>
        `;
      });
    }

    function renderDevices() {
      const tbody = document.getElementById('devicesTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.devices || []).forEach(d => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-900">${d.model}</td>
            <td class="p-3 font-mono text-blue-600 font-bold">${d.imei}</td>
            <td class="p-3 text-slate-600">${d.color}</td>
            <td class="p-3 text-slate-600">${d.cost || 0} ج.م</td>
            <td class="p-3 font-black text-emerald-600">${d.price || 0} ج.م</td>
          </tr>
        `;
      });
    }

    function renderAccessories() {
      const grid = document.getElementById('accessoriesCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      (App.products || []).filter(p => p.type.includes('اكسسوار') || p.type.includes('إكسسوار')).forEach(a => {
        grid.innerHTML += `
          <div class="bg-white p-4 rounded-2xl border shadow-sm space-y-2">
            <span class="bg-pink-50 text-pink-600 font-bold px-2 py-0.5 rounded text-[10px]">إكسسوار</span>
            <h4 class="font-bold text-xs text-slate-800">${a.name}</h4>
            <div class="flex justify-between items-center pt-2 border-t text-xs">
              <span class="font-black text-slate-900">${a.price} ج.م</span>
              <button onclick="addToCart('${a.id}'); navigateTo('pos');" class="text-blue-600 font-bold hover:underline">بيع</button>
            </div>
          </div>
        `;
      });
    }

    function renderRepairs() {
      const grid = document.getElementById('repairCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      (App.repairs || []).forEach(r => {
        grid.innerHTML += `
          <div class="bg-white p-4 rounded-2xl border shadow-sm space-y-2">
            <div class="flex justify-between items-center text-xs"><span class="font-black text-blue-600">${r.id}</span><span class="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">${r.status}</span></div>
            <h4 class="font-bold text-sm text-slate-800">${r.device}</h4>
            <div class="text-xs text-slate-500">${r.customer} (${r.phone})</div>
            <div class="pt-2 border-t flex justify-between items-center text-xs"><span class="font-black text-emerald-600">${r.fee} ج.م</span><button onclick="testPrintSampleReceipt()" class="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-xl">طباعة إيصال</button></div>
          </div>
        `;
      });
    }

    // إدارة المستخدمين
    function renderUsersTable() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.users || []).forEach(u => {
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
              <button onclick="openChangePasswordModal('${u.id}')" class="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold">تعديل الباسوورد</button>
            </td>
          </tr>
        `;
      });
      lucide.createIcons();
    }

    function openChangePasswordModal(userId) {
      const user = (App.users || []).find(x => x.id === userId) || App.users[0];
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
      const user = (App.users || []).find(x => x.id === id) || App.users[0];
      user.name = newName; user.username = newLogin; user.pass = newPass;
      document.getElementById('headerUserDisplayName').innerText = newName;
      saveApp();
      renderUsersTable();
      closeModal('modal-edit-user-pass');
      alert(`✅ تم تحديث كلمة المرور لـ (${newName}) بنجاح إلى: [${newPass}]`);
    }

    function saveNewUserAction() {
      const name = document.getElementById('newUserNameInput').value.trim();
      const username = document.getElementById('newUserLoginInput').value.trim();
      const pass = document.getElementById('newUserPassInput').value.trim();
      const role = document.getElementById('newUserRoleSelect').value;

      if (!name || !username || !pass) return alert('يرجى ملء كافة الحقول!');
      App.users.push({ id: Date.now().toString(), name, username, pass, role });
      saveApp();
      closeModal('modal-add-user');
      renderUsersTable();
      alert(`✅ تم إضافة المستخدم (${name}) بنجاح.`);
    }

    // الرسوم البيانية Chart.js
    let salesChartInstance = null;
    let revenueChartInstance = null;
    function initCharts() {
      const ctx1 = document.getElementById('salesTrendChart')?.getContext('2d');
      if (ctx1) {
        if (salesChartInstance) salesChartInstance.destroy();
        salesChartInstance = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [
              { label: 'المبيعات (ج.م)', data: [8400, 11200, 9500, 14200, 12800, 18500, 12450], borderColor: '#2563eb', fill: true, backgroundColor: 'rgba(37, 99, 235, 0.08)', tension: 0.4, borderWidth: 3 },
              { label: 'الأرباح (ج.م)', data: [2100, 2800, 2400, 3600, 3100, 4800, 3200], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16, 185, 129, 0.05)', tension: 0.4, borderWidth: 2.5, borderDash: [4, 4] }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', rtl: true, labels: { font: { family: 'Cairo', size: 11, weight: 'bold' } } } } }
        });
      }

      const ctx2 = document.getElementById('categoryRevenueChart')?.getContext('2d');
      if (ctx2) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(ctx2, {
          type: 'doughnut',
          data: { labels: ['أجهزة وموبايلات', 'إكسسوارات وجرابات', 'صيانة وقطع غيار'], datasets: [{ data: [58, 27, 15], backgroundColor: ['#2563eb', '#10b981', '#f59e0b'], borderWidth: 3, borderColor: '#ffffff' }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
        });
      }
    }

    // تطبيق الثيم الأولي
    if (App.theme) selectTheme(App.theme);
    initCharts();
    renderTreasury();
    lucide.createIcons();
  </script>
</body>
</html>
HTML

# نسخ نفس التعديل للمسار الرئيسي لـ Vercel
cp frontend/index.html index.html

# رفع التحديثات لـ GitHub
git add frontend/index.html index.html
git commit -m "feat(enterprise): complete multi-wallets deposit/withdraw/settlement reconciliation, eye-comfort warm theme, custom invoice logo, and live barcode customization"
git push origin main

echo "=========================================================="
echo "✨ تم تطبيق ورفع التحديث الشامل بنجاح!"
echo "الميزات الجديدة: إدارة المحافظ والتسوية + الثيمات وإراحة العين + رفع لوجو الفاتورة + تحكم كامل بالباركود."
echo "=========================================================="
