import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Wrench, Wallet, Search, Package, Users, BarChart3, BookAudio, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/pos', label: 'نقطة البيع', icon: ShoppingCart, shortcut: 'F1' },
  { to: '/maintenance', label: 'الصيانة', icon: Wrench, shortcut: 'F2' },
  { to: '/wallets', label: 'المحافظ', icon: Wallet, shortcut: 'F3' },
  { to: '/search', label: 'بحث شامل', icon: Search, shortcut: 'F4' },
  { to: '/inventory', label: 'المخزون', icon: Package },
  { to: '/customers', label: 'العملاء', icon: Users },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/quran', label: 'القرآن الكريم', icon: BookAudio },
  { to: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 h-full bg-resala-950 text-resala-50 flex flex-col">
      <div className="px-5 py-6 border-b border-resala-800">
        <h1 className="text-xl font-black leading-tight">El-RESALA</h1>
        <p className="text-sm text-resala-300 mt-0.5">نظام الرسالة</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, shortcut }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between mx-2 my-0.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-resala-600 text-white' : 'text-resala-200 hover:bg-resala-900'
              }`
            }
          >
            <span className="flex items-center gap-2">
              <Icon size={18} />
              {label}
            </span>
            {shortcut && <span className="text-[10px] text-resala-400 font-mono">{shortcut}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-resala-800 text-[11px] text-resala-400">
        El-RESALA POS v1.0.0 — Offline
      </div>
    </aside>
  );
}
