# Quản lý học tập – API & Offline mode (Thực hành 4)

Ứng dụng **React Native (CLI) + TypeScript**. Dữ liệu lấy từ REST API (json-server), có bộ nhớ đệm
bằng AsyncStorage, hoạt động khi offline và tự đồng bộ khi có mạng trở lại.

## Chạy ứng dụng

```sh
npm install
npm run api          # json-server: http://0.0.0.0:3456, độ trễ giả lập 800 ms
npm start            # Metro
npm run android      # hoặc: npm run ios (chạy `cd ios && pod install` lần đầu)
```

Địa chỉ server nằm trong [src/config.ts](src/config.ts):

| Môi trường | BASE_URL |
|---|---|
| Android emulator | `http://10.0.2.2:3456` (tự chọn theo `Platform.OS`) |
| iOS simulator | `http://localhost:3456` |
| Điện thoại thật | sửa `HOST` thành `<IP-LAN-của-máy-tính>`, cùng mạng Wi-Fi |

> Cổng đề yêu cầu là 3000; project này dùng **3456** vì cổng 3000 trên máy phát triển đang bị ứng dụng khác chiếm.
> Muốn đổi, sửa đồng thời `--port` trong script `api` của `package.json` và `BASE_URL` trong `src/config.ts`.

## Kiểm thử

```sh
npm test       # jest: gpa, validators, date, client, cache/outbox, smoke test App
npm run lint
npx tsc --noEmit
```

## Cấu trúc thư mục

```
App.tsx                    # Chỉ bọc Provider + AppNavigator
db.json                    # Dữ liệu json-server
src/
├── config.ts              # BASE_URL, TIMEOUT, CACHE_TTL
├── api/                   # client.ts + *Service.ts (chỉ gọi request)
├── storage/               # keys, cache (getCache/setCache), outbox (enqueue/getAll/remove)
├── context/               # AppDataContext, SyncContext
├── hooks/                 # useNetworkStatus, useCachedQuery, useOutboxSync
├── navigation/            # routes, AppNavigator (5 tab), 5 stack
├── screens/               # home, courses, schedule, assignments, profile
├── components/            # common, course, schedule, assignment, grade, profile
├── theme/                 # colors, spacing, typography
└── utils/                 # date, gpa, validators (+ semester, notify)
```

## Luồng dữ liệu

```
Màn hình ──► Hook / Context ──► Service ──► client.request ──► API (json-server)
                  │                                              ▲
                  ├── useCachedQuery ──► storage/cache ◄── lưu kết quả GET thành công
                  │        (hiện cache ngay, gọi mạng sau)
                  └── Outbox (khi offline) ──► storage/outbox ──► useOutboxSync ──┘
                         đổi trạng thái / thêm bài tập / sửa hồ sơ     (gửi lần lượt khi có mạng)
```

- **Đọc:** `useCachedQuery(key, fetcher)` đọc `{ data, savedAt }` từ cache và hiển thị ngay, sau đó gọi API
  nếu có mạng rồi ghi lại cache. Server lỗi mà đã có cache thì vẫn hiển thị cache; chưa có cache thì hiện
  `ErrorView` với nút "Thử lại".
- **Ghi khi online:** gọi API trực tiếp (POST/PATCH) rồi tải lại danh sách. API lỗi thì báo người dùng.
- **Ghi khi offline:** thao tác được đưa vào outbox (`{ id, method, url, body, createdAt }`) và hiển thị ngay
  trên giao diện cùng nhãn "Chưa đồng bộ". `AppDataContext` tính dữ liệu hiển thị = dữ liệu server + các thao
  tác đang chờ trong outbox. Bài tập tạo offline dùng id tạm (số âm) và chưa đổi được trạng thái cho tới khi đồng bộ.
- **Đồng bộ:** `useOutboxSync` tự chạy khi `isOnline` chuyển sang `true`. Gửi lần lượt theo đúng thứ tự thêm
  vào; thành công thì xóa khỏi hàng đợi, lỗi thì dừng và giữ lại (cùng các thao tác sau nó) để thử lại. Xong thì
  hiện "Đã đồng bộ N thay đổi" và tải lại dữ liệu.

Giải thích chi tiết luồng chạy từ lúc mở app đến màn Home và các trường hợp mất mạng/đồng bộ:
[docs/luong-app-tu-dau-den-home-va-offline.md](docs/luong-app-tu-dau-den-home-va-offline.md).

## Giới hạn đã biết (bản đơn giản)

- **Chưa xử lý xung đột (B5):** thao tác offline luôn được gửi lên và ghi đè dữ liệu trên server, kể cả khi
  server đã được sửa mới hơn. Hướng cải thiện: trước khi PATCH, GET bản ghi và so sánh `updatedAt` với
  `createdAt` của thao tác; nếu server mới hơn thì bỏ thao tác và báo người dùng.
- **Chưa có cập nhật lạc quan (A6)** khi online: giao diện đổi sau khi API trả về.
- Server tắt nhưng Wi-Fi vẫn bật thì app coi là online và các thao tác ghi báo lỗi thay vì vào outbox.

## Kịch bản kiểm thử thủ công

1. Tắt json-server rồi mở app lần đầu → màn hình lỗi có nút "Thử lại".
2. Mở app khi có mạng, bật chế độ máy bay, khởi động lại → vẫn thấy dữ liệu, banner offline, "Cập nhật lần cuối".
3. Offline: đánh dấu 2 bài tập đã xong, thêm 1 bài tập → cập nhật ngay, có nhãn "Chưa đồng bộ".
4. Tắt chế độ máy bay → tự đồng bộ, nhãn biến mất, `db.json` thay đổi đúng.
5. (Bỏ qua: chưa làm xử lý xung đột.)
6. Tìm môn không tồn tại / lọc học kỳ không có dữ liệu → trạng thái rỗng.
7. Kéo để làm mới trên các danh sách → dữ liệu được tải lại.
