#!/bin/bash
set -e

echo "📦 جاري تجهيز واجهة EL-RESALA المتكاملة بنظام النوافذ المنبثقة..."

mkdir -p public

cat << 'HTML' > public/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EL-RESALA ERP & POS | نظام الرسالة المتكامل</title>
  <!-- Tailwind CSS & Lucide Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brandDark: '#0b111e',
            panelDark: '#131d2e',
            cardDark: '#1a263c',
            borderDark: '#23334d',
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
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #23334d; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
  </style>
</head>
<body class="bg-brandDark text-slate-100 h-screen w-screen overflow-hidden flex flex-col select-none">

  <!-- ================= TOP HEADER (مطابق للصورة) ================= -->
  <header class="bg-panelDark border-b border-borderDark px-4 py-2 flex items-center justify-between z-30 shadow-md">
    <!-- Quick Actions (أعلى اليمين) -->
    <div class="flex items-center gap-2">
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
      <button onclick="toggleBarcodeMode()" id="barcodeBtn" class="bg-cardDark hover:bg-borderDark text-xs px-3 py-1.5 rounded-lg border border-borderDark flex items-center gap-1 text-slate-300">
        <i data-lucide="barcode" class="w-4 h-4 text-emerald-400"></i> باركود
      </button>
      <div class="relative">
        <input type="text" id="globalSearch" placeholder="بحث شامل (Ctrl+K)..." class="bg-brandDark border border-borderDark rounded-lg px-3 py-1 text-xs w-48 focus:outline-none focus:border-accentCyan text-slate-200">
        <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2"></i>
      </div>
    </div>

    <!-- Date & Cash Drawer Info (أعلى اليسار - مطابق للصورة) -->
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
        <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i>
        <span id="currentDate">الجمعة 4 سبتمبر 2026</span>
      </span>

      <!-- Cash Drawer Status Badge -->
      <div class="bg-cardDark border border-borderDark rounded-xl px-3 py-1 flex items-center gap-3">
        <div class="text-right">
          <div class="text-[10px] text-slate-400 font-bold">الرصيد الحالي</div>
          <div class="text-sm font-extrabold text-accentGreen" id="topDrawerBalance">1,000.00 ج.م</div>
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

  <!-- ================= MAIN POS VIEWPORT ================= -->
  <main class="flex-1 flex overflow-hidden p-3 gap-3">
    <!-- Left: Cart & Billing Screen (35%) -->
    <div class="w-[380px] bg-panelDark border border-borderDark rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div class="bg-cardDark/80 p-3 border-b border-borderDark flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-accentCyan/10 rounded-xl text-accentCyan">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="font-bold text-sm">سلة المبيعات الفورية</h2>
            <p class="text-[11px] text-slate-400">فاتورة رقم: #<span id="invNumber">1092</span></p>
          </div>
        </div>
        <button onclick="clearCart()" class="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1">إفراغ</button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar" id="cartContainer">
        <!-- Default sample cart item matching image -->
        <div class="bg-cardDark p-2.5 rounded-xl border border-borderDark flex items-center justify-between">
          <div class="flex-1">
            <div class="font-bold text-xs flex items-center gap-1.5">
              <span>شاشة a12 أصلية</span>
              <span class="text-[10px] bg-accentCyan/10 text-accentCyan px-1.5 py-0.5 rounded">قطعة غيار</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">850.00 ج.م × 1</div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-sm text-accentGreen">850.00 ج.م</span>
            <button class="text-rose-400 hover:text-rose-300 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>
      </div>

      <!-- Cart Summary Footer -->
      <div class="bg-cardDark/95 p-3 border-t border-borderDark space-y-2">
        <div class="flex justify-between text-xs text-slate-400">
          <span>المجموع الفرعي:</span>
          <span class="text-slate-200 font-bold" id="cartSubtotal">850.00 ج.م</span>
        </div>
        <div class="flex justify-between text-xs text-slate-400">
          <span>الخصم:</span>
          <input type="number" value="0" id="cartDiscount" class="w-16 bg-brandDark border border-borderDark rounded px-1.5 py-0.5 text-center text-xs text-accentOrange" onchange="calcTotal()">
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-borderDark/60">
          <span class="font-bold text-sm">الإجمالي الصافي:</span>
          <span class="text-lg font-black text-accentGreen" id="cartGrandTotal">850.00 ج.م</span>
        </div>
        
        <!-- Checkout Button triggers the modal from Image 8 -->
        <button onclick="openModal('modal-checkout')" class="w-full bg-accentGreen hover:bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition text-sm">
          <i data-lucide="check-circle" class="w-4 h-4"></i> إتمام البيع (F10)
        </button>
      </div>
    </div>

    <!-- Right: Product Catalog & Quick Touch Grid (65%) -->
    <div class="flex-1 bg-panelDark border border-borderDark rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <!-- Category Tabs -->
      <div class="p-3 border-b border-borderDark flex items-center justify-between bg-cardDark/50">
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button class="bg-accentCyan text-slate-900 font-black text-xs px-3.5 py-1.5 rounded-xl shadow">الكل</button>
          <button class="bg-cardDark hover:bg-borderDark text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition">هواتف محمولة</button>
          <button class="bg-cardDark hover:bg-borderDark text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition">إكسسوارات</button>
          <button class="bg-cardDark hover:bg-borderDark text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition">قطع غيار</button>
          <button class="bg-cardDark hover:bg-borderDark text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition">اسكرينات وجرابات</button>
        </div>
        <span class="text-xs text-slate-400 bg-brandDark px-2.5 py-1 rounded-lg border border-borderDark font-bold">18 صنف متاح</span>
      </div>

      <!-- Products Grid -->
      <div class="flex-1 p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar">
        <!-- Item 1: Device with IMEI -->
        <div onclick="addCartItem('iPhone 13 128GB', 26500, true)" class="bg-cardDark hover:border-accentCyan border border-borderDark p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition transform active:scale-95 group">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] bg-accentCyan/15 text-accentCyan px-2 py-0.5 rounded-md font-bold">موبايل</span>
              <span class="text-[10px] text-emerald-400">متوفر (2)</span>
            </div>
            <h3 class="font-bold text-sm mt-2 text-slate-100 group-hover:text-accentCyan transition">iPhone 13 128GB</h3>
            <p class="text-[11px] text-slate-400">أزرق | جديد ضمان سنة</p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-borderDark/40 pt-2">
            <span class="text-xs font-black text-accentGreen">26,500 ج.م</span>
            <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 group-hover:text-accentCyan"></i>
          </div>
        </div>

        <!-- Item 2: Part -->
        <div onclick="addCartItem('شاشة a12 توكيل', 850, false)" class="bg-cardDark hover:border-accentCyan border border-borderDark p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition transform active:scale-95 group">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-md font-bold">قطعة غيار</span>
              <span class="text-[10px] text-emerald-400">متوفر (5)</span>
            </div>
            <h3 class="font-bold text-sm mt-2 text-slate-100 group-hover:text-accentCyan transition">شاشة a12 أصلية</h3>
            <p class="text-[11px] text-slate-400">سامسونج - ضمان فحص</p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-borderDark/40 pt-2">
            <span class="text-xs font-black text-accentGreen">850 ج.م</span>
            <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 group-hover:text-accentCyan"></i>
          </div>
        </div>

        <!-- Item 3: Accessory -->
        <div onclick="addCartItem('جراب حماية MagSafe', 250, false)" class="bg-cardDark hover:border-accentCyan border border-borderDark p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition transform active:scale-95 group">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-md font-bold">إكسسوار</span>
              <span class="text-[10px] text-emerald-400">متوفر (12)</span>
            </div>
            <h3 class="font-bold text-sm mt-2 text-slate-100 group-hover:text-accentCyan transition">جراب MagSafe آيفون</h3>
            <p class="text-[11px] text-slate-400">شفاف ضد الصدمات</p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-borderDark/40 pt-2">
            <span class="text-xs font-black text-accentGreen">250 ج.م</span>
            <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 group-hover:text-accentCyan"></i>
          </div>
        </div>

        <!-- Item 4: Screen Protector -->
        <div onclick="addCartItem('اسكرينة 11D سيراميك', 65, false)" class="bg-cardDark hover:border-accentCyan border border-borderDark p-3 rounded-2xl flex flex-col justify-between cursor-pointer transition transform active:scale-95 group">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md font-bold">اسكرينات</span>
              <span class="text-[10px] text-emerald-400">متوفر (30)</span>
            </div>
            <h3 class="font-bold text-sm mt-2 text-slate-100 group-hover:text-accentCyan transition">اسكرينة 11D سيراميك</h3>
            <p class="text-[11px] text-slate-400">مقاومة للبصمات والكسر</p>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-borderDark/40 pt-2">
            <span class="text-xs font-black text-accentGreen">65 ج.م</span>
            <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400 group-hover:text-accentCyan"></i>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- ================= BOTTOM DOCKED NAVIGATION (مطابق لشريط النظام بالأسفل) ================= -->
  <footer class="bg-panelDark border-t border-borderDark px-2 py-1 flex items-center justify-around z-30">
    <button onclick="closeAllModals()" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="home" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">الرئيسية</span>
    </button>
    <button onclick="closeAllModals()" class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl bg-accentCyan/20 text-accentCyan border border-accentCyan/30 transition">
      <i data-lucide="shopping-bag" class="w-4 h-4"></i>
      <span class="text-[11px] font-black">نقطة البيع</span>
    </button>
    <button onclick="openModal('modal-repairs-hub')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="wrench" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">الصيانة</span>
    </button>
    <button onclick="openModal('modal-transfers')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">التحويلات</span>
    </button>
    <button onclick="openModal('modal-inventory')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="boxes" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">المخزون</span>
    </button>
    <button onclick="openModal('modal-sales-history')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="trending-up" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">المبيعات</span>
    </button>
    <button onclick="openModal('modal-cash-drawer')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="credit-card" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">الحسابات</span>
    </button>
    <button onclick="openModal('modal-settings')" class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-accentCyan transition">
      <i data-lucide="settings" class="w-4 h-4"></i>
      <span class="text-[11px] font-bold">الإعدادات</span>
    </button>
  </footer>

  <!-- ========================================================================= -->
  <!-- MODAL 1: إتمام البيع (مطابق بالكامل للصورة رقم 55438) -->
  <!-- ========================================================================= -->
  <div id="modal-checkout" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#182234] border border-borderDark rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="bg-cardDark px-4 py-2.5 border-b border-borderDark flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="bg-accentGreen/20 text-accentGreen font-black px-2.5 py-1 rounded-lg text-xs" id="checkoutHeaderTotal">850.00 ج.م</span>
          <h2 class="text-sm font-bold flex items-center gap-1.5">
            <i data-lucide="shopping-cart" class="w-4 h-4 text-accentCyan"></i> إتمام البيع
          </h2>
        </div>
        <button onclick="closeModal('modal-checkout')" class="text-slate-400 hover:text-white p-1 rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- عمود اليمين: بيانات العميل -->
        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-300 flex items-center gap-1">
            <i data-lucide="user" class="w-3.5 h-3.5 text-accentCyan"></i> العميل
          </div>
          <div class="flex gap-2">
            <button class="flex-1 bg-accentCyan text-slate-900 font-bold py-1 rounded-lg text-xs">عميل</button>
            <button class="flex-1 bg-cardDark text-slate-400 py-1 rounded-lg text-xs font-bold border border-borderDark">مورد</button>
          </div>
          <input type="text" placeholder="عميل نقدي — اكتب اسم أو رقم هاتف العميل" class="w-full bg-brandDark border border-borderDark rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accentCyan">
          <input type="text" placeholder="رقم الهاتف (اختياري)" class="w-full bg-brandDark border border-borderDark rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none">

          <!-- عناصر السلة المصغرة -->
          <div class="bg-cardDark/60 p-2 rounded-xl border border-borderDark">
            <div class="text-[11px] font-bold text-slate-400 mb-1.5">عناصر السلة (1 عنصر):</div>
            <div class="text-xs flex justify-between items-center bg-brandDark/80 p-2 rounded-lg">
              <span>شاشة a12</span>
              <span class="text-accentGreen font-bold">850.00 ج.م</span>
            </div>
          </div>
        </div>

        <!-- عمود اليسار: طريقة الدفع والمحافظ والتقسيم -->
        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-300 flex items-center gap-1">
            <i data-lucide="wallet" class="w-3.5 h-3.5 text-accentCyan"></i> طريقة الدفع
          </div>
          
          <!-- أزرار طرق الدفع السريعة (مطابقة للصورة) -->
          <div class="grid grid-cols-5 gap-1.5">
            <button onclick="selectPaymentMode('cash')" id="payBtn-cash" class="bg-accentCyan text-slate-900 font-black p-2 rounded-xl text-center flex flex-col items-center gap-1">
              <i data-lucide="banknote" class="w-4 h-4"></i>
              <span class="text-[10px]">كاش سائل</span>
            </button>
            <button onclick="selectPaymentMode('wallet')" id="payBtn-wallet" class="bg-cardDark text-slate-300 hover:text-white p-2 rounded-xl text-center flex flex-col items-center gap-1 border border-borderDark">
              <i data-lucide="smartphone" class="w-4 h-4 text-accentCyan"></i>
              <span class="text-[10px]">محفظة</span>
            </button>
            <button onclick="selectPaymentMode('bank')" id="payBtn-bank" class="bg-cardDark text-slate-300 hover:text-white p-2 rounded-xl text-center flex flex-col items-center gap-1 border border-borderDark">
              <i data-lucide="landmark" class="w-4 h-4 text-blue-400"></i>
              <span class="text-[10px]">حساب بنكي</span>
            </button>
            <button onclick="selectPaymentMode('credit')" id="payBtn-credit" class="bg-cardDark text-slate-300 hover:text-white p-2 rounded-xl text-center flex flex-col items-center gap-1 border border-borderDark">
              <i data-lucide="clock" class="w-4 h-4 text-amber-400"></i>
              <span class="text-[10px]">آجل</span>
            </button>
            <button onclick="selectPaymentMode('split')" id="payBtn-split" class="bg-cardDark text-slate-300 hover:text-white p-2 rounded-xl text-center flex flex-col items-center gap-1 border border-borderDark">
              <i data-lucide="divide" class="w-4 h-4 text-purple-400"></i>
              <span class="text-[10px]">تقسيم</span>
            </button>
          </div>

          <!-- قائمة اختيار المحفظة أو الحساب -->
          <div class="space-y-1">
            <label class="text-[11px] text-slate-400 font-semibold">اختر المحفظة / الخزنة:</label>
            <select class="w-full bg-brandDark border border-borderDark rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
              <option>كاش سائل - افتراضي (الخزينة)</option>
              <option>Vodafone Cash - محفظة المحل</option>
              <option>InstaPay - الحساب البنكي</option>
              <option>Orange Cash</option>
            </select>
          </div>

          <!-- خيار استبدال جهاز -->
          <div class="flex items-center justify-between p-2 bg-cardDark rounded-xl border border-borderDark">
            <span class="text-xs font-semibold">استبدال جهاز (خصم قيمة جهاز العميل)</span>
            <input type="checkbox" class="w-4 h-4 accent-accentCyan">
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="bg-cardDark px-4 py-3 border-t border-borderDark flex items-center justify-between">
        <div class="text-xs">
          <span class="text-slate-400 font-semibold">الإجمالي: </span>
          <span class="text-base font-extrabold text-accentGreen">850.00 ج.م</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="closeModal('modal-checkout')" class="px-4 py-1.5 rounded-xl border border-borderDark text-xs font-bold text-slate-300 hover:bg-borderDark">إلغاء</button>
          <button onclick="printThermalInvoice()" class="bg-accentOrange hover:bg-amber-600 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 transition">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> طباعة
          </button>
          <button onclick="confirmCheckoutSuccess()" class="bg-accentGreen hover:bg-emerald-600 text-white font-extrabold px-5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition">
            <i data-lucide="check" class="w-4 h-4"></i> تأكيد البيع 850.00 ج.م
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL 2: درج الكاش وإدارة المحافظ (مطابق للصورة رقم 56010 و 56057) -->
  <!-- ========================================================================= -->
  <div id="modal-cash-drawer" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#121b2b] border border-borderDark rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
      
      <!-- Drawer Header -->
      <div class="bg-cardDark px-4 py-3 border-b border-borderDark flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-accentGreen/15 rounded-lg text-accentGreen">
            <i data-lucide="wallet" class="w-5 h-5"></i>
          </div>
          <div>
            <h2 class="font-extrabold text-sm text-slate-100">درج الكاش (admin)</h2>
            <p class="text-[11px] text-slate-400">إجمالي ما سيسجل في الخزينة: <span class="text-accentGreen font-bold">1,000.00 ج.م</span></p>
          </div>
        </div>
        <button onclick="closeModal('modal-cash-drawer')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <!-- ملخص المحافظ والحسابات الثلاثة الرئيسية -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- كاش سائل -->
          <div class="bg-cardDark p-3 rounded-2xl border border-borderDark">
            <div class="text-[11px] text-slate-400 font-bold">كاش سائل - افتراضي (الخزينة)</div>
            <div class="text-lg font-black text-slate-100 mt-1">0.00 ج.م</div>
            <div class="flex justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-borderDark/40">
              <span>مبيعات: 0.00</span>
              <span class="text-emerald-400">الصافي: 0.00</span>
            </div>
          </div>

          <!-- محفظة إلكترونية -->
          <div class="bg-cardDark p-3 rounded-2xl border border-borderDark">
            <div class="text-[11px] text-accentCyan font-bold">محفظة إلكترونية - فودافون / وي</div>
            <div class="text-lg font-black text-slate-100 mt-1">1,000.00 ج.م</div>
            <div class="flex justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-borderDark/40">
              <span>مبيعات: 0.00</span>
              <span class="text-emerald-400">الصافي: 1,000.00</span>
            </div>
          </div>

          <!-- حساب بنكي -->
          <div class="bg-cardDark p-3 rounded-2xl border border-borderDark">
            <div class="text-[11px] text-blue-400 font-bold">الحسابات البنكية (انستاباي)</div>
            <div class="text-lg font-black text-slate-100 mt-1">0.00 ج.م</div>
            <div class="flex justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-borderDark/40">
              <span>مبيعات: 0.00</span>
              <span class="text-emerald-400">الصافي: 0.00</span>
            </div>
          </div>
        </div>

        <!-- أزرار الحركات السريعة (سحب، إيداع، تحويل، مصروف) -->
        <div class="flex items-center gap-2">
          <button onclick="promptTransaction('إيداع')" class="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
            <i data-lucide="arrow-down-circle" class="w-4 h-4"></i> إيداع نقدية
          </button>
          <button onclick="promptTransaction('سحب')" class="flex-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
            <i data-lucide="arrow-up-circle" class="w-4 h-4"></i> سحب من الخزينة
          </button>
          <button onclick="openModal('modal-transfers')" class="flex-1 bg-accentCyan/20 hover:bg-accentCyan/30 text-accentCyan border border-accentCyan/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
            <i data-lucide="repeat" class="w-4 h-4"></i> تحويل بين المحافظ
          </button>
        </div>

        <!-- جدول الحركات اليومية -->
        <div class="bg-cardDark rounded-xl border border-borderDark p-3">
          <h3 class="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <i data-lucide="list" class="w-4 h-4 text-accentCyan"></i> حركات الشفت الحالي
          </h3>
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between p-2 bg-brandDark/60 rounded-lg">
              <span class="text-slate-300">إيداع محفظة فودافون كاش (تحصيل صيانة)</span>
              <span class="text-accentGreen font-bold">+1,000.00 ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL 3: تقفيل الشفت ومطابقة الكاش (مطابق للصورة رقم 56029 و 56051) -->
  <!-- ========================================================================= -->
  <div id="modal-close-shift" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#162132] border border-borderDark rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
      <div class="bg-cardDark px-4 py-3 border-b border-borderDark flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-accentOrange flex items-center gap-1.5">
          <i data-lucide="lock" class="w-4 h-4"></i> تقفيل الشفت ومطابقة النقدية
        </h2>
        <button onclick="closeModal('modal-close-shift')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <div class="p-4 space-y-4">
        <!-- خطوة 1: الكاش السائل والمطابقة -->
        <div class="bg-cardDark/80 p-3 rounded-xl border border-borderDark space-y-2">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-slate-300">1. مطابقة الكاش السائل</span>
            <span class="text-accentCyan">المتوقع: 0.00 ج.م</span>
          </div>
          <input type="number" id="countedCash" placeholder="اعد الكاش واكتب الرقم الفعلي هنا..." class="w-full bg-brandDark border border-borderDark rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-accentGreen">
          <p class="text-[10px] text-slate-400">سيبها فاضية لو مش عايز تعمل مطابقة — التقفيل هيتم بدون عجز أو زيادة.</p>
        </div>

        <!-- خطوة 2: ملاحظات -->
        <div class="bg-cardDark/80 p-3 rounded-xl border border-borderDark space-y-1.5">
          <label class="text-xs font-bold text-slate-300">2. ملاحظات الشفت (اختياري)</label>
          <textarea rows="2" placeholder="أي ملاحظات عن تقفيل اليوم أو مصروفات مؤجلة..." class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none"></textarea>
        </div>

        <!-- خطوة 3: أزرار التقفيل والطباعة -->
        <div class="space-y-2 pt-2">
          <button onclick="printThermalShiftReport()" class="w-full bg-accentOrange hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition">
            <i data-lucide="printer" class="w-4 h-4"></i> طباعة تقرير الشفت على الطابعة الحرارية
          </button>
          <button onclick="confirmCloseShift()" class="w-full bg-accentGreen hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i> تقفيل الشفت الآن وتصفير الدرج
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL 4: الإعدادات وطباعة الفواتير (مطابق للصور 55441, 55442, 55443) -->
  <!-- ========================================================================= -->
  <div id="modal-settings" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#121b2b] border border-borderDark rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl overflow-hidden flex flex-col">
      
      <!-- Settings Header -->
      <div class="bg-cardDark px-4 py-3 border-b border-borderDark flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <i data-lucide="settings" class="w-4 h-4 text-accentCyan"></i> إعدادات نظام EL-RESALA
        </h2>
        <button onclick="closeModal('modal-settings')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar Tabs -->
        <div class="w-48 bg-cardDark/50 border-l border-borderDark p-2 space-y-1">
          <button class="w-full text-right px-3 py-2 rounded-xl text-xs font-bold bg-accentCyan/20 text-accentCyan border border-accentCyan/30">الطباعة والفواتير</button>
          <button class="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-borderDark">المحافظ والعمولات</button>
          <button class="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-borderDark">سياسات التشغيل</button>
          <button class="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-borderDark">الصيانة والضمان</button>
        </div>

        <!-- Tab Content: Thermal & Printer Settings -->
        <div class="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
          <!-- Printer Options -->
          <div class="bg-cardDark p-4 rounded-2xl border border-borderDark space-y-3">
            <h3 class="text-xs font-bold text-accentCyan flex items-center gap-1.5">
              <i data-lucide="printer" class="w-4 h-4"></i> إعدادات الطابعة الحرارية
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] text-slate-400">مقاس ورق الفاتورة:</label>
                <select class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 mt-1">
                  <option>حرارية (رول 80 مم) — الافتراضي</option>
                  <option>حرارية (رول 58 مم)</option>
                  <option>ورق عادي A4</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] text-slate-400">طباعة مباشرة (بدون نافذة الويندوز):</label>
                <div class="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked class="w-4 h-4 accent-accentGreen">
                  <span class="text-xs text-slate-300">طباعة فورية بضغطة زر</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Header & Footer Text for Invoices -->
          <div class="bg-cardDark p-4 rounded-2xl border border-borderDark space-y-3">
            <h3 class="text-xs font-bold text-slate-200">بيانات تظهر على الفواتير (EL-RESALA)</h3>
            <div class="space-y-2">
              <input type="text" value="EL-RESALA - لخدمات المحمول والمبيعات والصيانة" class="w-full bg-brandDark border border-borderDark rounded-lg px-3 py-1.5 text-xs text-slate-200">
              <input type="text" value="العنوان: شبرا الخيمة - هاتف: 01070900711" class="w-full bg-brandDark border border-borderDark rounded-lg px-3 py-1.5 text-xs text-slate-200">
              <textarea rows="2" class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200">البضاعة المباعة ترد وتستبدل خلال 14 يوماً بشرط حالتها الأصلية مع الفاتورة والعلبة.</textarea>
            </div>
            <button onclick="saveSettings()" class="bg-accentGreen hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">حفظ الإعدادات</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- MODAL 5: كروت الصيانة والأجهزة (Job Cards) -->
  <!-- ========================================================================= -->
  <div id="modal-repair-job" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-[#141e2e] border border-borderDark rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
      <div class="bg-cardDark px-4 py-3 border-b border-borderDark flex items-center justify-between">
        <h2 class="text-sm font-extrabold text-accentCyan flex items-center gap-1.5">
          <i data-lucide="wrench" class="w-4 h-4"></i> كارت استلام جهاز صيانة جديد
        </h2>
        <button onclick="closeModal('modal-repair-job')" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <input type="text" placeholder="اسم العميل" class="bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none">
          <input type="text" placeholder="رقم هاتف العميل" class="bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" placeholder="موديل الجهاز (مثال: Samsung A54)" class="bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none">
          <input type="text" placeholder="الـ IMEI أو السيريال" class="bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none">
        </div>
        <textarea rows="2" placeholder="العطل المذكور من العميل وحالة الاستلام (خدوش، بدون شاحن)..." class="w-full bg-brandDark border border-borderDark rounded-lg p-2 text-xs text-slate-200 focus:outline-none"></textarea>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="text-[10px] text-slate-400">تكلفة الكشف المبدئي:</label>
            <input type="number" value="50" class="w-full bg-brandDark border border-borderDark rounded-lg p-1.5 text-xs text-accentGreen font-bold">
          </div>
          <div>
            <label class="text-[10px] text-slate-400">الفني المسؤول:</label>
            <select class="w-full bg-brandDark border border-borderDark rounded-lg p-1.5 text-xs text-slate-200">
              <option>فني الصيانة 1</option>
              <option>فني السوفت وير</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] text-slate-400">نسبة عمولة الفني (%):</label>
            <input type="number" value="30" class="w-full bg-brandDark border border-borderDark rounded-lg p-1.5 text-xs text-amber-400 font-bold">
          </div>
        </div>
        <button onclick="confirmNewRepair()" class="w-full bg-accentCyan hover:bg-cyan-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition shadow mt-2">
          إنشاء إيصال الاستلام وطباعة الباركود الحراري
        </button>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT STATE ENGINE -->
  <script>
    // تهيئة الأيقونات
    lucide.createIcons();

    // إدارة النوافذ المنبثقة (Modals)
    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      lucide.createIcons();
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    function closeAllModals() {
      document.querySelectorAll('[id^="modal-"]').forEach(modal => modal.classList.add('hidden'));
    }

    // إغلاق أي نافذة بزر ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
      if (e.key === 'F10') {
        e.preventDefault();
        openModal('modal-checkout');
      }
    });

    // حالة السلة والحسابات
    let cart = [
      { name: 'شاشة a12 أصلية', price: 850, qty: 1 }
    ];

    function addCartItem(name, price, isDevice) {
      if (isDevice) {
        const imei = prompt(`أدخل الـ IMEI للجهاز (${name}):`);
        if (!imei) return alert('يجب إدخال الـ IMEI لتسجيل بيع الجهاز والضمان.');
      }
      cart.push({ name, price, qty: 1 });
      renderCart();
    }

    function renderCart() {
      const container = document.getElementById('cartContainer');
      container.innerHTML = '';
      let total = 0;

      cart.forEach((item, idx) => {
        total += item.price * item.qty;
        container.innerHTML += `
          <div class="bg-cardDark p-2.5 rounded-xl border border-borderDark flex items-center justify-between">
            <div class="flex-1">
              <div class="font-bold text-xs">${item.name}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">${item.price.toFixed(2)} ج.م × ${item.qty}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-sm text-accentGreen">${(item.price * item.qty).toFixed(2)} ج.م</span>
              <button onclick="removeCartItem(${idx})" class="text-rose-400 hover:text-rose-300 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
          </div>
        `;
      });

      document.getElementById('cartSubtotal').innerText = `${total.toFixed(2)} ج.م`;
      document.getElementById('cartGrandTotal').innerText = `${total.toFixed(2)} ج.م`;
      document.getElementById('checkoutHeaderTotal').innerText = `${total.toFixed(2)} ج.م`;
      lucide.createIcons();
    }

    function removeCartItem(index) {
      cart.splice(index, 1);
      renderCart();
    }

    function clearCart() {
      cart = [];
      renderCart();
    }

    function selectPaymentMode(mode) {
      ['cash', 'wallet', 'bank', 'credit', 'split'].forEach(m => {
        const btn = document.getElementById(`payBtn-${m}`);
        if (m === mode) {
          btn.className = 'bg-accentCyan text-slate-900 font-black p-2 rounded-xl text-center flex flex-col items-center gap-1';
        } else {
          btn.className = 'bg-cardDark text-slate-300 hover:text-white p-2 rounded-xl text-center flex flex-col items-center gap-1 border border-borderDark';
        }
      });
    }

    function confirmCheckoutSuccess() {
      alert('✅ تم تسجيل الفاتورة بنجاح، وخصم البضاعة من المخزن، وتحديث رصيد الخزينة/المحفظة.');
      closeModal('modal-checkout');
      clearCart();
    }

    function printThermalInvoice() {
      window.open('/api/print/receipt/sample', '_blank');
    }

    function confirmCloseShift() {
      alert('🔒 تم تقفيل شفت الكاشير الحالي بنجاح وتسجيل المبالغ في أرصدة الخزينة.');
      closeModal('modal-close-shift');
    }

    function printThermalShiftReport() {
      alert('🖨️ جاري إرسال أمر تقرير الشفت إلى الطابعة الحرارية (80 مم)...');
    }

    function saveSettings() {
      alert('💾 تم حفظ إعدادات الطابعة والترويسة بنجاح.');
      closeModal('modal-settings');
    }

    function confirmNewRepair() {
      alert('🛠️ تم تسجيل كارت الصيانة بنجاح، وجاري طباعة إيصال استلام العميل مع الباركود.');
      closeModal('modal-repair-job');
    }
  </script>
