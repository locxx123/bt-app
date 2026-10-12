import {
  AssignmentDisplayStatus,
  AssignmentStatus,
  SessionStatus,
} from '../types/study';

export const ASSIGNMENT_STATUS_META: Record<
  AssignmentDisplayStatus,
  { label: string; color: string; bg: string }
> = {
  todo: { label: 'Chưa thực hiện', color: '#475569', bg: '#F1F5F9' },
  in_progress: { label: 'Đang thực hiện', color: '#1D4ED8', bg: '#DBEAFE' },
  done: { label: 'Đã hoàn thành', color: '#15803D', bg: '#DCFCE7' },
  overdue: { label: 'Quá hạn', color: '#B91C1C', bg: '#FEE2E2' },
};

/** Các trạng thái người dùng có thể chọn khi cập nhật */
export const EDITABLE_STATUSES: AssignmentStatus[] = [
  'todo',
  'in_progress',
  'done',
];

export const SESSION_STATUS_META: Record<
  SessionStatus,
  { label: string; color: string; bg: string }
> = {
  ended: { label: 'Đã kết thúc', color: '#64748B', bg: '#F1F5F9' },
  ongoing: { label: 'Đang diễn ra', color: '#15803D', bg: '#DCFCE7' },
  upcoming: { label: 'Sắp diễn ra', color: '#1D4ED8', bg: '#DBEAFE' },
};
