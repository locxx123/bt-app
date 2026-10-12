import {
  Assignment,
  AssignmentDisplayStatus,
  ClassSession,
  DayOfWeek,
  SessionStatus,
  Subject,
  SubjectResult,
} from '../types/study';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
  7: 'Chủ nhật',
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  1: 'T2',
  2: 'T3',
  3: 'T4',
  4: 'T5',
  5: 'T6',
  6: 'T7',
  7: 'CN',
};

export const WEEK_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

/** Ngày trong tuần theo quy ước 1 = Thứ 2 ... 7 = Chủ nhật */
export const getDayOfWeek = (date: Date): DayOfWeek =>
  (date.getDay() === 0 ? 7 : date.getDay()) as DayOfWeek;

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const sortSessionsByTime = (sessions: ClassSession[]): ClassSession[] =>
  [...sessions].sort(
    (a, b) =>
      a.dayOfWeek - b.dayOfWeek ||
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

/** Buổi học trong tuần hiện tại: đã kết thúc / đang diễn ra / sắp diễn ra */
export const getSessionStatus = (
  session: ClassSession,
  now: Date,
): SessionStatus => {
  const today = getDayOfWeek(now);
  if (session.dayOfWeek < today) {
    return 'ended';
  }
  if (session.dayOfWeek > today) {
    return 'upcoming';
  }
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= timeToMinutes(session.endTime)) {
    return 'ended';
  }
  if (minutes >= timeToMinutes(session.startTime)) {
    return 'ongoing';
  }
  return 'upcoming';
};

/** Ngày cụ thể (dd/MM) của một thứ trong tuần hiện tại */
export const getDateOfWeekDay = (day: DayOfWeek, now: Date): Date => {
  const d = new Date(now);
  d.setDate(now.getDate() + (day - getDayOfWeek(now)));
  return d;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (date: Date): string =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

export const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${formatDate(d)}`;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const getAssignmentDisplayStatus = (
  assignment: Assignment,
  now: Date,
): AssignmentDisplayStatus => {
  if (assignment.status === 'done') {
    return 'done';
  }
  if (new Date(assignment.dueDate).getTime() < now.getTime()) {
    return 'overdue';
  }
  return assignment.status;
};

/** Chưa hoàn thành và còn hạn trong vòng 3 ngày */
export const isDueSoon = (assignment: Assignment, now: Date): boolean => {
  if (assignment.status === 'done') {
    return false;
  }
  const diff = new Date(assignment.dueDate).getTime() - now.getTime();
  return diff >= 0 && diff <= 3 * DAY_MS;
};

export const formatDueText = (assignment: Assignment, now: Date): string => {
  const diff = new Date(assignment.dueDate).getTime() - now.getTime();
  if (assignment.status === 'done') {
    return `Hạn: ${formatDateTime(assignment.dueDate)}`;
  }
  if (diff < 0) {
    const days = Math.floor(-diff / DAY_MS);
    return days === 0 ? 'Quá hạn hôm nay' : `Quá hạn ${days} ngày`;
  }
  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours < 24) {
    return `Còn ${hours} giờ`;
  }
  return `Còn ${Math.floor(diff / DAY_MS)} ngày`;
};

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu */
export const normalizeText = (text: string): string => {
  const lower = text.toLowerCase().trim();
  try {
    return lower.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  } catch {
    return lower;
  }
};

// ---------- Kết quả học tập ----------

export const RESULT_WEIGHTS = { attendance: 0.1, midterm: 0.3, final: 0.6 };

/** Điểm tổng kết hệ 10, null nếu chưa đủ điểm thành phần */
export const calcTotalScore = (result?: SubjectResult): number | null => {
  if (
    !result ||
    result.attendance === null ||
    result.midterm === null ||
    result.final === null
  ) {
    return null;
  }
  const total =
    result.attendance * RESULT_WEIGHTS.attendance +
    result.midterm * RESULT_WEIGHTS.midterm +
    result.final * RESULT_WEIGHTS.final;
  return Math.round(total * 10) / 10;
};

const GRADE_SCALE: { min: number; letter: string; point: number }[] = [
  { min: 8.5, letter: 'A', point: 4.0 },
  { min: 7.8, letter: 'B+', point: 3.5 },
  { min: 7.0, letter: 'B', point: 3.0 },
  { min: 6.3, letter: 'C+', point: 2.5 },
  { min: 5.5, letter: 'C', point: 2.0 },
  { min: 4.8, letter: 'D+', point: 1.5 },
  { min: 4.0, letter: 'D', point: 1.0 },
  { min: 0, letter: 'F', point: 0 },
];

export const toGrade = (total: number) =>
  GRADE_SCALE.find(g => total >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

export interface GpaSummary {
  gpa10: number | null;
  gpa4: number | null;
  credits: number; // Số tín chỉ đã có điểm tổng kết
  passedCredits: number; // Số tín chỉ đạt (>= 4.0)
}

export const calcGpa = (
  subjects: Subject[],
  results: SubjectResult[],
): GpaSummary => {
  let credits = 0;
  let passedCredits = 0;
  let sum10 = 0;
  let sum4 = 0;
  subjects.forEach(subject => {
    const total = calcTotalScore(results.find(r => r.subjectId === subject.id));
    if (total === null) {
      return;
    }
    credits += subject.credits;
    sum10 += total * subject.credits;
    sum4 += toGrade(total).point * subject.credits;
    if (total >= 4) {
      passedCredits += subject.credits;
    }
  });
  if (credits === 0) {
    return { gpa10: null, gpa4: null, credits, passedCredits };
  }
  return {
    gpa10: Math.round((sum10 / credits) * 100) / 100,
    gpa4: Math.round((sum4 / credits) * 100) / 100,
    credits,
    passedCredits,
  };
};

export const formatScore = (score: number | null | undefined): string =>
  score === null || score === undefined ? '--' : score.toFixed(1);