</body>
</html>
HTML

# 2. التأكد من ربط ملف الواجهة بالسيرفر مباشرة
cat << 'SERVER' > src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// تقديم واجهة المستخدم الثابتة
app.use(express.static(path.join(__dirname, '../public')));

// مسار الفاتورة الحرارية للتجربة
app.get('/api/print/receipt/sample', (req: Request, res: Response) => {
  const receipt = `
================================================
                   EL-RESALA
           خدمات المحمول والمبيعات والصيانة
       العنوان: شبرا الخيمة - هاتف: 01070900711
================================================
رقم الفاتورة: #INV-2026-1092
التاريخ: ${new Date().toLocaleString('ar-EG')}
الكاشير: مسؤول النظام (admin)
العميل: عميل نقدي
------------------------------------------------
الصنف             الكمية      السعر      الإجمالي
------------------------------------------------
شاشة a12 أصلية      1         850.00      850.00
------------------------------------------------
الصافي المستحق:                        850.00 ج.م
المدفوع (كاش سائل):                    850.00 ج.م
المتبقي:                                 0.00 ج.م
================================================
* البضاعة المباعة ترد وتستبدل خلال 14 يوماً *
           شكراً لتعاملكم مع EL-RESALA
  `;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(receipt);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 نظام EL-RESALA يعمل الآن بالواجهة الكاملة:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
SERVER

echo "✅ تم البناء بنجاح! شغل الآن:"
echo "npx ts-node src/server.ts"
