import { BASE_URL } from '../config';

export function useApi(token) {
  async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    return res.json();
  }
  return { apiFetch };
}
