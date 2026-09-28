# Ứng dụng Quản lý Sinh viên (React Native)

Ứng dụng Quản lý sinh viên di động được phát triển bằng **React Native**, **TypeScript**, và **React Navigation**, đáp ứng đầy đủ các yêu cầu quản lý thông tin sinh viên theo mô hình CRUD (Thêm, Xem, Sửa, Xóa) cùng tính năng tìm kiếm và xếp loại học lực tự động.

---

## 📱 Các Màn hình trong Ứng dụng

1. **Màn hình Danh sách Sinh viên (`StudentListScreen`)**:
   - Sử dụng `FlatList` để hiển thị danh sách thẻ sinh viên mượt mà, tối ưu hiệu năng.
   - Hiển thị đầy đủ thông tin: Mã sinh viên, Họ và tên, Lớp học, GPA, và Huy hiệu xếp loại học lực.
   - Thanh tìm kiếm đa năng: Tìm kiếm theo **Mã sinh viên** hoặc **Họ tên** sinh viên với kết quả cập nhật ngay lập tức.
   - Bộ lọc phân loại nhanh theo học lực (Tất cả, Giỏi, Khá, Trung bình, Yếu) kèm số lượng sinh viên thống kê.
   - Nhấn vào sinh viên để chuyển sang màn hình Chi tiết.
   - Nút **+ Thêm mới** để chuyển sang màn hình Thêm sinh viên.

2. **Màn hình Chi tiết Sinh viên (`StudentDetailScreen`)**:
   - Hiển thị toàn bộ thông tin cá nhân và học vụ:
     - Mã sinh viên, Họ và tên, Giới tính, Ngày sinh.
     - Email, Số điện thoại.
     - Lớp học phần, Khoa/Viện, Trạng thái học tập.
     - Điểm GPA và Xếp loại học lực nổi bật.
   - Nút **Chỉnh sửa**: Chuyển sang màn hình Chỉnh sửa thông tin sinh viên.
   - Nút **Xóa sinh viên**: Hiển thị hộp thoại xác nhận (`Alert.alert`). Khi xác nhận xóa, sinh viên được gỡ bỏ khỏi hệ thống và ứng dụng tự động quay lại danh sách.

3. **Màn hình Thêm Sinh viên (`StudentAddScreen`)**:
   - Form nhập liệu trực quan với các trường: Mã sinh viên, Họ và tên, Ngày sinh (DD/MM/YYYY), Giới tính (Nam/Nữ/Khác), Email, Số điện thoại, Lớp, Khoa/Viện, Điểm trung bình (GPA).
   - Kiểm tra dữ liệu (Validation) chặt chẽ:
     - Không để trống các trường thông tin bắt buộc.
     - Kiểm tra không trùng lặp Mã sinh viên với dữ liệu hiện có.
     - Kiểm tra định dạng Email và Số điện thoại (10 chữ số).
     - Kiểm tra GPA trong thang điểm từ `0.0` đến `10.0`.
   - Hiển thị xếp loại dự kiến thời gian thực ngay khi nhập điểm GPA.
   - Sau khi thêm thành công, tự động cập nhật danh sách và điều hướng về trang chủ.

4. **Màn hình Chỉnh sửa Sinh viên (`StudentEditScreen`)**:
   - Tự động điền dữ liệu hiện tại của sinh viên vào các trường form.
   - Cho phép chỉnh sửa toàn diện với validation đảm bảo tính toàn vẹn dữ liệu.
   - Sau khi lưu thay đổi, dữ liệu được cập nhật ngay lập tức vào danh sách sinh viên.

---

## 🎯 Quy tắc Xếp loại Học lực (GPA)

Xếp loại sinh viên được tự động tính toán dựa trên điểm trung bình tích lũy GPA (thang 10):
- **GPA ≥ 8.5**: Xếp loại **Giỏi** (Huy hiệu màu Xanh ngọc lục bảo)
- **GPA ≥ 7.0**: Xếp loại **Khá** (Huy hiệu màu Xanh dương)
- **GPA ≥ 5.0**: Xếp loại **Trung bình** (Huy hiệu màu Vàng cam)
- **GPA < 5.0**: Xếp loại **Yếu** (Huy hiệu màu Đỏ hồng)

---

## 🛠️ Công nghệ & Kỹ thuật Áp dụng

- **React Native 0.87 & React 19**
- **React Navigation (`@react-navigation/native-stack`)**: Điều hướng mượt mà giữa 4 màn hình.
- **Quản lý trạng thái bằng `useState`**: Đóng gói trong `StudentProvider` (`StudentContext`) chia sẻ trạng thái tập trung và phản ứng tức thì.
- **`FlatList`**: Tối ưu hiển thị danh sách lớn, hỗ trợ Empty State khi không có kết quả tìm kiếm.
- **`TextInput` & `KeyboardAvoidingView`**: Giao diện nhập liệu thân thiện trên cả iOS và Android, tự động căn chỉnh bàn phím.
- **Component dùng chung**:
  - `Header`: Tiêu đề kèm nút quay lại và nút thao tác nhanh.
  - `CustomInput`: Ô nhập liệu có nhãn, dấu bắt buộc, báo lỗi viền đỏ trực quan, nút xóa nhanh nội dung.
  - `CustomButton`: Nút bấm với nhiều biến thể màu (primary, danger, outline), kích thước và trạng thái loading.
  - `StudentCard`: Thẻ sinh viên tinh tế với avatar chữ cái đầu và hiệu ứng đổ bóng.
  - `RankBadge`: Huy hiệu xếp loại với chấm tròn và màu sắc theo chuẩn.
  - `EmptyState`: Trạng thái trống sinh động khi tìm kiếm hoặc danh sách rỗng.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cài đặt Pods (Dành cho iOS trên macOS)
```bash
bundle exec pod install --project-directory=ios
```

### 3. Khởi chạy ứng dụng
- **Chạy dev server Metro**:
  ```bash
  npm start
  ```
- **Chạy trên iOS Simulator**:
  ```bash
  npm run ios
  ```
- **Chạy trên Android Emulator**:
  ```bash
  npm run android
  ```

### 4. Chạy kiểm thử tự động (Unit Tests)
```bash
npm test
```
Toàn bộ unit test cho logic xếp loại, validation form và render root App đều vượt qua 100%.
