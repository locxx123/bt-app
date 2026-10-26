import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCache, setCache } from '../src/storage/cache';
import { enqueue, getAll, remove } from '../src/storage/outbox';

beforeEach(() => AsyncStorage.clear());

test('cache lưu { data, savedAt }', async () => {
  expect(await getCache('cache:courses')).toBeNull();
  const savedAt = await setCache('cache:courses', [{ id: 1 }]);
  expect(await getCache('cache:courses')).toEqual({ data: [{ id: 1 }], savedAt });
});

test('outbox giữ đúng thứ tự thêm vào và xóa theo id', async () => {
  const a = await enqueue({ method: 'PATCH', url: '/assignments/1', body: { status: 'done' } });
  const b = await enqueue({ method: 'POST', url: '/assignments', body: { title: 'x' } });
  expect((await getAll()).map(x => x.id)).toEqual([a.id, b.id]);
  await remove(a.id);
  expect((await getAll()).map(x => x.id)).toEqual([b.id]);
});
