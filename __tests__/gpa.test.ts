import { Course, Grade } from '../src/types';
import { calcGpa, calcTotal, toLetter, toScale4 } from '../src/utils/gpa';

const course = (id: number, credits: number) => ({ id, credits } as Course);
const grade = (courseId: number, total: number) => ({ courseId, total } as Grade);

describe('toScale4', () => {
  test.each([
    [10, 4.0],
    [8.5, 4.0],
    [8.4, 3.5],
    [7.0, 3.0],
    [6.5, 2.5],
    [5.5, 2.0],
    [5.0, 1.5],
    [4.0, 1.0],
    [3.9, 0],
  ])('%s -> %s', (score, expected) => {
    expect(toScale4(score)).toBe(expected);
  });
});

test('toLetter', () => {
  expect(toLetter(9)).toBe('A');
  expect(toLetter(8.25)).toBe('B+');
  expect(toLetter(3)).toBe('F');
});

test('calcTotal = 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ', () => {
  expect(calcTotal(9, 7.5, 8.5)).toBe(8.25);
});

describe('calcGpa', () => {
  test('có trọng số theo tín chỉ', () => {
    const { gpa, totalCredits } = calcGpa(
      [grade(1, 9), grade(2, 7)],
      [course(1, 3), course(2, 2)],
    );
    expect(gpa).toBeCloseTo((4 * 3 + 3 * 2) / 5);
    expect(totalCredits).toBe(5);
  });

  test('môn F tính vào GPA nhưng không tính tín chỉ tích lũy', () => {
    const { gpa, totalCredits } = calcGpa(
      [grade(1, 9), grade(2, 2)],
      [course(1, 3), course(2, 3)],
    );
    expect(gpa).toBeCloseTo(2);
    expect(totalCredits).toBe(3);
  });

  test('danh sách rỗng', () => {
    expect(calcGpa([], [])).toEqual({ gpa: 0, totalCredits: 0 });
  });
});
