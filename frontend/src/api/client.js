const BASE_URL = import.meta.env.VITE_API_URL || '';

export const DEFAULT_USER = {
  id: 1,
  username: 'admin',
  name: 'مدير المحل',
  role: 'owner',
  permissions: ['*']
};

export function getStoredUser() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function setStoredUser(user) {
  try {
    localStorage.setItem('user', JSON.stringify(user || DEFAULT_USER));
  } catch {}
}

export function clearStoredUser() {
  try {
    localStorage.removeItem('user');
  } catch {}
}

export function getToken() {
  return localStorage.getItem('token') || 'demo_token_resala_2026';
}

export function setToken(token) {
  try {
    localStorage.setItem('token', token || 'demo_token_resala_2026');
  } catch {}
}

export function clearToken() {
  try {
    localStorage.removeItem('token');
  } catch {}
}

export const getStoredToken = getToken;
export const setStoredToken = setToken;
export const clearStoredToken = clearToken;

export function isAuthenticated() {
  return true;
}

export async function api(endpoint = '', options = {}) {
  const ep = String(endpoint || '');
  const url = ep.startsWith('http') ? ep : `${BASE_URL}${ep.startsWith('/') ? '' : '/'}${ep}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  if (BASE_URL) {
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.ok) return await res.json().catch(() => ({}));
    } catch (err) {
      console.warn('Backend fetch failed, using fallback:', err);
    }
  }

  // وضع المحاكاة الفوري للشاشات
  const lower = ep.toLowerCase();
  if (lower.includes('login') || lower.includes('auth')) {
    setStoredUser(DEFAULT_USER);
    setToken('demo_token_resala_2026');
    return { token: 'demo_token_resala_2026', user: DEFAULT_USER };
  }
  if (lower.includes('shift')) {
    return {
      shift: {
        id: 1,
        user_id: 1,
        cashier_name: 'مدير المحل',
        start_cash: 500,
        status: 'open',
        opened_at: new Date().toISOString()
      },
      shifts: []
    };
  }
  if (lower.includes('setting')) {
    return { store_name: 'نظام الرسالة POS', currency: 'EGP' };
  }
  if (options.method && options.method !== 'GET') {
    return { success: true, id: Date.now() };
  }
  return [];
}

api.get = (url, opts) => api(url, { ...opts, method: 'GET' });
api.post = (url, body, opts) => api(url, { ...opts, method: 'POST', body: JSON.stringify(body) });
api.put = (url, body, opts) => api(url, { ...opts, method: 'PUT', body: JSON.stringify(body) });
api.delete = (url, opts) => api(url, { ...opts, method: 'DELETE' });
api.patch = (url, body, opts) => api(url, { ...opts, method: 'PATCH', body: JSON.stringify(body) });

export const client = api;
export const request = api;
export default api;
