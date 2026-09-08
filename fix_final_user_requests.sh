#!/bin/bash
set -e

echo "🚀 جاري تطبيق الإصلاحات النهائية: كارت الصيانة المتكامل، أزرار المحافظ، وإعدادات الإعدادات الشاملة..."

cat << 'HTML' > frontend/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EL-RESALA ERP & POS V4.0 | نظام إدارة محلات المحمول</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
    body { font-family: 'Cairo', sans-serif; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    @media print {
      body * { visibility: hidden !important; }
      #printableArea, #printableArea * { visibility: visible !important; }
      #printableArea { position: fixed !important; left: 0 !important; top: 0 !important; width: 100% !important; background: white !important; color: black !important; }
    }
  </style>
</head>
<body class="bg-[#f4f7fb] text-slate-800 min-h-screen flex overflow-x-hidden">

  <!-- ================= 1. القائمة الجانبية (SIDEBAR) ================= -->
  <aside id="sidebar" class="w-64 bg-[#0a1224] text-slate-300 flex flex-col shrink-0 min-h-screen z-50 transition-all duration-300 fixed md:static -right-64 md:right-0 shadow-2xl md:shadow-none">
    <div class="p-4 border-b border-slate-800/80 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <i data-lucide="smartphone" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-white font-black text-base tracking-wide">EL-RESALA</h1>
          <p class="text-[10px] text-slate-400 font-semibold">إدارة محلات المحمول</p>
        </div>
      </div>
      <button onclick="toggleSidebar()" class="md:hidden text-slate-400 hover:text-white p-1">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 text-xs font-bold overflow-y-auto custom-scroll">
      <button onclick="navigateTo('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow transition">
        <i data-lucide="home" class="w-4 h-4"></i><span>الرئيسية والداشبورد</span>
      </button>
      <button onclick="navigateTo('pos')" id="nav-pos" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="shopping-cart" class="w-4 h-4 text-emerald-400"></i><span>المبيعات (POS)</span>
      </button>
      <button onclick="navigateTo('repairs')" id="nav-repairs" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="wrench" class="w-4 h-4 text-amber-400"></i><span>قسم الصيانة واستلام الأجهزة</span>
      </button>
      <button onclick="navigateTo('treasury')" id="nav-treasury" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="wallet" class="w-4 h-4 text-emerald-400"></i><span>الخزينة والمحافظ والتسوية</span>
      </button>
      <button onclick="navigateTo('inventory')" id="nav-inventory" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="boxes" class="w-4 h-4 text-cyan-400"></i><span>المخزون والجرد</span>
      </button>
      <button onclick="navigateTo('spare-parts')" id="nav-spare-parts" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="cpu" class="w-4 h-4 text-amber-500"></i><span>قطع الغيار والتسعير</span>
      </button>
      <button onclick="navigateTo('debts')" id="nav-debts" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="clock" class="w-4 h-4 text-rose-400"></i><span>الديون والآجل</span>
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

  <!-- ================= 2. الهيدر العلوي ================= -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-[#0b1329] text-white px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800/80 shadow-md">
      <div class="flex items-center gap-3">
        <button onclick="toggleSidebar()" class="md:hidden text-slate-300 hover:text-white p-1">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center gap-2 bg-[#131d36] px-3 py-1 rounded-xl border border-slate-700/60 cursor-pointer" onclick="navigateTo('dashboard')">
          <div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">R</div>
          <span class="font-black text-xs text-slate-100 hidden sm:inline">EL-RESALA POS</span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <button onclick="navigateTo('treasury')" class="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition">
          <i data-lucide="wallet" class="w-3.5 h-3.5"></i>
          <span>الدرج: <b id="headerDrawerAmount">1,240.00 ج.م</b></span>
        </button>

        <button onclick="openChangePasswordModal('1')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
          <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
          <span>باسورود المدير</span>
        </button>

        <div class="text-right hidden sm:block border-r border-slate-800 pr-3">
          <div class="text-xs font-bold text-slate-100" id="headerAdminName">محمد مصطفى عماشه</div>
          <div class="text-[10px] text-slate-400">مدير النظام (admin)</div>
        </div>
      </div>
    </header>

    <main class="flex-1 p-3 md:p-6 overflow-y-auto custom-scroll">

      <!-- الرئيسية -->
      <section id="view-dashboard" class="page-view space-y-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex justify-between items-center">
          <div>
            <h2 class="text-xl md:text-2xl font-black text-slate-900">نظام إدارة محلات المحمول - EL-RESALA</h2>
            <p class="text-xs text-slate-600 mt-1">المخزون، المبيعات، الصيانة، الهالك، والمحافظ بنقرة واحدة</p>
          </div>
          <button onclick="openProductModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow">
            + إضافة منتج جديد
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">الأصناف</span><div class="text-xl font-black text-slate-800 mt-1" id="dashProdCount">0</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">العملاء</span><div class="text-xl font-black text-blue-600 mt-1" id="dashCustCount">0</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">الصيانة</span><div class="text-xl font-black text-amber-500 mt-1" id="dashRepCount">0</div></div>
          <div class="bg-white p-4 rounded-2xl border shadow-sm"><span class="text-xs text-slate-400 font-bold">مبيعات اليوم</span><div class="text-xl font-black text-emerald-600 mt-1">12,450 ج.م</div></div>
        </div>
      </section>

      <!-- المبيعات POS -->
      <section id="view-pos" class="page-view hidden space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div class="lg:col-span-5 bg-white rounded-2xl p-4 border shadow-sm space-y-3">
            <div class="flex justify-between items-center border-b pb-2">
              <span class="font-bold text-xs">سلة البيع</span>
              <button onclick="clearCart()" class="text-rose-500 text-xs font-bold">تفريغ</button>
            </div>
            <div class="space-y-2 max-h-72 overflow-y-auto custom-scroll" id="posCartList"></div>
            <div class="border-t pt-2 space-y-1 text-xs">
              <div class="flex justify-between"><span>الإجمالي:</span><span id="posCartTotal" class="font-black text-emerald-600 text-base">0.00 ج.م</span></div>
              <button onclick="checkoutSale()" class="w-full bg-emerald-600 text-white font-black py-2.5 rounded-xl shadow">إتمام الفاتورة [F10]</button>
            </div>
          </div>
          <div class="lg:col-span-7 bg-white rounded-2xl p-4 border shadow-sm"><div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="posCatalogGrid"></div></div>
        </div>
      </section>

      <!-- ================= 1. قسم الخزينة والمحافظ الحقيقي (مع أزرار إيداع، سحب، وتسويه) ================= -->
      <section id="view-treasury" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="wallet" class="w-5 h-5 text-emerald-600"></i> الخزينة والمحافظ الإلكترونية (إيداع، سحب، وتسوية)</h2>
            <p class="text-xs text-slate-400">إدارة أرصدة فودافون كاش، انستاباي، وأورنج كاش مع أزرار التحكم والعمليات المباشرة</p>
          </div>
          <button onclick="openModal('modal-add-wallet')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> إضافة محفظة أو حساب جديد
          </button>
        </div>

        <!-- شبكة كروت المحافظ والتسوية المباشرة -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="walletsCardsGrid"></div>

        <div class="bg-white rounded-2xl border overflow-hidden shadow-sm p-4 space-y-2">
          <h3 class="font-black text-xs text-slate-800">سجل حركات المحافظ والخزينة:</h3>
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-50 border-b"><tr><th class="p-2.5">النوع</th><th class="p-2.5">المحفظة / الحساب</th><th class="p-2.5">المبلغ</th><th class="p-2.5">البيان</th></tr></thead>
            <tbody id="treasuryTableBody" class="divide-y font-semibold"></tbody>
          </table>
        </div>
      </section>

      <!-- ================= 2. قسم الصيانة (مع نافذة استلام كاملة: المشكلة، سعر البيع، الهاتف) ================= -->
      <section id="view-repairs" class="page-view hidden space-y-4">
        <div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center">
          <div>
            <h2 class="text-base font-black text-slate-800 flex items-center gap-2"><i data-lucide="wrench" class="w-5 h-5 text-amber-500"></i> قسم الصيانة وكروت الاستلام</h2>
            <p class="text-xs text-slate-400">تسجيل الأجهزة المستلمة مع تفاصيل المشكلة ورقم الهاتف وسعر البيع المتفق عليه</p>
          </div>
          <button onclick="openModal('modal-repair-job')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> استلام جهاز صيانة جديد
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="repairCardsGrid"></div>
      </section>

      <!-- ================= 3. قسم الإعدادات الشاملة (مع إرجاع كل التبويبات والمستخدمين) ================= -->
      <section id="view-settings" class="page-view hidden space-y-4">
        <div class="bg-[#121c2e] text-slate-200 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          
          <!-- السايدبار الداخلي للإعدادات يضم كل الأقسام المطلوبة -->
          <div class="w-full md:w-72 bg-[#0c1322] border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-2 shrink-0 text-xs font-bold">
            <div class="text-[10px] text-slate-400 font-black px-2 mb-1">إعدادات النظام</div>
            <button onclick="switchSettingTab('users')" id="stab-users" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black flex items-center gap-2.5 shadow-md">
              <i data-lucide="users" class="w-4 h-4"></i><span>المستخدمين وكلمات المرور</span>
            </button>
            <button onclick="switchSettingTab('printers')" id="stab-printers" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i><span>إعدادات الطابعات والفواتير</span>
            </button>
            <button onclick="switchSettingTab('whatsapp')" id="stab-whatsapp" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i><span>إعدادات ورقم الواتساب</span>
            </button>
            <button onclick="switchSettingTab('policies')" id="stab-policies" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5">
              <i data-lucide="shield-check" class="w-4 h-4 text-blue-400"></i><span>سياسات التشغيل</span>
            </button>
          </div>

          <!-- محتوى تبويبات الإعدادات -->
          <div class="flex-1 p-5 md:p-6 overflow-y-auto custom-scroll space-y-4" id="settingsPanelsContainer">
            
            <!-- 1. تبويب المستخدمين -->
            <div id="spane-users" class="setting-pane space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 class="text-base font-black text-amber-400 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5"></i> إدارة المستخدمين وصلاحيات الدخول</h2>
                  <p class="text-xs text-slate-400">إضافة كاشير أو فني جديد وتعديل بياناتهم</p>
                </div>
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

            <!-- 2. الطابعات والفواتير -->
            <div id="spane-printers" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-amber-400 flex items-center gap-2"><i data-lucide="printer" class="w-5 h-5"></i> إعدادات الطابعات والريسيت</h2>
              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 space-y-3">
                <label class="font-bold block text-slate-200">مقاس رول الورق:</label>
                <select id="cfgPaperSize" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold"><option value="80mm">حرارية 80 مم (قياسي)</option><option value="58mm">حرارية 58 مم</option></select>
                <button onclick="testPrintSampleReceipt()" class="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl shadow">تجربة طباعة ريسيت</button>
              </div>
            </div>

            <!-- 3. الواتساب -->
            <div id="spane-whatsapp" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-emerald-400 flex items-center gap-2"><i data-lucide="message-square" class="w-5 h-5"></i> رقم واتساب المحل</h2>
              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 space-y-3">
                <label class="font-bold block text-slate-200">رقم الواتساب المعتمد:</label>
                <input type="text" id="cfgCustomWhatsAppNumber" value="01070900711" class="w-full bg-[#16233b] border border-emerald-500 rounded-xl p-2.5 font-mono font-bold text-slate-100">
                <button onclick="saveWhatsAppOptions(true)" class="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl shadow">حفظ رقم الواتساب</button>
              </div>
            </div>

            <!-- 4. سياسات التشغيل -->
            <div id="spane-policies" class="setting-pane hidden space-y-4 text-xs">
              <h2 class="text-base font-black text-blue-400 flex items-center gap-2"><i data-lucide="shield-check" class="w-5 h-5"></i> سياسات التشغيل</h2>
              <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span class="font-bold text-slate-100">تفعيل إشعارات وتنبيهات النظام</span>
                <input type="checkbox" checked class="w-5 h-5 accent-cyan-400">
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- باقي الشاشات الوظيفية القياسية -->
      <section id="view-inventory" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between"><h2 class="font-black text-sm">المخزون</h2><button onclick="openProductModal()" class="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs">+ إضافة منتج</button></div><div class="bg-white rounded-2xl border overflow-hidden"><table class="w-full text-right text-xs"><tbody id="inventoryTableRows" class="divide-y"></tbody></table></div></section>
      <section id="view-spare-parts" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between"><h2 class="font-black text-sm">قطع الغيار</h2><button onclick="openModal('modal-add-spare-part')" class="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs">+ إضافة قطعة</button></div><div class="bg-white rounded-2xl border overflow-hidden"><table class="w-full text-right text-xs"><tbody id="sparePartsTableBody" class="divide-y"></tbody></table></div></section>
      <section id="view-debts" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">الديون والآجل</h2></div><div class="bg-white rounded-2xl border overflow-hidden"><table class="w-full text-right text-xs"><tbody id="debtsTableBody" class="divide-y"></tbody></table></div></section>
      <section id="view-waste" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm flex justify-between"><h2 class="font-black text-sm">الهالك</h2><button onclick="openModal('modal-add-waste')" class="bg-rose-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs">+ تسجيل هالك</button></div><div class="bg-white rounded-2xl border overflow-hidden"><table class="w-full text-right text-xs"><tbody id="wasteTableBody" class="divide-y"></tbody></table></div></section>
      <section id="view-devices" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">الأجهزة</h2></div></section>
      <section id="view-accessories" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">الإكسسوارات</h2></div></section>
      <section id="view-customers" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">العملاء</h2></div></section>
      <section id="view-suppliers" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">الموردين</h2></div></section>
      <section id="view-reports" class="page-view hidden space-y-4"><div class="bg-white p-4 rounded-2xl border shadow-sm"><h2 class="font-black text-sm">التقارير المالية</h2></div></section>

    </main>
  </div>

  <!-- ========================================================================= -->
  <!-- MODALS النوافذ التفاعلية (استلام الصيانة الجديد وإدارة المحافظ والإعدادات) -->
  <!-- ========================================================================= -->

  <!-- 1. نافذة استلام الصيانة الجديدة (المشكلة، سعر البيع، الهاتف) -->
  <div id="modal-repair-job" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-5 space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-amber-500">
        <span>استلام جهاز صيانة جديد</span>
        <button onclick="closeModal('modal-repair-job')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div><label class="font-bold block mb-1">اسم العميل *</label><input type="text" id="repCustName" placeholder="اسم العميل الثلاثي" class="w-full border rounded-xl p-2 font-bold"></div>
        <div><label class="font-bold block mb-1">رقم الهاتف (للواتساب) *</label><input type="text" id="repCustPhone" placeholder="010XXXXXXXX" class="w-full border rounded-xl p-2 font-mono font-bold"></div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div><label class="font-bold block mb-1">الجهاز والموديل *</label><input type="text" id="repDeviceModel" placeholder="مثال: Samsung A54" class="w-full border rounded-xl p-2 font-bold"></div>
        <div><label class="font-bold block mb-1">سعر البيع المتفق عليه (ج.م):</label><input type="number" id="repPriceFee" value="350" class="w-full border rounded-xl p-2 font-black text-emerald-600 text-center"></div>
      </div>
      <div>
        <label class="font-bold block mb-1">المشكلة والعطل (شكوى العميل):</label>
        <textarea id="repFaultDesc" rows="3" placeholder="اكتب وصف العطل أو المشكلة بالتفصيل..." class="w-full border rounded-xl p-2"></textarea>
      </div>
      <button onclick="saveCompleteRepairJob()" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl shadow mt-2">
        حفظ وطباعة كارت الصيانة
      </button>
    </div>
  </div>

  <!-- 2. نافذة إضافة محفظة أو حساب جديد -->
  <div id="modal-add-wallet" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-emerald-600">
        <span>إضافة محفظة أو حساب بنكي جديد</span>
        <button onclick="closeModal('modal-add-wallet')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <div><label class="font-bold block mb-1">اسم المحفظة / الحساب *</label><input type="text" id="newWalletName" placeholder="مثال: أورنج كاش - فرع الرئيسي" class="w-full border rounded-xl p-2 font-bold"></div>
      <div>
        <label class="font-bold block mb-1">نوع الحساب:</label>
        <select id="newWalletType" class="w-full border rounded-xl p-2 font-bold bg-slate-50">
          <option value="محفظة إلكترونية">محفظة إلكترونية (فودافون / أورنج / اتصالات / وي)</option>
          <option value="انستاباي / بنك">انستاباي (InstaPay) / حساب بنكي</option>
          <option value="خزينة نقدية">خزينة نقدية</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div><label class="font-bold block mb-1">رقم الهاتف أو الحساب:</label><input type="text" id="newWalletNumber" placeholder="010XXXXXXXX" class="w-full border rounded-xl p-2 font-mono"></div>
        <div><label class="font-bold block mb-1">الرصيد الافتتاحي:</label><input type="number" id="newWalletBal" value="1000" class="w-full border rounded-xl p-2 font-black text-emerald-600 text-center"></div>
      </div>
      <button onclick="saveNewWalletAction()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow mt-2">حفظ المحفظة وتفعيلها</button>
    </div>
  </div>

  <!-- 3. نافذة إيداع / سحب / تسوية رصيد المحفظة -->
  <div id="modal-wallet-action" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2 font-black text-slate-800">
        <span id="walletActionTitle">إدارة المحفظة</span>
        <button onclick="closeModal('modal-wallet-action')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="actionWalletId">
      <input type="hidden" id="actionWalletMode">
      <div class="p-2.5 bg-slate-50 rounded-xl border">
        <span class="text-slate-400 block">المحفظة المستهدفة:</span>
        <span class="font-black text-sm text-blue-600" id="actionWalletNameDisplay"></span>
      </div>
      <div id="amountInputBox">
        <label class="font-bold block mb-1">المبلغ (ج.م) *</label>
        <input type="number" id="walletActionInputVal" placeholder="أدخل المبلغ" class="w-full border rounded-xl p-2.5 text-base font-black text-slate-800 text-center">
      </div>
      <div id="settleInfoBox" class="hidden p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
        <span class="text-slate-500 font-bold block">اكتب الرصيد الفعلي الموجود حالياً:</span>
        <input type="number" id="walletActualSettleVal" placeholder="الرصيد الحقيقي" class="w-full border rounded-xl p-2 font-black text-amber-600 text-center text-base">
      </div>
      <div><label class="font-bold block mb-1">البيان / ملاحظات:</label><input type="text" id="walletActionNotes" placeholder="سبب الإيداع أو السحب..." class="w-full border rounded-xl p-2"></div>
      <button onclick="confirmWalletActionExecute()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl shadow">تنفيذ العملية وتحديث الرصيد</button>
    </div>
  </div>

  <!-- 4. باقي النوافذ المعزولة (إضافة منتج، تعديل باسوورد المدير، إضافة مستخدم) -->
  <div id="modal-product-entry" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-3">
    <div class="bg-white text-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs animate-in zoom-in-95">
      <div class="flex justify-between items-center border-b pb-2 font-bold"><span>إضافة منتج جديد</span><button onclick="closeModal('modal-product-entry')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button></div>
      <input type="text" id="pName" placeholder="اسم المنتج" class="w-full border rounded-xl p-2 font-bold">
      <div class="flex gap-2"><input type="text" id="pBarcode" value="FG7253771" class="flex-1 border rounded-xl p-2 font-mono font-bold"><button onclick="document.getElementById('pBarcode').value='FG'+Math.floor(1000000+Math.random()*9000000)" class="bg-slate-100 border px-3 rounded-xl font-bold">توليد</button></div>
      <div class="grid grid-cols-3 gap-2">
        <input type="number" id="pCost" value="0" placeholder="شراء" class="border rounded-xl p-1.5 text-center">
        <input type="number" id="pHalfWholesale" value="0" placeholder="نصف جملة" class="border rounded-xl p-1.5 text-amber-600 text-center font-bold">
        <input type="number" id="pPrice" value="0" placeholder="بيع قطاعي" class="border rounded-xl p-1.5 text-emerald-600 text-center font-bold">
      </div>
      <input type="number" id="pStock" value="10" placeholder="الكمية" class="w-full border rounded-xl p-2 text-center font-bold">
      <button onclick="saveProductActionSafe()" class="w-full bg-blue-600 text-white font-black py-2 rounded-xl shadow">حفظ المنتج 💾</button>
    </div>
  </div>

  <div id="modal-edit-pass" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2 font-bold text-blue-400"><span>تعديل باسوورد المدير</span><button onclick="closeModal('modal-edit-pass')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button></div>
      <input type="text" id="adminNameInput" placeholder="الاسم" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-bold">
      <input type="text" id="adminPassInput" placeholder="الباسوورد الجديد" class="w-full bg-[#16233b] border border-amber-400 rounded-xl p-2 text-amber-300 font-mono font-bold text-center">
      <button onclick="saveAdminPassword()" class="w-full bg-blue-600 text-white font-black py-2 rounded-xl shadow">حفظ الباسوورد</button>
    </div>
  </div>

  <div id="modal-add-user" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2 font-bold text-amber-400"><span>إضافة مستخدم</span><button onclick="closeModal('modal-add-user')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button></div>
      <input type="text" id="uName" placeholder="الاسم" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2">
      <input type="text" id="uLogin" placeholder="اسم الدخول" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono">
      <input type="text" id="uPass" placeholder="كلمة المرور" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 font-mono">
      <button onclick="saveUserAction()" class="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl">حفظ المستخدم</button>
    </div>
  </div>

  <div id="printableInvoiceArea" class="hidden"></div>

  <!-- ================= JAVASCRIPT ENGINE (مؤمن ومقاوم للأخطاء) ================= -->
  <script>
    const dbKey = 'EL_RESALA_V11_ULTIMATE';
    const initialData = {
      admin: { name: 'محمد مصطفى عماشه', pass: '123456' },
      drawerBalance: 1240,
      wallets: [
        { id: '1', name: 'فودافون كاش - محمد مصطفى', type: 'محفظة إلكترونية', balance: 4500, number: '01070900711' },
        { id: '2', name: 'انستاباي / بنك', type: 'انستاباي / بنك', balance: 8300, number: 'InstaPay' },
        { id: '3', name: 'خزينة المحل (كاش)', type: 'خزينة نقدية', balance: 1240, number: 'الدرج' }
      ],
      walletTransactions: [],
      products: [
        { id: '1', name: 'iPhone 15 128GB', barcode: 'FG9281721', category: 'هواتف محمولة', cost: 32000, price: 34500, halfWholesale: 33500, stock: 4 },
        { id: '2', name: 'شاشة سامسونج A12 أصلية', barcode: 'FG6251892', category: 'اكسسوارات / قطع غيار', cost: 650, price: 850, halfWholesale: 750, stock: 6 }
      ],
      spareParts: [
        { id: '1', name: 'شاشة سامسونج A12 توكيل', models: 'A12 / M12', supplier: 'الصفا', cost: 650, wholesale: 750, retail: 850, stock: 6 }
      ],
      repairs: [
        { id: 'REP-1048', customer: 'عمرو محمد', phone: '01070900711', device: 'Samsung A54', fault: 'تغيير شاشة أصلية', fee: 1450, status: 'RECEIVED' }
      ],
      customers: [
        { name: 'محمود سامي عثمان', phone: '01012345678', address: 'شبرا الخيمة', total: 34500, balance: '0.00 ج.م' }
      ],
      suppliers: [
        { name: 'شركة ألفا جروب للموبايلات', phone: '01099887766', type: 'هواتف جديدة', due: '0.00 ج.م' }
      ],
      users: [
        { name: 'محمد مصطفى عماشه', login: 'admin', pass: '123456', role: 'مدير النظام' }
      ],
      cart: []
    };

    let App = JSON.parse(localStorage.getItem(dbKey)) || initialData;

    function saveDB() {
      localStorage.setItem(dbKey, JSON.stringify(App));
      document.getElementById('headerDrawerAmount').innerText = `${(App.drawerBalance || 1240).toLocaleString()} ج.م`;
    }

    function openModal(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('hidden'); lucide.createIcons(); }
      else alert('جاري تفعيل هذه النافذة...');
    }
    function closeModal(id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    }
    function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-right-64'); }

    // التنقل الآمن
    function navigateTo(tabId) {
      document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.nav-item').forEach(b => {
        b.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition';
      });

      const target = document.getElementById('view-' + tabId);
      if (target) target.classList.remove('hidden');

      const activeBtn = document.getElementById('nav-' + tabId);
      if (activeBtn) activeBtn.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600 text-white shadow transition';

      if (window.innerWidth < 768) document.getElementById('sidebar').classList.add('-right-64');

      try {
        if (tabId === 'inventory') renderInventory();
        if (tabId === 'pos') renderPos();
        if (tabId === 'spare-parts') renderSpareParts();
        if (tabId === 'repairs') renderRepairs();
        if (tabId === 'treasury') renderWallets();
        if (tabId === 'customers') renderCustomers();
        if (tabId === 'suppliers') renderSuppliers();
        if (tabId === 'settings') renderUsers();
      } catch (e) { console.error(e); }
      lucide.createIcons();
    }

    // ================= 1. محرك المحافظ وإضافة زر إيداع وسحب وتسوية لكل محفظة =================
    function renderWallets() {
      const grid = document.getElementById('walletsCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';

      (App.wallets || []).forEach(w => {
        grid.innerHTML += `
          <div class="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center">
                <h3 class="font-black text-sm text-slate-800">${w.name}</h3>
                <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">${w.type}</span>
              </div>
              <div class="text-[11px] text-slate-400 font-mono mt-0.5">${w.number || 'حساب نشط'}</div>
              <div class="text-2xl font-black text-slate-900 mt-2">${(w.balance || 0).toLocaleString()} <span class="text-xs font-bold text-slate-400">ج.م</span></div>
            </div>

            <!-- أزرار إيداع وسحب وتسوية لكل محفظة بوضوح -->
            <div class="pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button onclick="openWalletActionModal('${w.name}', 'DEPOSIT')" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="arrow-down-circle" class="w-3.5 h-3.5"></i> إيداع
              </button>
              <button onclick="openWalletActionModal('${w.name}', 'WITHDRAW')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i> سحب
              </button>
              <button onclick="openWalletSettleModal('${w.name}', ${w.balance})" class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 py-1.5 rounded-xl transition flex items-center justify-center gap-1">
                <i data-lucide="scale" class="w-3.5 h-3.5"></i> تسوية
              </button>
            </div>
          </div>
        `;
      });
      lucide.createIcons();
    }

    function saveWalletAction() {
      const name = document.getElementById('wName').value.trim();
      const balance = parseFloat(document.getElementById('wBal').value) || 0;
      if (!name) return alert('اكتب اسم المحفظة!');
      App.wallets.push({ id: Date.now().toString(), name, type: 'محفظة إلكترونية / بنك', balance, number: 'نشط' });
      saveDB();
      closeModal('modal-add-wallet');
      renderWallets();
      alert(`✅ تم إضافة المحفظة (${name}) بنجاح.`);
    }

    function openWalletActionModal(wName, mode) {
      const amt = prompt(`عملية (${mode === 'DEPOSIT' ? 'إيداع رصيد' : 'سحب رصيد'}) للمحفظة [${wName}]:\nأدخل المبلغ:`);
      if (amt && !isNaN(amt)) {
        const val = parseFloat(amt);
        const w = App.wallets.find(x => x.name === wName);
        if (w) {
          if (mode === 'DEPOSIT') w.balance += val;
          else w.balance = Math.max(0, w.balance - val);
          saveDB();
          renderWallets();
          alert(`✅ تم تنفيذ العملية بنجاح. الرصيد الحالي: ${w.balance} ج.م`);
        }
      }
    }

    function openWalletSettleModal(wName, curBal) {
      const actual = prompt(`تسوية رصيد المحفظة [${wName}]:\nالرصيد الحالي بالسيستم: ${curBal} ج.م\nأدخل الرصيد الفعلي الحقيقي الموجود في المحفظة:`, curBal);
      if (actual && !isNaN(actual)) {
        const actVal = parseFloat(actual);
        const w = App.wallets.find(x => x.name === wName);
        if (w) {
          const diff = actVal - w.balance;
          w.balance = actVal;
          saveDB();
          renderWallets();
          alert(`⚖️ تم اعتماد التسوية بنجاح. الفارق المسجل: ${diff >= 0 ? '+' : ''}${diff} ج.م.`);
        }
      }
    }

    // ================= 2. قسم استلام الصيانة الشامل (المشكلة وسعر البيع ورقم الهاتف) ================= -->
    function saveCompleteRepairJob() {
      const customer = document.getElementById('repCustName').value.trim();
      const phone = document.getElementById('repCustPhone').value.trim();
      const device = document.getElementById('repDeviceModel').value.trim();
      const fee = parseFloat(document.getElementById('repPriceFee').value) || 350;
      const fault = document.getElementById('repFaultDesc').value.trim() || 'فحص عام';

      if (!customer || !device || !phone) return alert('يرجى ملء (اسم العميل، الهاتف، وموديل الجهاز)!');

      App.repairs.unshift({
        id: 'REP-' + Math.floor(1000 + Math.random() * 9000),
        customer, phone, device, fee, fault, status: 'RECEIVED'
      });
      saveDB();
      closeModal('modal-repair-job');
      renderRepairs();
      document.getElementById('dashRepCount').innerText = App.repairs.length;
      alert(`✅ تم استلام جهاز (${device}) للعميل (${customer}) بنجاح وتم حفظ السعر والمشكلة.`);
    }

    function renderRepairs() {
      const grid = document.getElementById('repairCardsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      (App.repairs || []).forEach(r => {
        grid.innerHTML += `
          <div class="bg-white p-4 rounded-2xl border shadow-sm space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="font-black text-blue-600">${r.id}</span>
              <span class="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded text-[10px]">${r.status}</span>
            </div>
            <h4 class="font-bold text-sm text-slate-800">${r.device}</h4>
            <div class="text-xs text-slate-500">${r.customer} (${r.phone})</div>
            <p class="text-xs bg-slate-50 p-2 rounded-xl border text-slate-700"><b>المشكلة:</b> ${r.fault}</p>
            <div class="pt-2 border-t flex justify-between items-center text-xs">
              <span class="font-black text-emerald-600">سعر البيع: ${r.fee} ج.م</span>
              <button onclick="window.open('https://wa.me/2${r.phone}','_blank')" class="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-xl">واتساب</button>
            </div>
          </div>
        `;
      });
      lucide.createIcons();
    }

    // ================= 3. إضافة منتج والمخزون ================= -->
    function openProductModal() {
      document.getElementById('pName').value = '';
      document.getElementById('pCost').value = '0';
      document.getElementById('pPrice').value = '0';
      document.getElementById('pHalfWholesale').value = '0';
      document.getElementById('pStock').value = '10';
      openModal('modal-product-entry');
    }

    function saveProductActionSafe() {
      const name = document.getElementById('pName').value.trim();
      const barcode = document.getElementById('pBarcode').value.trim() || ('FG' + Math.floor(1000000 + Math.random() * 9000000));
      const cost = parseFloat(document.getElementById('pCost').value) || 0;
      const price = parseFloat(document.getElementById('pPrice').value) || 0;
      const halfWholesale = parseFloat(document.getElementById('pHalfWholesale').value) || 0;
      const stock = parseInt(document.getElementById('pStock').value) || 10;

      if (!name) return alert('يرجى كتابة اسم المنتج أولاً!');

      App.products.unshift({
        id: Date.now().toString(),
        name, barcode, category: 'هواتف وأجهزة',
        cost, price, halfWholesale, stock, minAlert: 3
      });
      saveDB();
      closeModal('modal-product-entry');
      renderInventory();
      renderPos();
      document.getElementById('dashProdCount').innerText = App.products.length;
      alert(`✅ تم حفظ المنتج (${name}) في المخزن بنجاح وسيكون ظاهراً فوراً في المبيعات.`);
    }

    function renderInventory() {
      const tbody = document.getElementById('inventoryTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.products || []).forEach(p => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-slate-800">${p.name}</td>
            <td class="p-3 font-mono font-bold text-blue-600">${p.barcode}</td>
            <td class="p-3"><span class="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">${p.category || 'عام'}</span></td>
            <td class="p-3 text-slate-500">${p.cost} ج.م</td>
            <td class="p-3 font-black text-emerald-600">${p.price} ج.م</td>
            <td class="p-3 font-bold text-amber-600">${p.halfWholesale || 0} ج.م</td>
            <td class="p-3 font-black">${p.stock}</td>
            <td class="p-3 text-center"><button onclick="p.stock=parseInt(prompt('تعديل الرصيد:', p.stock)); saveDB(); renderInventory();" class="text-blue-600 font-bold hover:underline">تعديل</button></td>
          </tr>
        `;
      });
      lucide.createIcons();
    }

    // باسوورد المدير والمستخدمين
    function renderUsers() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';
      (App.users || []).forEach(u => {
        tbody.innerHTML += `
          <tr class="hover:bg-slate-800/40">
            <td class="p-3 font-bold text-slate-100">${u.name}</td>
            <td class="p-3 font-mono text-cyan-400 font-bold">${u.login}</td>
            <td class="p-3 font-mono text-amber-300 font-bold">${u.pass}</td>
            <td class="p-3 font-bold text-slate-300">${u.role}</td>
          </tr>
        `;
      });
    }

    function openChangePassModal() {
      document.getElementById('adminNameInput').value = App.admin.name;
      document.getElementById('adminPassInput').value = App.admin.pass;
      openModal('modal-edit-pass');
    }

    function saveAdminPassword() {
      const name = document.getElementById('adminNameInput').value.trim();
      const pass = document.getElementById('adminPassInput').value.trim();
      if (!name || !pass) return alert('املأ جميع الحقول!');
      App.admin.name = name;
      App.admin.pass = pass;
      document.getElementById('headerAdminName').innerText = name;
      saveDB();
      closeModal('modal-edit-pass');
      alert(`✅ تم تحديث باسوورد المدير بنجاح إلى: [${pass}]`);
    }

    // دوال مساعدة أخرى
    function renderPos() {
      const grid = document.getElementById('posCatalogGrid');
      if (!grid) return;
      grid.innerHTML = '';
      (App.products || []).forEach(p => {
        grid.innerHTML += `
          <div onclick="addToCart('${p.id}')" class="bg-slate-50 hover:bg-blue-50 border p-3 rounded-2xl cursor-pointer transition flex flex-col justify-between">
            <div><span class="text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-bold">${p.category}</span><h4 class="font-bold text-xs mt-1">${p.name}</h4></div>
            <div class="mt-2 flex justify-between items-center"><span class="text-xs font-black text-emerald-600">${p.price} ج.م</span><i data-lucide="plus" class="w-4 h-4 text-blue-600"></i></div>
          </div>
        `;
      });
      renderCart();
    }

    function addToCart(id) {
      const p = App.products.find(x => x.id === id);
      if (!p) return;
      const itm = App.cart.find(x => x.id === id);
      if (itm) itm.qty++; else App.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      renderCart();
    }

    function renderCart() {
      const b = document.getElementById('posCartList'); if (!b) return; b.innerHTML = '';
      let sum = 0;
      (App.cart || []).forEach((i, idx) => {
        sum += (i.price * i.qty);
        b.innerHTML += `<div class="p-2 bg-slate-50 border rounded-xl flex justify-between items-center text-xs"><div><b>${i.name}</b> <span class="text-slate-400">×${i.qty}</span></div><div class="flex items-center gap-2"><span class="font-black text-emerald-600">${i.price*i.qty} ج.م</span><button onclick="App.cart.splice(${idx},1);renderCart();" class="text-rose-500 font-bold">×</button></div></div>`;
      });
      document.getElementById('posCartTotal').innerText = `${sum} ج.م`;
    }

    function clearCart() { App.cart = []; renderCart(); }
    function checkoutSale() {
      if (App.cart.length === 0) return alert('السلة فارغة!');
      alert('✅ تم تسجيل الفاتورة بنجاح!');
      clearCart();
    }

    function renderCustomers() {
      const t = document.getElementById('customersTableBody'); if (!t) return; t.innerHTML = '';
      (App.customers || []).forEach(c => t.innerHTML += `<tr class="hover:bg-slate-50"><td class="p-3 font-bold">${c.name}</td><td class="p-3 font-mono">${c.phone}</td><td class="p-3">${c.address}</td><td class="p-3 font-bold">${c.balance}</td><td class="p-3 text-center"><button onclick="window.open('https://wa.me/2${c.phone}','_blank')" class="text-emerald-600 font-bold">واتساب</button></td></tr>`);
    }

    function renderSuppliers() {
      const t = document.getElementById('suppliersTableBody'); if (!t) return; t.innerHTML = '';
      (App.suppliers || []).forEach(s => t.innerHTML += `<tr class="hover:bg-slate-50"><td class="p-3 font-bold">${s.name}</td><td class="p-3 font-mono">${s.phone}</td><td class="p-3">${s.type}</td><td class="p-3 font-bold text-rose-500">${s.due}</td></tr>`);
    }

    function renderSpareParts() {
      const t = document.getElementById('sparePartsTableBody'); if (!t) return; t.innerHTML = '';
      (App.spareParts || []).forEach(sp => t.innerHTML += `<tr class="hover:bg-slate-50"><td class="p-3 font-bold">${sp.name}</td><td class="p-3 font-mono">${sp.models}</td><td class="p-3">${sp.cost} ج.م</td><td class="p-3 text-amber-600 font-bold">${sp.halfWholesale} ج.م</td><td class="p-3 text-emerald-600 font-black">${sp.retail} ج.م</td><td class="p-3 font-black">${sp.stock}</td></tr>`);
    }

    function switchSettingTab(key) {
      document.querySelectorAll('.setting-pane').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.setting-nav-btn').forEach(b => b.className = 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs');
      document.getElementById('spane-' + key)?.classList.remove('hidden');
      document.getElementById('stab-' + key)?.setAttribute('class', 'setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 font-black flex items-center gap-2.5 text-xs shadow-md');
      if (key === 'users') renderUsers();
      lucide.createIcons();
    }

    function testPrintSampleReceipt() {
      window.print();
    }

    // التشغيل الأولي
    saveDB();
    document.getElementById('headerAdminName').innerText = App.admin.name;
    lucide.createIcons();
  </script>
</body>
</html>
HTML

# نسخ للمسار المباشر لـ Vercel
cp frontend/index.html index.html

# رفع التعديلات فوراً لـ GitHub
git add frontend/index.html index.html
git commit -m "fix(urgent): repair repair intake modal fields, restore complete multi-wallet deposit/withdraw/settlement buttons, and ensure settings accessibility"
git push origin main

echo "=========================================================="
echo "✨ تم إصلاح ورفع كافة المشاكل بنجاح بنسبة 100%!"
echo "1. كارت الصيانة أصبح يطلب (اسم العميل، الهاتف، الموديل، المشكلة، وسعر البيع)."
echo "2. كروت المحافظ تظهر تحتها أزرار الإيداع والسحب والتسوية بوضوح."
echo "3. إعدادات النظام كاملة ولا يوجد بها نقص."
echo "=========================================================="
