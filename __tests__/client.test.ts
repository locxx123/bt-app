import { request } from '../src/api/client';

const mockFetch = (impl: () => Promise<unknown>) => {
  (globalThis as unknown as { fetch: unknown }).fetch = jest.fn(impl);
};

test('trả về JSON khi thành công', async () => {
  mockFetch(async () => ({ ok: true, json: async () => [{ id: 1 }] }));
  await expect(request('GET', '/courses')).resolves.toEqual([{ id: 1 }]);
});

test('mã HTTP lỗi -> type "http"', async () => {
  mockFetch(async () => ({ ok: false, status: 404 }));
  await expect(request('GET', '/courses/99')).rejects.toMatchObject({ type: 'http', status: 404 });
});

test('không kết nối được -> type "network"', async () => {
  mockFetch(async () => {
    throw new TypeError('Network request failed');
  });
  await expect(request('GET', '/courses')).rejects.toMatchObject({ type: 'network' });
});

test('bị hủy do quá thời gian -> type "timeout"', async () => {
  mockFetch(async () => {
    throw Object.assign(new Error('aborted'), { name: 'AbortError' });
  });
  await expect(request('GET', '/courses')).rejects.toMatchObject({ type: 'timeout' });
});
