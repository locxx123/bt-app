import {
  Assignment,
  ClassSession,
  Semester,
  StudentProfile,
  Subject,
  SubjectResult,
} from '../types/study';

export const CURRENT_SEMESTER_ID = 'hk1-2627';

export const SEMESTERS: Semester[] = [
  { id: 'hk1-2526', name: 'HK1 2025-2026' },
  { id: 'hk2-2526', name: 'HK2 2025-2026' },
  { id: 'hk1-2627', name: 'HK1 2026-2027' },
];

export const INITIAL_STUDENT: StudentProfile = {
  studentCode: 'B23DCCC101',
  fullName: 'Vũ Tiến Lộc',
  className: 'D23CQCC01-B',
  major: 'Công nghệ thông tin',
  cohort: 'Khóa 2023 - 2028',
  email: 'loc.vt@stu.edu.vn',
  phone: '0912345678',
};

export const SUBJECTS: Subject[] = [
  // HK1 2026-2027 (học kỳ hiện tại)
  {
    id: 'sub-mobile',
    code: 'INT3120',
    name: 'Phát triển ứng dụng cho thiết bị di động',
    credits: 3,
    lecturer: 'TS. Trần Đức Minh',
    semesterId: 'hk1-2627',
    description:
      'Kiến thức nền tảng về phát triển ứng dụng di động đa nền tảng với React Native: component, state, navigation, lưu trữ cục bộ và gọi API.',
  },
  {
    id: 'sub-web',
    code: 'INT3306',
    name: 'Phát triển ứng dụng Web',
    credits: 3,
    lecturer: 'ThS. Lê Văn Hùng',
    semesterId: 'hk1-2627',
    description:
      'Xây dựng ứng dụng web hoàn chỉnh: HTML/CSS, JavaScript, REST API với Node.js và cơ sở dữ liệu.',
  },
  {
    id: 'sub-ai',
    code: 'INT3401',
    name: 'Trí tuệ nhân tạo',
    credits: 3,
    lecturer: 'PGS.TS. Phạm Quang Huy',
    semesterId: 'hk1-2627',
    description:
      'Các phương pháp tìm kiếm, biểu diễn tri thức, suy diễn và nhập môn học máy.',
  },
  {
    id: 'sub-se',
    code: 'INT1340',
    name: 'Nhập môn công nghệ phần mềm',
    credits: 3,
    lecturer: 'ThS. Nguyễn Thị Hoa',
    semesterId: 'hk1-2627',
    description:
      'Quy trình phát triển phần mềm, phân tích yêu cầu, thiết kế, kiểm thử và quản lý dự án.',
  },
  {
    id: 'sub-dm',
    code: 'INT3209',
    name: 'Khai phá dữ liệu',
    credits: 3,
    lecturer: 'TS. Đỗ Thu Trang',
    semesterId: 'hk1-2627',
    description:
      'Tiền xử lý dữ liệu, luật kết hợp, phân lớp, phân cụm và đánh giá mô hình.',
  },
  {
    id: 'sub-history',
    code: 'BAS1153',
    name: 'Lịch sử Đảng Cộng sản Việt Nam',
    credits: 2,
    lecturer: 'ThS. Vũ Thị Lan',
    semesterId: 'hk1-2627',
    description:
      'Quá trình ra đời và lãnh đạo cách mạng của Đảng Cộng sản Việt Nam.',
  },

  // HK2 2025-2026
  {
    id: 'sub-db',
    code: 'INT2211',
    name: 'Cơ sở dữ liệu',
    credits: 3,
    lecturer: 'TS. Hoàng Minh Tuấn',
    semesterId: 'hk2-2526',
    description: 'Mô hình quan hệ, SQL, chuẩn hóa và thiết kế cơ sở dữ liệu.',
  },
  {
    id: 'sub-network',
    code: 'INT2213',
    name: 'Mạng máy tính',
    credits: 3,
    lecturer: 'ThS. Bùi Thanh Sơn',
    semesterId: 'hk2-2526',
    description:
      'Mô hình OSI, TCP/IP, định tuyến và các giao thức tầng ứng dụng.',
  },
  {
    id: 'sub-oop',
    code: 'INT2204',
    name: 'Lập trình hướng đối tượng',
    credits: 3,
    lecturer: 'TS. Ngô Văn Khoa',
    semesterId: 'hk2-2526',
    description:
      'Lớp, đối tượng, kế thừa, đa hình và các mẫu thiết kế cơ bản với Java.',
  },
  {
    id: 'sub-prob',
    code: 'MAT1101',
    name: 'Xác suất thống kê',
    credits: 3,
    lecturer: 'TS. Đinh Thị Mai',
    semesterId: 'hk2-2526',
    description:
      'Biến ngẫu nhiên, phân phối xác suất, ước lượng và kiểm định giả thuyết.',
  },

  // HK1 2025-2026
  {
    id: 'sub-dsa',
    code: 'INT2210',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 3,
    lecturer: 'TS. Lý Quốc Bảo',
    semesterId: 'hk1-2526',
    description:
      'Danh sách, cây, đồ thị, sắp xếp, tìm kiếm và phân tích độ phức tạp.',
  },
  {
    id: 'sub-os',
    code: 'INT2207',
    name: 'Hệ điều hành',
    credits: 3,
    lecturer: 'ThS. Phan Văn Đức',
    semesterId: 'hk1-2526',
    description: 'Quản lý tiến trình, bộ nhớ, hệ thống tệp và đồng bộ hóa.',
  },
  {
    id: 'sub-discrete',
    code: 'INT1050',
    name: 'Toán rời rạc',
    credits: 3,
    lecturer: 'TS. Trịnh Thu Hà',
    semesterId: 'hk1-2526',
    description: 'Logic, tập hợp, tổ hợp, quan hệ và lý thuyết đồ thị.',
  },
  {
    id: 'sub-arch',
    code: 'INT2212',
    name: 'Kiến trúc máy tính',
    credits: 3,
    lecturer: 'ThS. Cao Minh Đạt',
    semesterId: 'hk1-2526',
    description: 'Biểu diễn dữ liệu, tập lệnh, bộ xử lý, bộ nhớ và vào/ra.',
  },
];

