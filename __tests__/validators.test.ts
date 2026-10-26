import { parseDueInput, validateDueDate, validateTitle } from '../src/utils/validators';

const now = new Date(2026, 9, 26, 12, 0);

test('tiêu đề không được rỗng', () => {
  expect(validateTitle('   ')).not.toBe('');
  expect(validateTitle('Bài tập 1')).toBe('');
});

test('parseDueInput', () => {
  expect(parseDueInput('09/11/2026 23:59')?.getDate()).toBe(9);
  expect(parseDueInput('09/11/2026')?.getHours()).toBe(23);
  expect(parseDueInput('31/02/2026')).toBeNull();
  expect(parseDueInput('abc')).toBeNull();
});

test('hạn nộp không ở quá khứ', () => {
  expect(validateDueDate('25/10/2026 10:00', now)).toMatch(/quá khứ/);
  expect(validateDueDate('27/10/2026 10:00', now)).toBe('');
  expect(validateDueDate('27-10-2026', now)).toMatch(/dd\/MM\/yyyy/);
});
