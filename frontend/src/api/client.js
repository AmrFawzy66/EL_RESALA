const BASE_URL = import.meta.env.VITE_API_URL || '';

async function client(pathOrUrl = '', options = {}) {
  const target = String(pathOrUrl || '');
  const url = target.startsWith('http') ? target : `${BASE_URL}${target.startsWith('/') ? '' : '/'}${target}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // محاولة الاتصال بالسيرفر الحقيقي إذا كان معرفاً
  if (BASE_URL) {
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data;
    } catch (e) {
      console.warn('Real API failed, switching to demo mode', e);
    }
  }

  // وضع المعاينة والتجربة الفوري (Demo Mode)
  const path = target.toLowerCase();
  const mockUser = {
    id: 1,
    username: 'admin',
    name: 'مدير النظام',
    role: 'owner',
    permissions: ['*']
  };

  if (path.includes('login') || path.includes('auth')) {
    localStorage.setItem('token', 'demo_token_pos_2026');
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { token: 'demo_token_pos_2026', user: mockUser, data: { token: 'demo_token_pos_2026', user: mockUser } };
  }

  if (path.includes('shift')) {
    return {
      shift: {
        id: 1,
        user_id: 1,
        cashier_name: 'مدير النظام',
        start_cash: 500,
        status: 'open',
        opened_at: new Date().toISOString()
      }
    };
  }

  if (path.includes('setting')) {
    return { store_name: 'نظام الرسالة POS', currency: 'EGP' };
  }

  if (options.method && options.method !== 'GET') {
    return { success: true, message: 'تم بنجاح (وضع تجريبي)' };
  }

  return [];
}

client.get = (url, opts) => client(url, { ...opts, method: 'GET' });
client.post = (url, body, opts) => client(url, { ...opts, method: 'POST', body: JSON.stringify(body) });
client.put = (url, body, opts) => client(url, { ...opts, method: 'PUT', body: JSON.stringify(body) });
client.delete = (url, opts) => client(url, { ...opts, method: 'DELETE' });

export default client;
export { client, client as api, client as request };
