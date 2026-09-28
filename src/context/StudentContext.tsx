import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student } from '../types/student';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import { calculateRank } from '../utils/ranking';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'rank'>) => boolean;
  updateStudent: (student: Student) => boolean;
  deleteStudent: (studentId: string) => boolean;
  getStudentById: (studentId: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Quản lý danh sách sinh viên bằng useState theo đúng yêu cầu kỹ thuật
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const addStudent = (newStudentData: Omit<Student, 'id' | 'rank'>): boolean => {
    const studentWithRank: Student = {
      ...newStudentData,
      id: `sv-${Date.now()}`,
      studentCode: newStudentData.studentCode.trim().toUpperCase(),
      rank: calculateRank(newStudentData.gpa),
    };
    setStudents(prev => [studentWithRank, ...prev]);
    return true;
  };

  const updateStudent = (updatedStudent: Student): boolean => {
    const updatedWithRank: Student = {
      ...updatedStudent,
      studentCode: updatedStudent.studentCode.trim().toUpperCase(),
      rank: calculateRank(updatedStudent.gpa),
    };
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedWithRank : s))
    );
    return true;
  };

  const deleteStudent = (studentId: string): boolean => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    return true;
  };

  const getStudentById = (studentId: string): Student | undefined => {
    return students.find(s => s.id === studentId);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
