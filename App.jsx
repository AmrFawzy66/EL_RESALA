import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import ShiftStatusBar from './components/ShiftStatusBar.jsx';

import POS from './views/POS.jsx';
import Maintenance from './views/Maintenance.jsx';
import Wallets from './views/Wallets.jsx';
import GlobalSearch from './views/GlobalSearch.jsx';
import Inventory from './views/Inventory.jsx';
import Customers from './views/Customers.jsx';
import Reports from './views/Reports.jsx';
import QuranPlayer from './views/QuranPlayer.jsx';
import SettingsView from './views/Settings.jsx';
import Login from './views/Login.jsx';

import { useShift } from './contexts/ShiftContext.jsx';

// Maps function keys to app sections — lets a cashier fly between the POS,
// repair desk, wallet console, and global search without touching the mouse.
const SHORTCUT_ROUTES = {
  F1: '/pos',
  F2: '/maintenance',
  F3: '/wallets',
  F4: '/search',
};

export default function App() {
  const navigate = useNavigate();
  const { currentUser } = useShift();

  useEffect(() => {
    function handleKeyDown(e) {
      const route = SHORTCUT_ROUTES[e.key];
      if (route) {
        e.preventDefault();
        navigate(route);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ShiftStatusBar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<POS />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/search" element={<GlobalSearch />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/quran" element={<QuranPlayer />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
