import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext.jsx';
import { api } from '../api/client.js';

export default function Login() {
  const { setCurrentUser } = useShift();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.auth.login(username, password);
      if (res.ok) {
        setCurrentUser(res.user);
      } else {
        setError(res.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-resala-950" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-resala-900">El-RESALA</h1>
          <p className="text-sm text-gray-500 mt-1">نظام الرسالة لإدارة المحلات</p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
          autoFocus
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-sm"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-resala-600 hover:bg-resala-700 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          <LogIn size={16} />
          {busy ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
}