export const SESSIONS: ClassSession[] = [
  // Thứ 2
  {
    id: 'ses-1',
    subjectId: 'sub-mobile',
    dayOfWeek: 1,
    startTime: '07:00',
    endTime: '09:30',
    room: 'A2-301',
    lecturer: 'TS. Trần Đức Minh',
    type: 'Lý thuyết',
  },
  {
    id: 'ses-2',
    subjectId: 'sub-history',
    dayOfWeek: 1,
    startTime: '09:45',
    endTime: '11:15',
    room: 'A1-204',
    lecturer: 'ThS. Vũ Thị Lan',
    type: 'Lý thuyết',
  },
  {
    id: 'ses-3',
    subjectId: 'sub-web',
    dayOfWeek: 1,
    startTime: '13:00',
    endTime: '15:30',
    room: 'Lab B3-402',
    lecturer: 'ThS. Lê Văn Hùng',
    type: 'Thực hành',
    note: 'Mang laptop đã cài Node.js',
  },
  // Thứ 3
  {
    id: 'ses-4',
    subjectId: 'sub-ai',
    dayOfWeek: 2,
    startTime: '07:00',
    endTime: '09:30',
    room: 'A3-105',
    lecturer: 'PGS.TS. Phạm Quang Huy',
    type: 'Lý thuyết',
  },
  {
    id: 'ses-5',
    subjectId: 'sub-se',
    dayOfWeek: 2,
    startTime: '13:00',
    endTime: '15:30',
    room: 'A2-208',
    lecturer: 'ThS. Nguyễn Thị Hoa',
    type: 'Lý thuyết',
  },
  // Thứ 4
  {
    id: 'ses-6',
    subjectId: 'sub-dm',
    dayOfWeek: 3,
    startTime: '09:45',
    endTime: '12:00',
    room: 'A3-302',
    lecturer: 'TS. Đỗ Thu Trang',
    type: 'Lý thuyết',
  },
  {
    id: 'ses-7',
    subjectId: 'sub-mobile',
    dayOfWeek: 3,
    startTime: '13:00',
    endTime: '16:00',
    room: 'Lab B3-405',
    lecturer: 'TS. Trần Đức Minh',
    type: 'Thực hành',
    note: 'Chuẩn bị máy ảo Android',
  },
  // Thứ 5
  {
    id: 'ses-8',
    subjectId: 'sub-web',
    dayOfWeek: 4,
    startTime: '07:00',
    endTime: '09:30',
    room: 'A2-305',
    lecturer: 'ThS. Lê Văn Hùng',
    type: 'Lý thuyết',
  },
  {
    id: 'ses-9',
    subjectId: 'sub-history',
    dayOfWeek: 4,
    startTime: '13:00',
    endTime: '14:30',
    room: 'A1-204',
    lecturer: 'ThS. Vũ Thị Lan',
    type: 'Lý thuyết',
  },
  // Thứ 6
  {
    id: 'ses-10',
    subjectId: 'sub-ai',
    dayOfWeek: 5,
    startTime: '09:45',
    endTime: '11:15',
    room: 'Lab B3-401',
    lecturer: 'PGS.TS. Phạm Quang Huy',
    type: 'Thực hành',
  },
  {
    id: 'ses-11',
    subjectId: 'sub-se',
    dayOfWeek: 5,
    startTime: '13:00',
    endTime: '15:30',
    room: 'A2-208',
    lecturer: 'ThS. Nguyễn Thị Hoa',
    type: 'Lý thuyết',
  },
  // Thứ 7
  {
    id: 'ses-12',
    subjectId: 'sub-dm',
    dayOfWeek: 6,
    startTime: '07:00',
    endTime: '09:30',
    room: 'Lab B3-403',
    lecturer: 'TS. Đỗ Thu Trang',
    type: 'Thực hành',
  },
];

