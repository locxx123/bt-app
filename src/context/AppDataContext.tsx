import React, { createContext, useContext, useMemo } from 'react';
import * as assignmentService from '../api/assignmentService';
import * as courseService from '../api/courseService';
import * as gradeService from '../api/gradeService';
import * as studentService from '../api/studentService';
import { CachedQuery, useCachedQuery } from '../hooks/useCachedQuery';
import { KEYS } from '../storage/keys';
import { Assignment, AssignmentStatus, Course, Grade, Student } from '../types';
import { notify } from '../utils/notify';
import { useSync } from './SyncContext';

export const STUDENT_ID = 1;
const STUDENT_URL = `/students/${STUDENT_ID}`;
const ASSIGNMENT_URL = /^\/assignments\/(\d+)$/;

export interface NewAssignment {
  courseId: number;
  title: string;
  description: string;
  dueDate: string;
}

export interface AppData {
  student: CachedQuery<Student>;
  courses: CachedQuery<Course[]>;
  assignments: CachedQuery<Assignment[]>;
  grades: CachedQuery<Grade[]>;
  /** Id các bài tập có thay đổi chưa đồng bộ (gồm cả bài tạo offline) */
  pendingAssignmentIds: number[];
  profilePending: boolean;
  toggleStatus: (assignment: Assignment) => Promise<void>;
  addAssignment: (data: NewAssignment) => Promise<void>;
  updateProfile: (data: Partial<Student>) => Promise<void>;
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isOnline, actions, syncVersion, enqueue } = useSync();

  const student = useCachedQuery(KEYS.student, () => studentService.getById(STUDENT_ID), syncVersion);
  const courses = useCachedQuery(KEYS.courses, courseService.getAll);
  const assignments = useCachedQuery(KEYS.assignments, assignmentService.getAll, syncVersion);
  const grades = useCachedQuery(KEYS.grades, gradeService.getAll);

  // Dữ liệu hiển thị = dữ liệu server + các thao tác đang chờ trong outbox
  const { assignmentList, pendingAssignmentIds } = useMemo(() => {
    const pending: number[] = [];
    const list: Assignment[] = (assignments.data ?? []).map(a => ({ ...a }));
    actions.forEach(action => {
      const match = action.url.match(ASSIGNMENT_URL);
      if (action.method === 'PATCH' && match) {
        const id = Number(match[1]);
        const target = list.find(a => a.id === id);
        if (target) {
          Object.assign(target, action.body);
          pending.push(id);
        }
      } else if (action.method === 'POST' && action.url === '/assignments') {
        const body = action.body as unknown as NewAssignment & { status: AssignmentStatus };
        const localId = -action.createdAt; // id tạm (số âm), server sẽ cấp id thật khi đồng bộ
        list.push({
          id: localId,
          courseId: body.courseId,
          title: body.title,
          description: body.description,
          dueDate: body.dueDate,
          status: body.status,
          updatedAt: new Date(action.createdAt).toISOString(),
          course: (courses.data ?? []).find(c => c.id === body.courseId),
          localOnly: true,
        });
        pending.push(localId);
      }
    });
    list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return { assignmentList: list, pendingAssignmentIds: pending };
  }, [assignments.data, actions, courses.data]);

  const { studentView, profilePending } = useMemo(() => {
    if (!student.data) {
      return { studentView: null, profilePending: false };
    }
    let view = student.data;
    let pending = false;
    actions.forEach(action => {
      if (action.method === 'PATCH' && action.url === STUDENT_URL) {
        view = { ...view, ...(action.body as Partial<Student>) };
        pending = true;
      }
    });
    return { studentView: view, profilePending: pending };
  }, [student.data, actions]);

  // Offline: đưa vào outbox. Online: gọi API rồi tải lại dữ liệu.
  const toggleStatus = async (assignment: Assignment) => {
    if (assignment.localOnly) {
      notify('Bài tập chưa được đồng bộ, hãy đợi đồng bộ xong rồi đổi trạng thái');
      return;
    }
    const status: AssignmentStatus = assignment.status === 'done' ? 'todo' : 'done';
    if (!isOnline) {
      await enqueue({ method: 'PATCH', url: `/assignments/${assignment.id}`, body: { status } });
      return;
    }
    try {
      await assignmentService.update(assignment.id, { status, updatedAt: new Date().toISOString() });
      await assignments.refresh();
    } catch {
      notify('Không thể cập nhật trạng thái bài tập');
    }
  };

  const addAssignment = async (data: NewAssignment) => {
    const body = { ...data, status: 'todo', updatedAt: new Date().toISOString() };
    if (!isOnline) {
      await enqueue({ method: 'POST', url: '/assignments', body });
      return;
    }
    await assignmentService.create(body as Partial<Assignment>);
    await assignments.refresh();
  };

  const updateProfile = async (data: Partial<Student>) => {
    if (!isOnline) {
      await enqueue({ method: 'PATCH', url: STUDENT_URL, body: data });
      return;
    }
    await studentService.update(STUDENT_ID, { ...data, updatedAt: new Date().toISOString() });
    await student.refresh();
  };

  const value: AppData = {
    student: { ...student, data: studentView },
    courses,
    assignments: { ...assignments, data: assignments.data === null ? null : assignmentList },
    grades,
    pendingAssignmentIds,
    profilePending,
    toggleStatus,
    addAssignment,
    updateProfile,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData phải được dùng bên trong AppDataProvider');
  }
  return ctx;
}
