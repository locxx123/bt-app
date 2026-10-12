import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface StudentProfile {
  studentCode: string; // Mã sinh viên
  fullName: string; // Họ tên
  className: string; // Lớp
  major: string; // Ngành học
  cohort: string; // Khóa học
  email: string;
  phone: string;
}

export interface Semester {
  id: string;
  name: string; // VD: HK1 2026-2027
}

export interface Subject {
  id: string;
  code: string; // Mã môn học
  name: string; // Tên môn học
  credits: number; // Số tín chỉ
  lecturer: string; // Giảng viên phụ trách
  semesterId: string;
  description: string;
}

/** 1 = Thứ 2 ... 6 = Thứ 7, 7 = Chủ nhật */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ClassSession {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  room: string;
  lecturer: string;
  type: 'Lý thuyết' | 'Thực hành';
  note?: string;
}

export type SessionStatus = 'ended' | 'ongoing' | 'upcoming';

/** Trạng thái người dùng tự cập nhật */
export type AssignmentStatus = 'todo' | 'in_progress' | 'done';

/** Trạng thái hiển thị: thêm "quá hạn" được tính từ hạn nộp */
export type AssignmentDisplayStatus = AssignmentStatus | 'overdue';

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  requirements: string[];
  dueDate: string; // ISO string
  status: AssignmentStatus;
}

export interface SubjectResult {
  subjectId: string;
  attendance: number | null; // Chuyên cần (10%)
  midterm: number | null; // Giữa kỳ (30%)
  final: number | null; // Cuối kỳ (60%)
}

export type MainTabParamList = {
  Dashboard: undefined;
  Subjects: undefined;
  Timetable: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type StudyStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  SubjectDetail: { subjectId: string };
  SessionDetail: { sessionId: string };
  AssignmentDetail: { assignmentId: string };
  ResultDetail: { subjectId: string };
};

export type StudyNavigation = NativeStackNavigationProp<StudyStackParamList>;