export const RESULTS: SubjectResult[] = [
  // Học kỳ hiện tại: mới có điểm chuyên cần / giữa kỳ
  { subjectId: 'sub-mobile', attendance: 10, midterm: 8.5, final: null },
  { subjectId: 'sub-web', attendance: 9, midterm: 7.5, final: null },
  { subjectId: 'sub-ai', attendance: 9, midterm: null, final: null },
  { subjectId: 'sub-se', attendance: 10, midterm: 8, final: null },
  { subjectId: 'sub-dm', attendance: 8, midterm: 7, final: null },
  { subjectId: 'sub-history', attendance: 10, midterm: null, final: null },
  // HK2 2025-2026
  { subjectId: 'sub-db', attendance: 10, midterm: 8, final: 8.5 },
  { subjectId: 'sub-network', attendance: 9, midterm: 7, final: 7.5 },
  { subjectId: 'sub-oop', attendance: 10, midterm: 9, final: 8.5 },
  { subjectId: 'sub-prob', attendance: 8, midterm: 6, final: 6.5 },
  // HK1 2025-2026
  { subjectId: 'sub-dsa', attendance: 10, midterm: 8.5, final: 9 },
  { subjectId: 'sub-os', attendance: 9, midterm: 7, final: 7 },
  { subjectId: 'sub-discrete', attendance: 10, midterm: 6.5, final: 7.5 },
  { subjectId: 'sub-arch', attendance: 8, midterm: 6, final: 5.5 },
];

