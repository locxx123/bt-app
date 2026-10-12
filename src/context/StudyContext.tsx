import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Assignment,
  AssignmentStatus,
  ClassSession,
  Semester,
  StudentProfile,
  Subject,
  SubjectResult,
} from '../types/study';
import {
  CURRENT_SEMESTER_ID,
  INITIAL_STUDENT,
  RESULTS,
  SEMESTERS,
  SESSIONS,
  SUBJECTS,
  createInitialAssignments,
} from '../data/studyData';

const STORAGE_KEY = '@study_app/state_v2';

interface PersistedState {
  contact: Pick<StudentProfile, 'email' | 'phone'>;
  assignments: Assignment[];
}

interface StudyContextValue {
  isLoading: boolean;
  now: Date;
  student: StudentProfile;
  semesters: Semester[];
  currentSemesterId: string;
  subjects: Subject[];
  sessions: ClassSession[];
  assignments: Assignment[];
  results: SubjectResult[];
  getSubject: (id: string) => Subject | undefined;
  getResult: (subjectId: string) => SubjectResult | undefined;
  updateAssignmentStatus: (id: string, status: AssignmentStatus) => void;
  updateContact: (contact: Pick<StudentProfile, 'email' | 'phone'>) => void;
}

const StudyContext = createContext<StudyContextValue | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [now, setNow] = useState(() => new Date());

  // Đọc dữ liệu đã lưu, nếu chưa có thì khởi tạo dữ liệu mẫu
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      let saved: PersistedState | null = null;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        saved = raw ? (JSON.parse(raw) as PersistedState) : null;
      } catch (e) {
        console.warn('Không đọc được dữ liệu đã lưu', e);
      }
      if (!mounted) {
        return;
      }
      // Chỉ thông tin liên hệ do người dùng sửa được lấy từ bộ nhớ
      setStudent({ ...INITIAL_STUDENT, ...saved?.contact });
      setAssignments(saved?.assignments ?? createInitialAssignments());
      setIsLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Lưu lại mỗi khi dữ liệu thay đổi
  useEffect(() => {
    if (isLoading) {
      return;
    }
    const state: PersistedState = {
      contact: { email: student.email, phone: student.phone },
      assignments,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(e =>
      console.warn('Không lưu được dữ liệu', e),
    );
  }, [isLoading, student, assignments]);

  // Cập nhật thời gian hiện tại mỗi phút để trạng thái buổi học / hạn nộp luôn đúng
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getSubject = useCallback(
    (id: string) => SUBJECTS.find(s => s.id === id),
    [],
  );

  const getResult = useCallback(
    (subjectId: string) => RESULTS.find(r => r.subjectId === subjectId),
    [],
  );

  const updateAssignmentStatus = useCallback(
    (id: string, status: AssignmentStatus) => {
      setAssignments(prev =>
        prev.map(a => (a.id === id ? { ...a, status } : a)),
      );
    },
    [],
  );

  const updateContact = useCallback(
    (contact: Pick<StudentProfile, 'email' | 'phone'>) => {
      setStudent(prev => ({ ...prev, ...contact }));
    },
    [],
  );

  const value = useMemo<StudyContextValue>(
    () => ({
      isLoading,
      now,
      student,
      semesters: SEMESTERS,
      currentSemesterId: CURRENT_SEMESTER_ID,
      subjects: SUBJECTS,
      sessions: SESSIONS,
      assignments,
      results: RESULTS,
      getSubject,
      getResult,
      updateAssignmentStatus,
      updateContact,
    }),
    [
      isLoading,
      now,
      student,
      assignments,
      getSubject,
      getResult,
      updateAssignmentStatus,
      updateContact,
    ],
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextValue => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy phải được dùng bên trong StudyProvider');
  }
  return context;
};
