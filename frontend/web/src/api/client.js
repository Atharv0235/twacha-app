import { API_BASE_URL } from '../config';

const DEVICE_KEY = 'twacha.deviceId';

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** Anonymous per-install ID. No account is needed; the server keeps data per ID. */
export function getDeviceId() {
  let id = safeGet(DEVICE_KEY);
  if (!id) {
    id = uuid();
    safeSet(DEVICE_KEY, id);
  }
  return id;
}

export class ApiError extends Error {
  constructor(message, { status = 0, kind = 'unknown' } = {}) {
    super(message);
    this.status = status;
    this.kind = kind; // 'network' | 'timeout' | 'validation' | 'too_large' | 'server' | 'unknown'
  }
}

async function request(path, { method = 'GET', body, json, timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { 'X-Device-Id': getDeviceId(), 'ngrok-skip-browser-warning': 'true' };
  let payload = body;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(json);
  }
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new ApiError('The server took too long to answer. It may be waking up; please try again in a moment.', { kind: 'timeout' });
    }
    throw new ApiError('Could not reach the server. Check your internet connection and try again.', { kind: 'network' });
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty or non-JSON body */ }

  if (!res.ok) {
    if (res.status === 413) throw new ApiError('That photo is too large. Please use a smaller one.', { status: 413, kind: 'too_large' });
    if (res.status === 422) {
      const d = data?.detail;
      const msg = typeof d === 'string' ? d : 'The server could not use that input.';
      throw new ApiError(msg, { status: 422, kind: 'validation' });
    }
    throw new ApiError('Something went wrong on the server. Please try again.', { status: res.status, kind: 'server' });
  }
  return data;
}

/** Wakes the server (free hosting sleeps). Resolves true when healthy. */
export async function wake(timeoutMs = 60000) {
  try {
    const h = await request('/health', { timeoutMs });
    return h?.status === 'ok';
  } catch {
    return false;
  }
}

export function scan(imageBlob, city) {
  const form = new FormData();
  form.append('image', imageBlob, 'photo.jpg');
  if (city) form.append('city', city);
  return request('/api/scan/', { method: 'POST', body: form, timeoutMs: 90000 });
}

export const getHistory = (limit = 60) => request(`/api/history/?limit=${limit}`);
export const getFoods = () => request('/api/foods/');
export const getLog = (limit = 7) => request(`/api/log/?limit=${limit}`);
export const saveLog = (foods_eaten, log_date) =>
  request('/api/log/', { method: 'POST', json: log_date ? { foods_eaten, log_date } : { foods_eaten } });
export const deleteMyData = () => request('/api/data/', { method: 'DELETE' });
