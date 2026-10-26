import { Course, Grade } from '../types';

/** Bảng quy đổi điểm hệ 10 sang hệ 4 và điểm chữ */
const SCALE: { min: number; letter: string; point: number }[] = [
  { min: 8.5, letter: 'A', point: 4.0 },
  { min: 8.0, letter: 'B+', point: 3.5 },
  { min: 7.0, letter: 'B', point: 3.0 },
  { min: 6.5, letter: 'C+', point: 2.5 },
  { min: 5.5, letter: 'C', point: 2.0 },
  { min: 5.0, letter: 'D+', point: 1.5 },
  { min: 4.0, letter: 'D', point: 1.0 },
];

export const toLetter = (score10: number): string =>
  SCALE.find(s => score10 >= s.min)?.letter ?? 'F';

export const toScale4 = (score10: number): number =>
  SCALE.find(s => score10 >= s.min)?.point ?? 0;

/** Điểm tổng kết = 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ */
export const calcTotal = (
  attendance: number,
  midterm: number,
  final: number,
): number => Math.round((attendance * 0.1 + midterm * 0.3 + final * 0.6) * 100) / 100;

/** GPA hệ 4 có trọng số theo tín chỉ; môn F không tính vào tín chỉ tích lũy */
export const calcGpa = (
  grades: Grade[],
  courses: Course[],
): { gpa: number; totalCredits: number } => {
  let points = 0;
  let creditsAll = 0;
  let totalCredits = 0;
  grades.forEach(g => {
    const credits = courses.find(c => c.id === g.courseId)?.credits ?? 0;
    const p = toScale4(g.total);
    points += p * credits;
    creditsAll += credits;
    if (p > 0) {
      totalCredits += credits;
    }
  });
  return { gpa: creditsAll === 0 ? 0 : points / creditsAll, totalCredits };
};
