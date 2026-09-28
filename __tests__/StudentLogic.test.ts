import { calculateRank } from '../src/utils/ranking';
import { validateStudentForm } from '../src/utils/validation';

describe('Kiểm tra xếp loại học lực theo GPA', () => {
  test('GPA >= 8.5 xếp loại Giỏi', () => {
    expect(calculateRank(8.5)).toBe('Giỏi');
    expect(calculateRank(9.0)).toBe('Giỏi');
    expect(calculateRank(10.0)).toBe('Giỏi');
  });

  test('GPA >= 7.0 và < 8.5 xếp loại Khá', () => {
    expect(calculateRank(7.0)).toBe('Khá');
    expect(calculateRank(7.5)).toBe('Khá');
    expect(calculateRank(8.4)).toBe('Khá');
  });

  test('GPA >= 5.0 và < 7.0 xếp loại Trung bình', () => {
    expect(calculateRank(5.0)).toBe('Trung bình');
    expect(calculateRank(6.0)).toBe('Trung bình');
    expect(calculateRank(6.9)).toBe('Trung bình');
  });

  test('GPA < 5.0 xếp loại Yếu', () => {
    expect(calculateRank(4.9)).toBe('Yếu');
    expect(calculateRank(3.0)).toBe('Yếu');
    expect(calculateRank(0.0)).toBe('Yếu');
  });
});

describe('Kiểm tra validation form sinh viên', () => {
  const existingCodes = ['B21DCCN001', 'B21DCCN045'];

  test('Form hợp lệ', () => {
    const validData = {
      studentCode: 'B21DCCN999',
      fullName: 'Trần Văn Nam',
      dateOfBirth: '20/10/2003',
      gender: 'Nam',
      email: 'nam.tran@gmail.com',
      phone: '0987654321',
      className: 'D21CN01',
      faculty: 'CNTT',
      gpa: '8.5',
    };
    const result = validateStudentForm(validData, existingCodes);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  test('Phát hiện trùng mã sinh viên', () => {
    const duplicateData = {
      studentCode: 'B21DCCN001',
      fullName: 'Trần Văn Nam',
      dateOfBirth: '20/10/2003',
      gender: 'Nam',
      email: 'nam.tran@gmail.com',
      phone: '0987654321',
      className: 'D21CN01',
      faculty: 'CNTT',
      gpa: '8.5',
    };
    const result = validateStudentForm(duplicateData, existingCodes);
    expect(result.isValid).toBe(false);
    expect(result.errors.studentCode).toBe('Mã sinh viên này đã tồn tại');
  });

  test('Phát hiện GPA không hợp lệ (> 10)', () => {
    const invalidGpa = {
      studentCode: 'B21DCCN999',
      fullName: 'Trần Văn Nam',
      dateOfBirth: '20/10/2003',
      gender: 'Nam',
      email: 'nam.tran@gmail.com',
      phone: '0987654321',
      className: 'D21CN01',
      faculty: 'CNTT',
      gpa: '11.5',
    };
    const result = validateStudentForm(invalidGpa, existingCodes);
    expect(result.isValid).toBe(false);
    expect(result.errors.gpa).toBe('Điểm GPA phải nằm trong khoảng từ 0.0 đến 10.0');
  });
});
