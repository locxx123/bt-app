const pad = (n: number) => String(n).padStart(2, '0');
const DAY_MS = 24 * 60 * 60 * 1000;

/** dd/MM/yyyy */
export const formatDate = (iso: string | Date): string => {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** HH:mm */
export const formatTime = (iso: string | Date): string => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** HH:mm, dd/MM/yyyy */
export const formatDateTime = (iso: string | Date): string =>
  `${formatTime(iso)}, ${formatDate(iso)}`;

export const isOverdue = (dueDate: string, now: Date = new Date()): boolean =>
  new Date(dueDate).getTime() < now.getTime();

/** Số ngày còn lại tới hạn (làm tròn lên); âm nếu đã quá hạn */
export const daysLeft = (dueDate: string, now: Date = new Date()): number =>
  Math.ceil((new Date(dueDate).getTime() - now.getTime()) / DAY_MS);

/** Thứ trong tuần theo quy ước của đề: 2 = Thứ 2 ... 8 = Chủ nhật */
export const getDayOfWeek = (date: Date = new Date()): number =>
  date.getDay() === 0 ? 8 : date.getDay() + 1;

export const DAY_LABELS: Record<number, string> = {
  2: 'Thứ 2',
  3: 'Thứ 3',
  4: 'Thứ 4',
  5: 'Thứ 5',
  6: 'Thứ 6',
  7: 'Thứ 7',
  8: 'Chủ nhật',
};
