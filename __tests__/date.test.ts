import { daysLeft, formatDate, formatDateTime, getDayOfWeek, isOverdue } from '../src/utils/date';

test('định dạng ngày giờ', () => {
  const d = new Date(2026, 9, 26, 14, 32);
  expect(formatDate(d)).toBe('26/10/2026');
  expect(formatDateTime(d)).toBe('14:32, 26/10/2026');
});

test('isOverdue và daysLeft', () => {
  const now = new Date(2026, 9, 26, 12, 0);
  expect(isOverdue(new Date(2026, 9, 25).toISOString(), now)).toBe(true);
  expect(isOverdue(new Date(2026, 9, 27).toISOString(), now)).toBe(false);
  expect(daysLeft(new Date(2026, 9, 28, 12, 0).toISOString(), now)).toBe(2);
});

test('getDayOfWeek: Thứ 2 = 2, Chủ nhật = 8', () => {
  expect(getDayOfWeek(new Date(2026, 9, 26))).toBe(2); // Thứ 2
  expect(getDayOfWeek(new Date(2026, 9, 25))).toBe(8); // Chủ nhật
});
