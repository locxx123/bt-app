import { BASE_URL, TIMEOUT } from '../config';
import { ApiError, HttpMethod } from '../types';

const fail = (type: ApiError['type'], status: number, message: string): ApiError => ({
  type,
  status,
  message,
});

/** Gọi API, trả về JSON. Lỗi được chuẩn hóa thành { type, status, message } */
export async function request<T = unknown>(
  method: HttpMethod,
  url: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw fail('http', res.status, `Máy chủ trả về lỗi ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (e) {
    const err = e as Partial<ApiError> & { name?: string };
    if (err.type) {
      throw err;
    }
    if (err.name === 'AbortError') {
      throw fail('timeout', 0, 'Máy chủ phản hồi quá lâu');
    }
    throw fail('network', 0, 'Không thể kết nối tới máy chủ');
  } finally {
    clearTimeout(timer);
  }
}
