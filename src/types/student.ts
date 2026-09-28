export type RankType = 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';

export type GenderType = 'Nam' | 'Nữ' | 'Khác';

export interface Student {
  id: string;
  studentCode: string; // Mã sinh viên
  fullName: string; // Họ tên
  dateOfBirth: string; // Ngày sinh (DD/MM/YYYY)
  gender: GenderType; // Giới tính
  email: string; // Email
  phone: string; // Số điện thoại
  className: string; // Lớp
  faculty: string; // Khoa
  gpa: number; // Điểm trung bình (0.0 - 10.0)
  rank?: RankType; // Xếp loại học lực
}

export type RootStackParamList = {
  StudentList: undefined;
  StudentDetail: { studentId: string };
  StudentAdd: undefined;
  StudentEdit: { studentId: string };
};
