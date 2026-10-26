export const validateTitle = (title: string): string =>
  title.trim() ? '' : 'Vui lòng nhập tiêu đề';

/** dd/MM/yyyy HH:mm hoặc dd/MM/yyyy → Date, null nếu sai định dạng */
export const parseDueInput = (text: string): Date | null => {
  const m = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!m) {
    return null;
  }
  const [, dd, mm, yyyy, hh = '23', mi = '59'] = m;
  const d = new Date(+yyyy, +mm - 1, +dd, +hh, +mi);
  const valid = d.getFullYear() === +yyyy && d.getMonth() === +mm - 1 && d.getDate() === +dd;
  return valid ? d : null;
};

export const validateDueDate = (text: string, now: Date = new Date()): string => {
  const d = parseDueInput(text);
  if (!d) {
    return 'Hạn nộp phải có dạng dd/MM/yyyy HH:mm';
  }
  return d.getTime() < now.getTime() ? 'Hạn nộp không được ở quá khứ' : '';
};

export const validateName = (name: string): string =>
  name.trim() ? '' : 'Vui lòng nhập họ tên';
