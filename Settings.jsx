import React, { useState } from 'react';
import { Settings as SettingsIcon, Eye, Printer, Rows, Palette, Check, Clock3, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { getPrinterConfig, savePrinterConfig } from '../utils/printerConfig.js';
import LiveClock from '../components/LiveClock.jsx';

/**
 * Settings.jsx — visual ergonomics + hardware endpoint reference.
 * Theme (incl. dark mode), eye-comfort mode, and font density are all
 * driven by ThemeContext and persisted to localStorage exactly as before.
 *
 * IMPORTANT CHANGE FROM THE DESKTOP APP: in the web edition, printing no
 * longer happens directly from this browser tab — a browser has no way
 * to open a raw TCP socket to a LAN printer, wherever the cashier is
 * browsing from. The printer IP/port fields below are still saved
 * locally (so this screen still "remembers" your printers for
 * reference), but the values that are ACTUALLY used when printing live
 * in the print-agent's .env file, running on the PC physically wired to
 * the printers in the shop. Keep both in sync manually.
 */
export default function SettingsView() {
  const { theme, setTheme, eyeComfort, toggleEyeComfort, compact, toggleCompact, themes } = useTheme();
  const [printerCfg, setPrinterCfg] = useState(getPrinterConfig());
  const [saved, setSaved] = useState(false);

  function updatePrinter(field, value) {
    const merged = savePrinterConfig({ [field]: value });
    setPrinterCfg(merged);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <SettingsIcon size={20} className="text-resala-600" /> الإعدادات
      </h2>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
          <Clock3 size={16} /> الوقت والتاريخ
        </h3>
        <div className="bg-gray-50 rounded-lg p-3">
          <LiveClock />
        </div>
        <p className="text-[11px] text-gray-400">تظهر الساعة والتاريخ الحيّان في الشريط العلوي بجميع شاشات النظام.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
          <Palette size={16} /> ثيمات الواجهة
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-right transition-colors ${
                theme === t.id ? 'border-resala-600 ring-2 ring-resala-100 bg-resala-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="w-4 h-4 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: t.swatch }} />
              <span className="flex-1">{t.name}</span>
              {theme === t.id && <Check size={14} className="text-resala-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
          <Eye size={16} /> الراحة البصرية
        </h3>
        <ToggleRow label="وضع راحة العين (خلفية دافئة)" checked={eyeComfort} onChange={toggleEyeComfort} />
        <ToggleRow label="كثافة مضغوطة للخط" checked={compact} onChange={toggleCompact} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
          <Printer size={16} /> إعدادات الطابعات (مرجعية)
        </h3>
        <p className="text-[11px] bg-amber-50 text-amber-800 rounded-lg p-2.5 leading-relaxed">
          ملاحظة مهمة: بعد تحويل النظام لموقع ويب، الطباعة الفعلية لم تعد تتم من هذا المتصفح مباشرة — بل عن طريق
          برنامج صغير (print-agent) يعمل على جهاز الكاشير في المحل نفسه، وهو المتصل فعلياً بالطابعات. القيم
          المحفوظة هنا للمرجعية والتذكير فقط؛ يجب ضبط نفس عناوين الـ IP في ملف <code dir="ltr">.env</code> الخاص
          بالـ print-agent حتى تعمل الطباعة فعلياً.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">IP طابعة الإيصالات الحرارية</label>
            <input
              value={printerCfg.receiptIp}
              onChange={(e) => updatePrinter('receiptIp', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">منفذ طابعة الإيصالات</label>
            <input
              type="number"
              value={printerCfg.receiptPort}
              onChange={(e) => updatePrinter('receiptPort', Number(e.target.value) || 9100)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">IP طابعة الملصقات (باركود)</label>
            <input
              value={printerCfg.labelIp}
              onChange={(e) => updatePrinter('labelIp', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">منفذ طابعة الملصقات</label>
            <input
              type="number"
              value={printerCfg.labelPort}
              onChange={(e) => updatePrinter('labelPort', Number(e.target.value) || 9100)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <Rows size={12} /> راجع ملف print-agent/.env.example ضمن حزمة المشروع لمعرفة كيفية ضبط هذه القيم فعلياً.
        </p>
        {saved && (
          <p className="text-[11px] text-resala-600 flex items-center gap-1">
            <Zap size={12} /> تم الحفظ محلياً في هذا المتصفح
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 text-[11px] text-gray-400">
        تقارير A4 (المبيعات، المخزون، العملاء، سجل التدقيق، الورديات) تُطبع عبر مربع حوار طباعة نظام التشغيل — يمكن اختيار أي
        طابعة مثبتة على جهازك. إيصالات البيع والصيانة والوردية تُرسل كطلب طباعة إلى السيرفر، ويتولى برنامج print-agent
        طباعتها بصمت على الطابعة الحرارية في المحل.
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between text-sm cursor-pointer">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-resala-600" />
    </label>
  );
}
