import {
  calcGpa,
  calcTotalScore,
  getAssignmentDisplayStatus,
  getDayOfWeek,
  getSessionStatus,
  isDueSoon,
  normalizeText,
  toGrade,
} from '../src/utils/studyHelpers';
import { Assignment, ClassSession, Subject } from '../src/types/study';

// Thứ 4, 14/10/2026 lúc 10:00
const NOW = new Date(2026, 9, 14, 10, 0);

const session = (
  dayOfWeek: ClassSession['dayOfWeek'],
  start: string,
  end: string,
): ClassSession => ({
  id: 's',
  subjectId: 'sub',
  dayOfWeek,
  startTime: start,
  endTime: end,
  room: 'A1',
  lecturer: 'GV',
  type: 'Lý thuyết',
});

const assignment = (
  dueDate: Date,
  status: Assignment['status'],
): Assignment => ({
  id: 'a',
  subjectId: 'sub',
  title: 'Bài tập',
  description: '',
  requirements: [],
  dueDate: dueDate.toISOString(),
  status,
});

describe('Thời khóa biểu', () => {
  test('Chủ nhật được quy về 7', () => {
    expect(getDayOfWeek(new Date(2026, 9, 18))).toBe(7);
    expect(getDayOfWeek(NOW)).toBe(3);
  });

  test('Phân biệt buổi học đã kết thúc / đang diễn ra / sắp diễn ra', () => {
    expect(getSessionStatus(session(2, '07:00', '09:00'), NOW)).toBe('ended');
    expect(getSessionStatus(session(3, '07:00', '09:30'), NOW)).toBe('ended');
    expect(getSessionStatus(session(3, '09:45', '12:00'), NOW)).toBe('ongoing');
    expect(getSessionStatus(session(3, '13:00', '15:00'), NOW)).toBe(
      'upcoming',
    );
    expect(getSessionStatus(session(5, '07:00', '09:00'), NOW)).toBe(
      'upcoming',
    );
  });
});

describe('Bài tập', () => {
  const yesterday = new Date(2026, 9, 13, 23, 59);
  const tomorrow = new Date(2026, 9, 15, 23, 59);
  const nextWeek = new Date(2026, 9, 21, 23, 59);

  test('Bài chưa xong và đã qua hạn là quá hạn', () => {
    expect(getAssignmentDisplayStatus(assignment(yesterday, 'todo'), NOW)).toBe(
      'overdue',
    );
    expect(
      getAssignmentDisplayStatus(assignment(yesterday, 'in_progress'), NOW),
    ).toBe('overdue');
    expect(getAssignmentDisplayStatus(assignment(yesterday, 'done'), NOW)).toBe(
      'done',
    );
    expect(getAssignmentDisplayStatus(assignment(tomorrow, 'todo'), NOW)).toBe(
      'todo',
    );
  });

  test('Sắp đến hạn trong vòng 3 ngày', () => {
    expect(isDueSoon(assignment(tomorrow, 'todo'), NOW)).toBe(true);
    expect(isDueSoon(assignment(tomorrow, 'done'), NOW)).toBe(false);
    expect(isDueSoon(assignment(nextWeek, 'todo'), NOW)).toBe(false);
    expect(isDueSoon(assignment(yesterday, 'todo'), NOW)).toBe(false);
  });
});

describe('Kết quả học tập', () => {
  test('Điểm tổng kết = CC*0.1 + GK*0.3 + CK*0.6', () => {
    expect(
      calcTotalScore({
        subjectId: 'x',
        attendance: 10,
        midterm: 8,
        final: 8.5,
      }),
    ).toBe(8.5);
    expect(
      calcTotalScore({
        subjectId: 'x',
        attendance: 10,
        midterm: 8,
        final: null,
      }),
    ).toBeNull();
  });

  test('Quy đổi điểm chữ', () => {
    expect(toGrade(8.6).letter).toBe('A');
    expect(toGrade(7.0).letter).toBe('B');
    expect(toGrade(3.9).letter).toBe('F');
  });

  test('GPA tính theo trọng số tín chỉ, bỏ qua môn chưa có điểm', () => {
    const subjects = [
      { id: 'a', credits: 3 },
      { id: 'b', credits: 2 },
      { id: 'c', credits: 3 },
    ] as Subject[];
    const summary = calcGpa(subjects, [
      { subjectId: 'a', attendance: 10, midterm: 10, final: 10 },
      { subjectId: 'b', attendance: 5, midterm: 5, final: 5 },
      { subjectId: 'c', attendance: 10, midterm: null, final: null },
    ]);
    expect(summary.gpa10).toBe(8);
    expect(summary.credits).toBe(5);
    expect(summary.passedCredits).toBe(5);
  });
});

test('Tìm kiếm không phân biệt dấu', () => {
  expect(normalizeText('Trí Tuệ Nhân Tạo')).toBe('tri tue nhan tao');
  expect(normalizeText('Đồ án')).toBe('do an');
});
