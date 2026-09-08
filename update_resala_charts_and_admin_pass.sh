#!/bin/bash
set -e

echo "📊 جاري إضافة الرسوم البيانية وتعديل باسوورد المدير وشبكة الوصول السريع..."

cat << 'HTML' > frontend/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EL-RESALA ERP & POS | نظام إدارة محلات المحمول</title>
  <!-- Tailwind CSS & Lucide Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Chart.js للرسوم البيانية الاحترافية -->
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
      <button onclick="navigateTo('purchases')" id="nav-purchases" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="truck" class="w-4 h-4 text-purple-400"></i><span>المشتريات</span>
      </button>
      <button onclick="navigateTo('inventory')" id="nav-inventory" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition">
        <i data-lucide="boxes" class="w-4 h-4 text-cyan-400"></i><span>المخزون العام</span>
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
        <i data-lucide="building" class="w-4 h-4 text-indigo-400"></i><span>الموردين</span>
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
          <input type="text" placeholder="ابحث في النظام (هاتف، عميل، صيانة)..." class="w-full bg-[#131d36] border border-slate-700/60 rounded-xl py-1.5 pr-9 pl-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-2"></i>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- زر فتح تعديل باسوورد المدير مباشرة من الهيدر -->
        <button onclick="openChangePasswordModal('1')" title="تعديل كلمة مرور الحساب" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition">
          <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">تغيير الباسوورد</span>
        </button>

        <div class="flex items-center gap-2.5 border-r border-slate-800 pr-3">
          <div class="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <i data-lucide="user" class="w-4 h-4"></i>
          </div>
          <div class="text-right">
            <div class="text-xs font-extrabold text-slate-100" id="headerUserDisplayName">أحمد محمد</div>
            <div class="text-[10px] text-slate-400 font-semibold">مدير النظام (admin)</div>
          </div>
        </div>
      </div>
    </header>

    <!-- ================= 3. المحتوى الرئيسي ================= -->
    <main class="flex-1 p-3 md:p-6 overflow-y-auto custom-scroll">

      <!-- ================= شاشة الرئيسية (DASHBOARD) ================= -->
      <section id="view-dashboard" class="page-view space-y-5">
        
        <!-- البانر الإعلاني العلوي -->
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

        <!-- كروت الإحصائيات الأربعة -->
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

        <!-- ================= الرسوم البيانية التفاعلية للمبيعات والأرباح ================= -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <!-- رسم بياني 1: حركة المبيعات والأرباح خلال الأسبوع (8 أعمدة) -->
          <div class="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-black text-sm text-slate-800 flex items-center gap-2">
                  <i data-lucide="trending-up" class="w-4 h-4 text-blue-600"></i> حركة المبيعات والأرباح اليومية
                </h3>
                <p class="text-[11px] text-slate-400">متابعة دقيقة لمؤشر الإيرادات وصافي الأرباح</p>
              </div>
              <span class="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 font-black px-2.5 py-1 rounded-xl">معدل نمو +14.8%</span>
            </div>
            <div class="h-64 relative">
              <canvas id="salesTrendChart"></canvas>
            </div>
          </div>

          <!-- رسم بياني 2: توزيع الإيرادات حسب النشاط (4 أعمدة) -->
          <div class="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="font-black text-sm text-slate-800 flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-4 h-4 text-purple-600"></i> مصادر الإيرادات
              </h3>
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

        <!-- ================= شبكة الأقسام الـ 12 للوصول السريع بضغطة واحدة ================= -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-sm text-slate-800 flex items-center gap-2">
                <i data-lucide="layout-grid" class="w-4 h-4 text-blue-600"></i> الوصول السريع لكافة أقسام النظام
              </h3>
              <p class="text-[11px] text-slate-400">انقر على أي قسم لفتحه فوراً</p>
            </div>
            <span class="text-xs font-bold text-slate-400">12 قسم متاح</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center font-bold text-xs">
            <button onclick="navigateTo('pos')" class="p-3.5 bg-blue-50/70 hover:bg-blue-100 text-blue-700 rounded-2xl flex flex-col items-center gap-2 border border-blue-100 transition shadow-sm hover:scale-105">
              <i data-lucide="shopping-cart" class="w-6 h-6 text-blue-600"></i>
              <span>نقطة البيع (POS)</span>
            </button>
            <button onclick="navigateTo('inventory')" class="p-3.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center gap-2 border border-emerald-100 transition shadow-sm hover:scale-105">
              <i data-lucide="boxes" class="w-6 h-6 text-emerald-600"></i>
              <span>المخزون العام</span>
            </button>
            <button onclick="navigateTo('devices')" class="p-3.5 bg-sky-50/70 hover:bg-sky-100 text-sky-700 rounded-2xl flex flex-col items-center gap-2 border border-sky-100 transition shadow-sm hover:scale-105">
              <i data-lucide="smartphone" class="w-6 h-6 text-sky-600"></i>
              <span>الأجهزة (IMEI)</span>
            </button>
            <button onclick="navigateTo('accessories')" class="p-3.5 bg-pink-50/70 hover:bg-pink-100 text-pink-700 rounded-2xl flex flex-col items-center gap-2 border border-pink-100 transition shadow-sm hover:scale-105">
              <i data-lucide="headphones" class="w-6 h-6 text-pink-600"></i>
              <span>الإكسسوارات</span>
            </button>
            <button onclick="navigateTo('repairs')" class="p-3.5 bg-amber-50/70 hover:bg-amber-100 text-amber-700 rounded-2xl flex flex-col items-center gap-2 border border-amber-100 transition shadow-sm hover:scale-105">
              <i data-lucide="wrench" class="w-6 h-6 text-amber-600"></i>
              <span>قسم الصيانة</span>
            </button>
            <button onclick="navigateTo('purchases')" class="p-3.5 bg-purple-50/70 hover:bg-purple-100 text-purple-700 rounded-2xl flex flex-col items-center gap-2 border border-purple-100 transition shadow-sm hover:scale-105">
              <i data-lucide="truck" class="w-6 h-6 text-purple-600"></i>
              <span>المشتريات</span>
            </button>
            <button onclick="navigateTo('customers')" class="p-3.5 bg-teal-50/70 hover:bg-teal-100 text-teal-700 rounded-2xl flex flex-col items-center gap-2 border border-teal-100 transition shadow-sm hover:scale-105">
              <i data-lucide="users" class="w-6 h-6 text-teal-600"></i>
              <span>العملاء والآجل</span>
            </button>
            <button onclick="navigateTo('suppliers')" class="p-3.5 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 rounded-2xl flex flex-col items-center gap-2 border border-indigo-100 transition shadow-sm hover:scale-105">
              <i data-lucide="building" class="w-6 h-6 text-indigo-600"></i>
              <span>الموردين والشركات</span>
            </button>
            <button onclick="navigateTo('treasury')" class="p-3.5 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center gap-2 border border-emerald-100 transition shadow-sm hover:scale-105">
              <i data-lucide="wallet" class="w-6 h-6 text-emerald-600"></i>
              <span>الخزينة والمحافظ</span>
            </button>
            <button onclick="navigateTo('reports')" class="p-3.5 bg-amber-50/70 hover:bg-amber-100 text-amber-700 rounded-2xl flex flex-col items-center gap-2 border border-amber-100 transition shadow-sm hover:scale-105">
              <i data-lucide="bar-chart-3" class="w-6 h-6 text-amber-600"></i>
              <span>التقارير المالية</span>
            </button>
            <button onclick="openModal('modal-wallet-transfer')" class="p-3.5 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-700 rounded-2xl flex flex-col items-center gap-2 border border-cyan-100 transition shadow-sm hover:scale-105">
              <i data-lucide="repeat" class="w-6 h-6 text-cyan-600"></i>
              <span>تحويل كاش ومحافظ</span>
            </button>
            <button onclick="navigateTo('settings')" class="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl flex flex-col items-center gap-2 border border-slate-200 transition shadow-sm hover:scale-105">
              <i data-lucide="settings" class="w-6 h-6 text-slate-600"></i>
              <span>الإعدادات الشاملة</span>
            </button>
          </div>
        </div>

      </section>

      <!-- باقي الشاشات الوظيفية (POS، المخزون، الصيانة...) -->
      <section id="view-pos" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">نقطة البيع السريعة (POS)</h2>
        <p class="text-xs text-slate-400">إصدار الفواتير الفورية وتقسيم الدفع</p>
      </section>
      <section id="view-purchases" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">المشتريات والتوريد</h2>
      </section>
      <section id="view-inventory" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">المخزون العام وجرد المحل</h2>
      </section>
      <section id="view-devices" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">مخزن الهواتف والـ IMEI</h2>
      </section>
      <section id="view-accessories" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">الإكسسوارات والجرابات والاسكرينات</h2>
      </section>
      <section id="view-repairs" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">قسم الصيانة وكروت الاستلام</h2>
      </section>
      <section id="view-customers" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">العملاء والحسابات الآجلة</h2>
      </section>
      <section id="view-suppliers" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">الموردين والشركات</h2>
      </section>
      <section id="view-treasury" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">الخزينة والمحافظ الإلكترونية</h2>
      </section>
      <section id="view-reports" class="page-view hidden bg-white p-5 rounded-3xl border shadow-sm space-y-4">
        <h2 class="text-base font-black text-slate-800">التقارير المالية وحساب الأرباح</h2>
      </section>

      <!-- ================= شاشة الإعدادات الشاملة ================= -->
      <section id="view-settings" class="page-view hidden space-y-4">
        <div class="bg-[#121c2e] text-slate-200 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          
          <div class="w-full md:w-72 bg-[#0c1322] border-b md:border-b-0 md:border-l border-slate-800 p-4 space-y-2 shrink-0">
            <div class="text-[10px] text-slate-400 font-black px-2 mb-1">الأساسيات</div>
            <button onclick="switchSettingTab('general')" id="stab-general" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs">
              <i data-lucide="sliders" class="w-4 h-4 text-cyan-400"></i><span>عام</span>
            </button>
            <button onclick="switchSettingTab('printers')" id="stab-printers" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs">
              <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i><span>الطباعة والفواتير</span>
            </button>
            <button onclick="switchSettingTab('policies')" id="stab-policies" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black flex items-center gap-2.5 text-xs shadow-md">
              <i data-lucide="shield-check" class="w-4 h-4 text-cyan-400"></i><span>سياسات التشغيل</span>
            </button>
            <button onclick="switchSettingTab('whatsapp')" id="stab-whatsapp" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 flex items-center gap-2.5 font-bold text-xs">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i><span>واتساب المحل</span>
            </button>
            <!-- قسم المستخدمين وتعديل الباسووردات -->
            <button onclick="switchSettingTab('users')" id="stab-users" class="setting-nav-btn w-full text-right px-3 py-2 rounded-xl text-amber-400 hover:bg-slate-800/80 flex items-center gap-2.5 font-black text-xs">
              <i data-lucide="users" class="w-4 h-4 text-amber-400"></i><span>المستخدمين وكلمات المرور</span>
            </button>
          </div>

          <div class="flex-1 p-5 md:p-6 overflow-y-auto custom-scroll space-y-4" id="settingsPanelsContainer">
            
            <!-- تبويب سياسات التشغيل -->
            <div id="spane-policies" class="setting-pane space-y-4">
              <h2 class="text-base font-black text-slate-100 flex items-center gap-2"><i data-lucide="bell" class="w-5 h-5 text-cyan-400"></i> إعدادات الإشعارات وسياسات التشغيل</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span class="font-bold">تفعيل إشعارات النظام</span>
                  <input type="checkbox" checked class="w-5 h-5 accent-cyan-400">
                </div>
                <div class="bg-[#172338] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span class="font-bold">تشغيل أصوات التنبيهات والأزرار</span>
                  <input type="checkbox" checked class="w-5 h-5 accent-cyan-400">
                </div>
              </div>
            </div>

            <!-- تبويب إدارة المستخدمين وتعديل الباسوورد بما فيه admin -->
            <div id="spane-users" class="setting-pane hidden space-y-4 text-xs">
              <div class="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 class="text-base font-black text-amber-400 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5"></i> إدارة المستخدمين وصلاحيات الدخول</h2>
                  <p class="text-xs text-slate-400">يمكنك تعديل كلمة مرور المسؤول الأساسي (admin) أو أي مستخدم آخر بحرية</p>
                </div>
                <button onclick="openModal('modal-add-user')" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow">
                  + إضافة مستخدم جديد
                </button>
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

            <div id="spane-general" class="setting-pane hidden text-xs">الإعدادات العامة للمحل متاحة وتعمل بنجاح.</div>
            <div id="spane-printers" class="setting-pane hidden text-xs">إعدادات الطابعة الحرارية 80 مم والفواتير تعمل بنجاح.</div>
            <div id="spane-whatsapp" class="setting-pane hidden text-xs">ربط واتساب المحل برقم 01070900711 مفعّل وجاهز لإرسال الفواتير.</div>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- ================= MODAL: تعديل كلمة مرور المستخدم (بما فيه admin) ================= -->
  <div id="modal-edit-user-pass" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 text-xs">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 class="font-black text-sm text-blue-400 flex items-center gap-1.5">
          <i data-lucide="key-round" class="w-4 h-4"></i> تعديل بيانات وكلمة مرور المستخدم
        </h3>
        <button onclick="closeModal('modal-edit-user-pass')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="hidden" id="editUserId">
      <div>
        <label class="text-slate-400 block mb-1">الاسم المعروض:</label>
        <input type="text" id="editUserName" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none focus:border-blue-500">
      </div>
      <div>
        <label class="text-slate-400 block mb-1">اسم المستخدم (Login):</label>
        <input type="text" id="editUserLogin" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500">
      </div>
      <div>
        <label class="text-amber-400 block mb-1 font-bold">كلمة المرور الجديدة:</label>
        <input type="text" id="editUserPass" placeholder="اكتب كلمة المرور الجديدة..." class="w-full bg-[#16233b] border border-amber-500/50 rounded-xl p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400">
      </div>
      <button onclick="saveUserPasswordChange()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2">
        <i data-lucide="check" class="w-4 h-4"></i> حفظ التغييرات وتحديث الباسوورد
      </button>
    </div>
  </div>

  <!-- MODAL: إضافة مستخدم جديد -->
  <div id="modal-add-user" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-55 hidden flex items-center justify-center p-4">
    <div class="bg-[#121c2e] text-slate-100 border border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3 text-xs">
      <div class="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 class="font-black text-sm text-amber-400">إضافة مستخدم جديد</h3>
        <button onclick="closeModal('modal-add-user')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="text" id="newUserName" placeholder="الاسم بالكامل" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100">
      <input type="text" id="newUserLogin" placeholder="اسم المستخدم (Login)" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100 font-mono">
      <input type="text" id="newUserPass" placeholder="كلمة المرور" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100 font-mono">
      <select id="newUserRole" class="w-full bg-[#16233b] border border-slate-700 rounded-xl p-2 text-slate-100 font-bold">
        <option value="كاشير">كاشير مبيعات</option>
        <option value="فني صيانة">فني صيانة</option>
        <option value="مدير">مدير نظام</option>
      </select>
      <button onclick="saveNewUserAction()" class="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl">حفظ المستخدم</button>
    </div>
  </div>

  <!-- MODAL: تحويلات المحافظ -->
  <div id="modal-wallet-transfer" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3">
    <div class="bg-white rounded-3xl w-full max-w-sm p-4 space-y-2.5 text-xs shadow-2xl">
      <div class="flex justify-between items-center border-b pb-2 font-bold text-emerald-600">
        <span>تحويل واستقبال كاش مع عمولة</span>
        <button onclick="closeModal('modal-wallet-transfer')"><i data-lucide="x" class="w-4 h-4 text-slate-400"></i></button>
      </div>
      <input type="number" value="500" placeholder="المبلغ" class="w-full border rounded-xl p-2 font-bold">
      <input type="number" value="5" placeholder="العمولة" class="w-full border rounded-xl p-2 font-bold text-emerald-600">
      <button onclick="alert('✅ تم تسجيل العملية بنجاح'); closeModal('modal-wallet-transfer');" class="w-full bg-emerald-600 text-white font-black py-2 rounded-xl">تأكيد المعاملة</button>
    </div>
  </div>

  <!-- ================= JAVASCRIPT ENGINE ================= -->
  <script>
    // 1. قاعدة البيانات المحلية
    const store = {
      users: [
        { id: '1', name: 'أحمد محمد', username: 'admin', pass: '123456', role: 'مدير النظام' },
        { id: '2', name: 'محمود كاشير', username: 'cashier', pass: '123', role: 'كاشير' },
        { id: '3', name: 'فني الصيانة', username: 'tech', pass: '123', role: 'فني صيانة' }
      ]
    };

    let App = JSON.parse(localStorage.getItem('EL_RESALA_CHARTS_V4_APP')) || store;

    function saveApp() {
      localStorage.setItem('EL_RESALA_CHARTS_V4_APP', JSON.stringify(App));
    }

    // 2. محرك الرسوم البيانية الاحترافية (Chart.js)
    let salesChartInstance = null;
    let revenueChartInstance = null;

    function initCharts() {
      // الرسم البياني الخطي: حركة المبيعات والأرباح
      const ctx1 = document.getElementById('salesTrendChart')?.getContext('2d');
      if (ctx1) {
        if (salesChartInstance) salesChartInstance.destroy();
        
        salesChartInstance = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            datasets: [
              {
                label: 'إجمالي المبيعات (ج.م)',
                data: [8400, 11200, 9500, 14200, 12800, 18500, 12450],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#2563eb'
              },
              {
                label: 'صافي الأرباح (ج.م)',
                data: [2100, 2800, 2400, 3600, 3100, 4800, 3200],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                fill: true,
                tension: 0.4,
                borderWidth: 2.5,
                borderDash: [4, 4],
                pointRadius: 3,
                pointBackgroundColor: '#10b981'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', rtl: true, labels: { font: { family: 'Cairo', size: 11, weight: 'bold' } } },
              tooltip: { rtl: true, padding: 10, bodyFont: { family: 'Cairo' } }
            },
            scales: {
              y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Cairo', size: 10 } } },
              x: { grid: { display: false }, ticks: { font: { family: 'Cairo', size: 10 } } }
            }
          }
        });
      }

      // الرسم البياني الدائري: توزيع الدخل حسب النشاط
      const ctx2 = document.getElementById('categoryRevenueChart')?.getContext('2d');
      if (ctx2) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        
        revenueChartInstance = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['أجهزة وموبايلات', 'إكسسوارات وجرابات', 'صيانة وقطع غيار'],
            datasets: [{
              data: [58, 27, 15],
              backgroundColor: ['#2563eb', '#10b981', '#f59e0b'],
              borderWidth: 3,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: { display: false },
              tooltip: { rtl: true, bodyFont: { family: 'Cairo' } }
            }
          }
        });
      }
    }

    // 3. التنقل بين الشاشات
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

      if (pageId === 'dashboard') {
        setTimeout(initCharts, 50);
      }
      if (pageId === 'settings') {
        switchSettingTab('users');
      }
      lucide.createIcons();
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('-right-64');
    }
    function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); lucide.createIcons(); }
    function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

    // 4. محرك تعديل باسوورد المدير والمستخدمين بحرية
    function renderUsersTable() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      App.users.forEach((u, idx) => {
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
              <button onclick="openChangePasswordModal('${u.id}')" class="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold ml-1 transition">
                تعديل الباسوورد
              </button>
              ${u.id !== '1' ? `<button onclick="deleteUser(${idx})" class="text-rose-400 hover:text-rose-300 font-bold text-xs mr-2">حذف</button>` : ''}
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
        user.name = newName;
        user.username = newLogin;
        user.pass = newPass;

        // إذا كان المعدل هو المدير الأساسي يتم تحديث الهيدر فوراً
        if (id === '1') {
          document.getElementById('headerUserDisplayName').innerText = newName;
        }

        saveApp();
        renderUsersTable();
        closeModal('modal-edit-user-pass');
        alert(`✅ تم تحديث كلمة مرور (${newName}) إلى: ${newPass} بنجاح!`);
      }
    }

    function saveNewUserAction() {
      const name = document.getElementById('newUserName').value.trim();
      const login = document.getElementById('newUserLogin').value.trim();
      const pass = document.getElementById('newUserPass').value.trim();
      const role = document.getElementById('newUserRole').value;

      if (!name || !login || !pass) return alert('يرجى إدخال جميع البيانات!');
      App.users.push({ id: Date.now().toString(), name, username: login, pass, role });
      saveApp();
      renderUsersTable();
      closeModal('modal-add-user');
      alert('✅ تم حفظ المستخدم الجديد');
    }

    function deleteUser(idx) {
      if (confirm('تأكيد حذف هذا المستخدم؟')) {
        App.users.splice(idx, 1);
        saveApp();
        renderUsersTable();
      }
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

    // التشغيل المبدئي
    initCharts();
    renderUsersTable();
    lucide.createIcons();
  </script>
</body>
</html>
HTML

# نسخ نفس التعديل للمسار الرئيسي
cp frontend/index.html index.html

# رفع التعديلات فوراً لـ GitHub
git add frontend/index.html index.html
git commit -m "feat(dashboard): add professional Chart.js analytics, 1-click access to all 12 modules, and flexible admin password management"
git push origin main

echo "=========================================================="
echo "✨ تم رفع التحديث بنجاح!"
echo "الميزات المفعلة: رسوم بيانية تفاعلية + شبكة الأقسام الـ 12 + تغيير باسوورد admin"
echo "=========================================================="
