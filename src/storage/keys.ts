export const KEYS = {
  student: 'cache:student',
  courses: 'cache:courses',
  sessions: 'cache:sessions',
  assignments: 'cache:assignments',
  grades: 'cache:grades',
  course: (id: number) => `cache:course:${id}`,
  session: (id: number) => `cache:session:${id}`,
  assignment: (id: number) => `cache:assignment:${id}`,
  grade: (id: number) => `cache:grade:${id}`,
  outbox: 'outbox',
};