/** Hạn nộp tính tương đối theo ngày tạo dữ liệu để dữ liệu mẫu luôn hợp lý */
const daysFromNow = (days: number, hour = 23, minute = 59): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const createInitialAssignments = (): Assignment[] => [
  {
    id: 'asg-1',
    subjectId: 'sub-mobile',
    title: 'Lab 3: Navigation trong React Native',
    description:
      'Xây dựng ứng dụng nhiều màn hình sử dụng Stack và Bottom Tab Navigator.',
    requirements: [
      'Có ít nhất 3 tab và 2 màn hình chi tiết',
      'Truyền tham số giữa các màn hình',
      'Nộp link GitHub kèm ảnh chụp màn hình',
    ],
    dueDate: daysFromNow(1),
    status: 'todo',
  },
  {
    id: 'asg-2',
    subjectId: 'sub-mobile',
    title: 'Bài tập lớn: Ứng dụng quản lý học tập',
    description:
      'Làm việc nhóm 3 người, xây dựng ứng dụng quản lý học tập cho sinh viên.',
    requirements: [
      'Sử dụng Bottom Tab kết hợp Native Stack',
      'Lưu trữ dữ liệu bằng AsyncStorage hoặc SQLite',
      'Có tìm kiếm, lọc và xử lý trạng thái rỗng',
      'Báo cáo PDF tối đa 20 trang',
    ],
    dueDate: daysFromNow(5),
    status: 'in_progress',
  },
  {
    id: 'asg-3',
    subjectId: 'sub-web',
    title: 'Xây dựng REST API với Node.js',
    description: 'Thiết kế và cài đặt REST API CRUD cho hệ thống quản lý sách.',
    requirements: [
      'Sử dụng Express và MongoDB/MySQL',
      'Có xác thực JWT',
      'Viết tài liệu API bằng Postman collection',
    ],
    dueDate: daysFromNow(2),
    status: 'in_progress',
  },
  {
    id: 'asg-4',
    subjectId: 'sub-web',
    title: 'Lab 2: Giao diện responsive với HTML/CSS',
    description:
      'Dựng lại trang chủ một website tin tức theo thiết kế cho trước.',
    requirements: [
      'Hiển thị tốt trên mobile, tablet, desktop',
      'Không dùng framework CSS',
    ],
    dueDate: daysFromNow(-3),
    status: 'done',
  },
  {
    id: 'asg-5',
    subjectId: 'sub-ai',
    title: 'Cài đặt thuật toán tìm kiếm A*',
    description: 'Cài đặt A* giải bài toán tìm đường trên lưới có vật cản.',
    requirements: [
      'So sánh với BFS và Dijkstra',
      'Trình bày heuristic sử dụng và chứng minh tính chấp nhận được',
    ],
    dueDate: daysFromNow(-1),
    status: 'todo',
  },
  {
    id: 'asg-6',
    subjectId: 'sub-ai',
    title: 'Báo cáo: Ứng dụng học máy trong thực tế',
    description:
      'Tìm hiểu và trình bày một ứng dụng học máy trong một lĩnh vực cụ thể.',
    requirements: ['Báo cáo 8-10 trang', 'Slide thuyết trình 10 phút'],
    dueDate: daysFromNow(12),
    status: 'todo',
  },
  {
    id: 'asg-7',
    subjectId: 'sub-se',
    title: 'Tài liệu đặc tả yêu cầu phần mềm (SRS)',
    description: 'Viết tài liệu SRS cho đề tài nhóm theo chuẩn IEEE 830.',
    requirements: [
      'Đầy đủ yêu cầu chức năng và phi chức năng',
      'Có sơ đồ Use Case và đặc tả Use Case',
    ],
    dueDate: daysFromNow(7),
    status: 'in_progress',
  },
  {
    id: 'asg-8',
    subjectId: 'sub-se',
    title: 'Sơ đồ Use Case tổng quát',
    description: 'Vẽ sơ đồ Use Case tổng quát cho đề tài nhóm.',
    requirements: ['Sử dụng draw.io hoặc StarUML'],
    dueDate: daysFromNow(-6),
    status: 'done',
  },
  {
    id: 'asg-9',
    subjectId: 'sub-dm',
    title: 'Tiền xử lý dữ liệu với Pandas',
    description: 'Làm sạch và chuẩn hóa bộ dữ liệu giá nhà được cung cấp.',
    requirements: [
      'Xử lý giá trị thiếu và ngoại lai',
      'Nộp file Jupyter Notebook',
    ],
    dueDate: daysFromNow(-2),
    status: 'in_progress',
  },
  {
    id: 'asg-10',
    subjectId: 'sub-dm',
    title: 'Phân cụm khách hàng với K-Means',
    description: 'Phân cụm tập khách hàng siêu thị và diễn giải kết quả.',
    requirements: [
      'Chọn số cụm bằng phương pháp Elbow',
      'Trực quan hóa kết quả',
    ],
    dueDate: daysFromNow(9),
    status: 'todo',
  },
  {
    id: 'asg-11',
    subjectId: 'sub-history',
    title: 'Tiểu luận giữa kỳ',
    description: 'Viết tiểu luận về một giai đoạn lịch sử được phân công.',
    requirements: [
      'Từ 3000 đến 5000 từ',
      'Trích dẫn tài liệu tham khảo đầy đủ',
    ],
    dueDate: daysFromNow(3),
    status: 'todo',
  },
  {
    id: 'asg-12',
    subjectId: 'sub-db',
    title: 'Thiết kế CSDL quản lý thư viện',
    description: 'Thiết kế lược đồ quan hệ và cài đặt trên MySQL.',
    requirements: ['Lược đồ đạt chuẩn 3NF', 'Viết 10 truy vấn SQL mẫu'],
    dueDate: daysFromNow(-150),
    status: 'done',
  },
];
