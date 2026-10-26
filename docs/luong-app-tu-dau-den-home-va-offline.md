# Luồng app từ lúc mở đến HomeScreen, và các trường hợp mất mạng / đồng bộ

Tài liệu chỉ thẳng vào code. Mỗi bước ghi **file:dòng** và trích đoạn code tương ứng. Số dòng ứng với mã nguồn
tại thời điểm viết.

**Hai quy tắc của React cần nhớ để đọc tài liệu này**
1. **Render** chạy từ component cha xuống con, chỉ tính ra giao diện, chưa gọi mạng.
2. **`useEffect`** chạy *sau* khi render xong, và chạy **từ con lên cha**. Việc đọc bộ nhớ và gọi mạng đều nằm trong `useEffect`.

Vì vậy màn hình luôn vẽ trạng thái "đang tải" trước, rồi vẽ lại khi có dữ liệu.

---

# PHẦN 1. Từ lúc mở app đến HomeScreen

## Bước 1. Đăng ký component gốc: [index.js:9](../index.js#L9)
```js
AppRegistry.registerComponent(appName, () => App);
```
React Native gọi `App` làm component gốc.

## Bước 2. Dựng cây Provider: [App.tsx:9-15](../App.tsx#L9-L15)
```tsx
<SafeAreaProvider>
  <SyncProvider>
    <AppDataProvider>
      <AppNavigator />
    </AppDataProvider>
  </SyncProvider>
</SafeAreaProvider>
```
Thứ tự lồng nhau là bắt buộc: `AppDataProvider` dùng `useSync()` nên phải nằm trong `SyncProvider`; `AppNavigator`
dùng `useAppData()` nên phải nằm trong `AppDataProvider`.

## Bước 3. `SyncProvider` tạo "bộ đồng bộ": [SyncContext.tsx:6-9](../src/context/SyncContext.tsx#L6-L9)
```tsx
export function SyncProvider({ children }) {
  const sync = useOutboxSync();
  return <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>;
}
```
`useOutboxSync()` chạy ở **lần render đầu**, và chỉ khởi tạo state:

