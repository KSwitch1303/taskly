const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token') || '';
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  me: () =>
    request('/api/auth/me', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  balance: () =>
    request('/api/wallet/balance', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  transactions: () =>
    request('/api/wallet/transactions', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  withdrawals: () =>
    request('/api/wallet/withdrawals', {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  withdraw: (payload) =>
    request('/api/wallet/withdraw', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload)
    }),
  adminWithdrawals: (status = 'pending') =>
    request(`/api/admin/withdrawals?status=${encodeURIComponent(status)}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  approveWithdrawal: (id) =>
    request(`/api/admin/withdrawals/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` }
    }),
  rejectWithdrawal: (id) =>
    request(`/api/admin/withdrawals/${id}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` }
    })
};
