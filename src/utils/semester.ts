/** "HK1 2026-2027" → khóa sắp xếp theo năm rồi theo học kỳ */
const semesterKey = (name: string): number => {
  const m = name.match(/HK(\d)\s+(\d{4})/);
  return m ? Number(m[2]) * 10 + Number(m[1]) : 0;
};

/** Học kỳ mới nhất đứng đầu, bỏ trùng lặp */
export const sortSemesters = (names: string[]): string[] =>
  Array.from(new Set(names)).sort((a, b) => semesterKey(b) - semesterKey(a));

export const latestSemester = (names: string[]): string | null =>
  sortSemesters(names)[0] ?? null;