| Dòng | Code | Ý nghĩa |
|---|---|---|
| [useOutboxSync.ts:21](../src/hooks/useOutboxSync.ts#L21) | `const { isOnline } = useNetworkStatus();` | Lấy trạng thái mạng |
| [:22](../src/hooks/useOutboxSync.ts#L22) | `useState<OutboxAction[]>([])` | `actions`: danh sách việc chờ gửi, ban đầu rỗng |
| [:23](../src/hooks/useOutboxSync.ts#L23) | `useState(false)` | `syncing`: có đang đồng bộ không |
| [:24](../src/hooks/useOutboxSync.ts#L24) | `useState(0)` | `syncVersion`: đếm số lần đồng bộ xong, dùng để báo nơi khác tải lại |
| [:26](../src/hooks/useOutboxSync.ts#L26) | `const reload = ...` | Hàm đọc outbox từ AsyncStorage vào `actions` |
| [:28](../src/hooks/useOutboxSync.ts#L28) | `const syncNow = ...` | Hàm đồng bộ, **chỉ được định nghĩa, chưa chạy** |

`useNetworkStatus` ([useNetworkStatus.ts:5](../src/hooks/useNetworkStatus.ts#L5)) có `useState(true)`:
**mặc định coi là đang online** cho tới khi NetInfo báo trạng thái thật.

## Bước 4. `AppDataProvider` tạo 4 "ô dữ liệu": [AppDataContext.tsx:38-44](../src/context/AppDataContext.tsx#L38-L44)
```tsx
const { isOnline, actions, syncVersion, enqueue } = useSync();

const student     = useCachedQuery(KEYS.student, () => studentService.getById(STUDENT_ID), syncVersion);
const courses     = useCachedQuery(KEYS.courses, courseService.getAll);
const assignments = useCachedQuery(KEYS.assignments, assignmentService.getAll, syncVersion);
const grades      = useCachedQuery(KEYS.grades, gradeService.getAll);
```
Mỗi `useCachedQuery` ở lần render đầu trả về `{ data: null, loading: true, error: null, ... }`
([useCachedQuery.ts:25-29](../src/hooks/useCachedQuery.ts#L25-L29)).

Tham số thứ 3 là `syncVersion`: **khi số này đổi, ô dữ liệu tải lại** (xem Phần 2, case 5).

Tiếp theo là hai `useMemo` trộn thao tác chờ vào dữ liệu hiển thị (giải thích ở Phần 2, case 4):
- [AppDataContext.tsx:47-78](../src/context/AppDataContext.tsx#L47-L78): `assignmentList`
- [AppDataContext.tsx:80-93](../src/context/AppDataContext.tsx#L80-L93): `studentView`

## Bước 5. Navigator dựng tab: [AppNavigator.tsx:31-44](../src/navigation/AppNavigator.tsx#L31-L44)
```tsx
const { assignments } = useAppData();
const todoCount = (assignments.data ?? []).filter(a => a.status !== 'done').length;
...
<Tab.Screen name={ROUTES.HomeTab} component={HomeStack} options={{ title: 'Tổng quan' }} />
```
Lần đầu `assignments.data` là `null` nên `todoCount = 0`, chưa có badge. Tab đầu tiên là `HomeTab` → `HomeStack`
([HomeStack.tsx:13](../src/navigation/HomeStack.tsx#L13)) → `HomeScreen`.

## Bước 6. HomeScreen render lần 1: [HomeScreen.tsx:19-36](../src/screens/home/HomeScreen.tsx#L19-L36)
```tsx
const { student, courses, assignments } = useAppData();     // dòng 20
const { pendingCount, isOnline } = useSync();               // dòng 21
...
if (student.loading && !student.data) {                     // dòng 30
  return (<ScreenContainer><LoadingView /></ScreenContainer>);
}
```
Lúc này `student.loading = true` và `student.data = null`, nên **HomeScreen vẽ `LoadingView` ("Đang tải…")**.

`ScreenContainer` ([ScreenContainer.tsx:19-20](../src/components/common/ScreenContainer.tsx#L19-L20)) luôn
đặt `<OfflineBanner />` ở đầu, nên màn hình nào cũng có banner offline khi mất mạng.

## Bước 7. Pha effect: hai luồng bắt đầu chạy

Sau khi render xong, React chạy các effect **từ con lên cha**. Có 2 nhóm effect bắt đầu:

### Luồng B: tải dữ liệu (4 effect của `useCachedQuery`)
[useCachedQuery.ts:47-60](../src/hooks/useCachedQuery.ts#L47-L60):
```ts
useEffect(() => {
  (async () => {
    const cached = await getCache<T>(key);        // 49: đọc cache từ AsyncStorage
    if (cached) {                                  // 50
      setData(cached.data);                        // 51: hiện NGAY dữ liệu cũ
      setLastUpdated(cached.savedAt);              // 52
      setLoading(false);                           // 53
    }
    await load();                                  // 55: rồi mới gọi mạng
    setLoading(false);                             // 56
  })();
}, [key, isOnline, reloadToken]);                  // 60
```
`load` ([useCachedQuery.ts:32-45](../src/hooks/useCachedQuery.ts#L32-L45)):
```ts
const load = async () => {
  if (!isOnline) {                                 // 33: offline thì không gọi mạng
    setError({ type: 'network', status: 0, message: 'Bạn đang offline và chưa có dữ liệu lưu sẵn' });
    return;
  }
  try {
    const fresh = await fetcher();                 // 38: gọi API (vd studentService.getById(1))
    setData(fresh);                                // 39
    setLastUpdated(await setCache(key, fresh));    // 40: lưu cache + ghi thời điểm lưu
    setError(null);                                // 41
  } catch (e) {
    setError(e as ApiError);                       // 43
  }
};
```
`fetcher()` đi qua service rồi tới `request`:
- [studentService.ts:5](../src/api/studentService.ts#L5): `request('GET', '/students/1')`
- [client.ts:11-41](../src/api/client.ts#L11-L41): `request`
  - dòng 16-17: `AbortController` + `setTimeout` 10 giây để hủy
  - dòng 19: `fetch(BASE_URL + url, ...)`
  - dòng 25-27: `!res.ok` → ném `{ type: 'http', status }`
  - dòng 34-37: lỗi hủy → `{ type: 'timeout' }`, lỗi khác → `{ type: 'network' }`
  - dòng 28: thành công → `res.json()`
- [cache.ts:8, 17](../src/storage/cache.ts#L8): `getCache` đọc, `setCache` ghi `{ data, savedAt }` vào AsyncStorage

Bốn ô dữ liệu và endpoint:

| Ô | Dòng | Endpoint |
|---|---|---|
| `student` | [AppDataContext.tsx:41](../src/context/AppDataContext.tsx#L41) | `GET /students/1` |
| `courses` | [:42](../src/context/AppDataContext.tsx#L42) | `GET /courses` |
| `assignments` | [:43](../src/context/AppDataContext.tsx#L43) | `GET /assignments?_expand=course&_sort=dueDate` |
| `grades` | [:44](../src/context/AppDataContext.tsx#L44) | `GET /grades?_expand=course` |

### Luồng A: đồng bộ outbox (effect của `useOutboxSync`)
[useOutboxSync.ts:57-63](../src/hooks/useOutboxSync.ts#L57-L63):
```ts
useEffect(() => {
  if (isOnline) { syncNow(); } else { reload(); }
}, [isOnline, syncNow, reload]);
```
`isOnline` đang là `true` nên gọi `syncNow()` ([useOutboxSync.ts:28-54](../src/hooks/useOutboxSync.ts#L28-L54)):
```ts
const queue = await getAll();        // 29: đọc outbox (storage/outbox.ts:11)
setActions(queue);                   // 30
if (queue.length === 0) { return; }  // 31-33: RỖNG → thoát. Mở app bình thường dừng ở đây.
```

### Effect của `useNetworkStatus`
[useNetworkStatus.ts:7-12](../src/hooks/useNetworkStatus.ts#L7-L12) đăng ký lắng nghe mạng:
```ts
const unsubscribe = NetInfo.addEventListener(state => {
  setIsOnline(state.isConnected !== false && state.isInternetReachable !== false);
});
```
NetInfo gọi callback ngay với trạng thái thật. Chỉ khi `isConnected` hoặc `isInternetReachable` **đúng bằng `false`**
thì mới tính là offline (`null` = chưa biết thì vẫn là online).

## Bước 8. Dữ liệu về, HomeScreen render lại

`setData` làm `useCachedQuery` render lại, kéo theo `AppDataProvider`, `AppNavigator`, `HomeScreen`:
1. `AppNavigator` tính lại `todoCount` → badge tab Bài tập hiện số ([AppNavigator.tsx:33](../src/navigation/AppNavigator.tsx#L33)).
2. `HomeScreen`: `student.data` đã có nên đi qua dòng 30 và 37, xuống phần nội dung
   ([HomeScreen.tsx:45-51](../src/screens/home/HomeScreen.tsx#L45-L51)):
```tsx
const courseList = courses.data ?? [];
const current = latestSemester(courseList.map(c => c.semester));        // học kỳ mới nhất
const currentCourses = courseList.filter(c => c.semester === current);  // "Môn đang học"
const dueSoon = (assignments.data ?? []).filter(a => {                  // "Bài tập đến hạn"
  const left = daysLeft(a.dueDate);
  return a.status !== 'done' && left >= 0 && left <= 7;
});
```
3. Dòng đồng bộ ([HomeScreen.tsx:63-66](../src/screens/home/HomeScreen.tsx#L63-L66)) dựa vào `pendingCount`:
   `> 0` thì hiện "N thay đổi chưa đồng bộ", ngược lại "Mọi thay đổi đã được đồng bộ".

**Dòng thời gian khi mở app (có cache, server chạy):**
```
t0  render 1: HomeScreen vẽ LoadingView
t1  effect: đọc cache (useCachedQuery ×4) + syncNow (outbox rỗng → thoát)
t2  có cache → setData → render 2: HIỆN NỘI DUNG (dữ liệu cũ)
t3  load() gọi API (json-server trễ 800 ms)
t4  API về → setCache + setData → render 3: dữ liệu mới
```

---

# PHẦN 2. Các trường hợp mất mạng và đồng bộ

## Case 1. Mở app lần đầu (chưa có cache), server đang tắt

1. [useCachedQuery.ts:49](../src/hooks/useCachedQuery.ts#L49): `getCache` trả `null` (chưa có gì).
2. [:55](../src/hooks/useCachedQuery.ts#L55) → [:38](../src/hooks/useCachedQuery.ts#L38): `fetcher()` → `request`.
3. [client.ts:19](../src/api/client.ts#L19): `fetch` thất bại → vào `catch` → [client.ts:37](../src/api/client.ts#L37) ném `{ type: 'network' }`.
4. [useCachedQuery.ts:42-43](../src/hooks/useCachedQuery.ts#L42-L43): `setError(e)`, rồi dòng 56 `setLoading(false)`.
5. [HomeScreen.tsx:37-43](../src/screens/home/HomeScreen.tsx#L37-L43): `!student.data` → hiện `ErrorView` với nút **"Thử lại"** (gọi `refreshAll`).

## Case 2. Mở app khi có cache nhưng không có mạng (máy bay)

Lúc mới mở, `isOnline` mặc định là `true`, nên diễn ra theo thứ tự:
1. [useCachedQuery.ts:49-54](../src/hooks/useCachedQuery.ts#L49-L54): đọc cache, **hiện dữ liệu cũ ngay**.
2. [:55](../src/hooks/useCachedQuery.ts#L55): `load()` với `isOnline = true` → gọi API → thất bại → `setError(...)`.
   `error` được đặt nhưng **không hiện ra**, vì [HomeScreen.tsx:37](../src/screens/home/HomeScreen.tsx#L37) chỉ hiện `ErrorView` khi `!student.data`.
3. NetInfo báo offline → [useNetworkStatus.ts:9](../src/hooks/useNetworkStatus.ts#L9): `setIsOnline(false)`.
4. `isOnline` nằm trong `deps` của effect ([useCachedQuery.ts:60](../src/hooks/useCachedQuery.ts#L60)) nên effect chạy lại:
   đọc cache lại, `load()` rơi vào nhánh offline ([:33-36](../src/hooks/useCachedQuery.ts#L33-L36)).
5. [OfflineBanner.tsx:11-18](../src/components/common/OfflineBanner.tsx#L11-L18): `isOnline = false` → banner **"Bạn đang offline"** hiện (nằm trong `ScreenContainer`).
6. Các màn danh sách hiện thêm "Cập nhật lần cuối" từ `lastUpdated` (là `savedAt` đọc ở dòng 52).

## Case 3. Đang dùng thì mất mạng

1. NetInfo gọi callback → [useNetworkStatus.ts:9](../src/hooks/useNetworkStatus.ts#L9): `isOnline = false`.
2. Mọi nơi dùng `useNetworkStatus` render lại: `OfflineBanner` hiện banner; `useOutboxSync` chạy effect
   ([useOutboxSync.ts:57-63](../src/hooks/useOutboxSync.ts#L57-L63)), nhánh `else` gọi `reload()` để cập nhật `actions`.
3. Từ lúc này mọi thao tác ghi đi theo nhánh offline (case 4).

## Case 4. Thao tác khi offline (đổi trạng thái bài tập / thêm bài tập / sửa hồ sơ)

Cả ba hàm nằm trong `AppDataProvider` và đều có dạng "offline thì đưa vào outbox":

**4a. Đổi trạng thái bài tập**: [AppDataContext.tsx:96-112](../src/context/AppDataContext.tsx#L96-L112)
```tsx
const status = assignment.status === 'done' ? 'todo' : 'done';
if (!isOnline) {
  await enqueue({ method: 'PATCH', url: `/assignments/${assignment.id}`, body: { status } });
  return;
}
```
Gọi từ [AssignmentListScreen.tsx:77](../src/screens/assignments/AssignmentListScreen.tsx#L77): `onToggleStatus={() => toggleStatus(item)}`.

**4b. Thêm bài tập**: [AppDataContext.tsx:114-122](../src/context/AppDataContext.tsx#L114-L122)
```tsx
if (!isOnline) {
  await enqueue({ method: 'POST', url: '/assignments', body });
  return;
}
```
Gọi từ [AssignmentFormScreen.tsx:58](../src/screens/assignments/AssignmentFormScreen.tsx#L58); xong thì báo
"Đã lưu bài tập, sẽ đồng bộ khi có mạng" ([:65](../src/screens/assignments/AssignmentFormScreen.tsx#L65)) và `goBack()`.

**4c. Sửa hồ sơ**: [AppDataContext.tsx:124-131](../src/context/AppDataContext.tsx#L124-L131), gọi từ
[EditProfileScreen.tsx:43](../src/screens/profile/EditProfileScreen.tsx#L43).
```tsx
if (!isOnline) {
  await enqueue({ method: 'PATCH', url: STUDENT_URL, body: data });
  return;
}
```

**`enqueue` làm gì** ([useOutboxSync.ts:65-72](../src/hooks/useOutboxSync.ts#L65-L72)):
```ts
const item = await enqueueAction(action);   // ghi vào AsyncStorage
await reload();                              // cập nhật actions → giao diện đổi
```
`enqueueAction` ở [outbox.ts:20-28](../src/storage/outbox.ts#L20-L28) tạo `{ id, createdAt, method, url, body }`
và **thêm vào cuối** mảng, nên giữ đúng thứ tự.

**Vì sao giao diện đổi ngay dù chưa gửi lên server?** Vì dữ liệu hiển thị là *dữ liệu server + việc đang chờ*:
[AppDataContext.tsx:47-78](../src/context/AppDataContext.tsx#L47-L78):
```tsx
actions.forEach(action => {
  const match = action.url.match(ASSIGNMENT_URL);
  if (action.method === 'PATCH' && match) {
    ...
    Object.assign(target, action.body);   // 56: áp thay đổi (vd status) lên bài tập
    pending.push(id);                     // 57: đánh dấu "chưa đồng bộ"
  } else if (action.method === 'POST' && action.url === '/assignments') {
    const localId = -action.createdAt;    // 61: id tạm (số âm)
    list.push({ id: localId, ..., localOnly: true });  // 62-72: thêm bài giả vào danh sách
    pending.push(localId);
  }
});
```
- `studentView` làm tương tự cho sửa hồ sơ ([:80-93](../src/context/AppDataContext.tsx#L80-L93)).
- Nhãn **"Chưa đồng bộ"**: [AssignmentListScreen.tsx:75](../src/screens/assignments/AssignmentListScreen.tsx#L75)
  truyền `pending={pendingAssignmentIds.includes(item.id)}` → `SyncBadge` trong
  [AssignmentItem.tsx:46](../src/components/assignment/AssignmentItem.tsx#L46).
- Màn Home đếm `pendingCount` ([HomeScreen.tsx:63-66](../src/screens/home/HomeScreen.tsx#L63-L66)).

**Trường hợp đặc biệt: đổi trạng thái bài tập vừa tạo offline** ([AppDataContext.tsx:97-100](../src/context/AppDataContext.tsx#L97-L100)):
```tsx
if (assignment.localOnly) {
  notify('Bài tập chưa được đồng bộ, hãy đợi đồng bộ xong rồi đổi trạng thái');
  return;
}
```
Bài này chưa có trên server (id âm) nên không thể PATCH.

## Case 5. Có mạng lại: tự đồng bộ

1. NetInfo báo có mạng → [useNetworkStatus.ts:9](../src/hooks/useNetworkStatus.ts#L9): `setIsOnline(true)`.
2. `isOnline` đổi → effect [useOutboxSync.ts:57-63](../src/hooks/useOutboxSync.ts#L57-L63) chạy lại → nhánh `if (isOnline)` gọi `syncNow()`.
3. `syncNow` ([useOutboxSync.ts:28-54](../src/hooks/useOutboxSync.ts#L28-L54)):
```ts
const queue = await getAll();                              // 29: đọc hàng đợi
...
setSyncing(true);                                          // 34
let synced = 0;
for (const action of queue) {                              // 36: lần lượt, đúng thứ tự thêm vào
  try {
    await request(action.method, action.url, {             // 38: gửi lên server
      ...action.body,
      updatedAt: new Date().toISOString(),
    });
    await remove(action.id);                               // 42: thành công → xóa khỏi hàng đợi
    synced += 1;                                           // 43
  } catch {
    break;                                                 // 45: lỗi → dừng, giữ lại phần còn lại
  }
}
setSyncing(false);                                         // 48
await reload();                                            // 49: đọc lại hàng đợi → actions cập nhật
setSyncVersion(v => v + 1);                                // 50: báo "đã đồng bộ xong, tải lại đi"
if (synced > 0) { notify(`Đã đồng bộ ${synced} thay đổi`); } // 51-53
```
4. `setSyncVersion` làm `syncVersion` tăng. `syncVersion` là tham số thứ 3 của `useCachedQuery` cho `student` và
   `assignments` ([AppDataContext.tsx:41, 43](../src/context/AppDataContext.tsx#L41)), nằm trong `deps`
   ([useCachedQuery.ts:60](../src/hooks/useCachedQuery.ts#L60)) → **hai ô này tự tải lại từ server**.
5. Đồng thời, các `useCachedQuery` cũng chạy lại vì `isOnline` đổi (cùng `deps`), nên mọi ô dữ liệu đều được làm mới.
6. `actions = []` → `pendingCount = 0` → nhãn "Chưa đồng bộ" biến mất, Home hiện "Mọi thay đổi đã được đồng bộ".

**Ví dụ có số liệu.** Offline đổi trạng thái bài 3, bài 5 và thêm 1 bài mới:
```
actions = [
  { id:'…-1', method:'PATCH', url:'/assignments/3', body:{status:'done'},  createdAt:1000 },
  { id:'…-2', method:'PATCH', url:'/assignments/5', body:{status:'done'},  createdAt:2000 },
  { id:'…-3', method:'POST',  url:'/assignments',   body:{title:'Bài mới',…}, createdAt:3000 },
]
```
Có mạng lại: `syncNow` gửi lần lượt PATCH 3 → PATCH 5 → POST, mỗi việc thành công thì xóa khỏi hàng đợi, cuối cùng
hiện **"Đã đồng bộ 3 thay đổi"**. `db.json` thay đổi đúng.

> **Lưu ý (hành vi thật):** ở bước 3, `reload()` xóa `actions` **trước** khi dữ liệu mới từ server về (vì tải
> lại mất ~800 ms với `--delay 800`). Trong khoảng đó danh sách tạm thời quay về dữ liệu cũ, nên các bài vừa đổi
> trạng thái có thể **nháy lại trạng thái cũ** rồi cập nhật đúng khi server trả dữ liệu.

## Case 6. Thao tác khi **đang online**

Các hàm `toggleStatus`, `addAssignment`, `updateProfile` đi theo nhánh sau (không vào outbox):

[AppDataContext.tsx:106-111](../src/context/AppDataContext.tsx#L106-L111) (đổi trạng thái):
```tsx
try {
  await assignmentService.update(assignment.id, { status, updatedAt: new Date().toISOString() }); // PATCH
  await assignments.refresh();     // tải lại danh sách (useCachedQuery.ts:62-66)
} catch {
  notify('Không thể cập nhật trạng thái bài tập');
}
```
- Giao diện **đổi sau khi API trả về** (khoảng 1,6 giây với `--delay 800`: một lần PATCH, một lần tải lại).
- `refresh` ([useCachedQuery.ts:62-66](../src/hooks/useCachedQuery.ts#L62-L66)) bật `refreshing`, gọi `load()`, rồi tắt.
- `addAssignment` ([:120-121](../src/context/AppDataContext.tsx#L120-L121)) và `updateProfile`
  ([:129-130](../src/context/AppDataContext.tsx#L129-L130)) làm tương tự; nếu API lỗi thì ném lỗi lên màn hình,
  màn hình bắt và báo "Không thể thêm bài tập / lưu thông tin" ([AssignmentFormScreen.tsx:69](../src/screens/assignments/AssignmentFormScreen.tsx#L69),
  [EditProfileScreen.tsx:55](../src/screens/profile/EditProfileScreen.tsx#L55)).

## Case 7. Đồng bộ bị lỗi giữa chừng (server tắt giữa lúc đang gửi)

Giả sử hàng đợi có 3 việc, việc 2 lỗi:
```
việc 1: request thành công → remove → synced = 1
việc 2: request ném lỗi → catch → break          (useOutboxSync.ts:44-46)
```
- Việc 2 và 3 **vẫn nằm trong hàng đợi** (chưa bị `remove`), giữ đúng thứ tự.
- Sau vòng lặp: `reload()` và `setSyncVersion` vẫn chạy ([:48-50](../src/hooks/useOutboxSync.ts#L48-L50)),
  hiện "Đã đồng bộ 1 thay đổi".
- Nhãn "Chưa đồng bộ" vẫn còn cho việc 2 và 3 (vì còn trong `actions`).
- Lần thử lại tiếp theo xảy ra khi `isOnline` đổi trạng thái (effect [:57-63](../src/hooks/useOutboxSync.ts#L57-L63))
  hoặc khi `syncNow` được gọi lại. Hiện **chưa có nút "Đồng bộ lại" trên giao diện**.

## Case 8. Server tắt nhưng Wi-Fi vẫn bật

- NetInfo vẫn báo online → `isOnline = true` → mọi thao tác đi theo nhánh online (case 6).
- `request` ném lỗi `network` → `toggleStatus` báo "Không thể cập nhật trạng thái bài tập"; `addAssignment` và
  `updateProfile` ném lỗi lên màn hình.
- **Thao tác không vào outbox**, nên không được đồng bộ về sau. Đây là giới hạn của bản đơn giản.

---

# PHẦN 3. Bảng tra nhanh

| Tình huống | Điểm bắt đầu trong code | Kết quả |
|---|---|---|
| Mở app | [App.tsx:9-15](../App.tsx#L9-L15) → effect của `useCachedQuery` ([:47](../src/hooks/useCachedQuery.ts#L47)) và `useOutboxSync` ([:57](../src/hooks/useOutboxSync.ts#L57)) | LoadingView → cache → dữ liệu mới |
| Chưa cache + server tắt | [useCachedQuery.ts:43](../src/hooks/useCachedQuery.ts#L43) | `ErrorView` + "Thử lại" |
| Mất mạng | [useNetworkStatus.ts:9](../src/hooks/useNetworkStatus.ts#L9) | Banner offline, thao tác vào outbox |
| Thao tác khi offline | [AppDataContext.tsx:96, 114, 124](../src/context/AppDataContext.tsx#L96) → `enqueue` ([useOutboxSync.ts:65](../src/hooks/useOutboxSync.ts#L65)) | Đổi ngay trên giao diện + "Chưa đồng bộ" |
| Có mạng lại | [useOutboxSync.ts:57-63](../src/hooks/useOutboxSync.ts#L57-L63) → `syncNow` ([:28](../src/hooks/useOutboxSync.ts#L28)) | Gửi lần lượt, xóa khi thành công, tải lại dữ liệu |
| Đồng bộ lỗi | [useOutboxSync.ts:44-46](../src/hooks/useOutboxSync.ts#L44-L46) | Dừng, giữ lại việc lỗi và các việc sau |
| Thao tác khi online | [AppDataContext.tsx:106-111](../src/context/AppDataContext.tsx#L106-L111) | Gọi API → `refresh()` |

## Các giới hạn của bản hiện tại
- **Không xử lý xung đột:** thao tác offline luôn ghi đè dữ liệu server (không so `updatedAt`).
- **Không cập nhật lạc quan khi online:** giao diện đổi sau khi API trả về.
- **Server tắt nhưng Wi-Fi bật:** thao tác ghi báo lỗi, không vào outbox.
- **Không có `busy`:** nếu `syncNow` bị gọi hai lần sát nhau, có thể gửi trùng một việc. Hiện `syncNow` chỉ được gọi từ effect khi `isOnline` đổi.
- **Chưa có nút đồng bộ tay** trên giao diện.
- Thứ tự chạy được suy ra từ mã nguồn và quy tắc của React, **chưa đo bằng log trên thiết bị**.
