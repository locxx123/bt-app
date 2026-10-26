export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
}

export interface Session {
  id: number;
  courseId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: Course;
}

export type AssignmentStatus = 'todo' | 'done';

export interface Assignment {
  id: number;
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  updatedAt: string;
  course?: Course;
  /** Id tạm của bài tập thêm khi offline, chưa có trên server */
  localOnly?: boolean;
}

export interface Grade {
  id: number;
  courseId: number;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH';

export interface ApiError {
  type: 'network' | 'timeout' | 'http';
  status: number;
  message: string;
}

export interface OutboxAction {
  id: string;
  method: HttpMethod;
  url: string;
  body?: Record<string, unknown>;
  createdAt: number;
}
