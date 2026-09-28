export interface ValidationError {
  studentCode?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  className?: string;
  faculty?: string;
  gpa?: string;
}

export const validateStudentForm = (
  formData: {
    studentCode: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    className: string;
    faculty: string;
    gpa: string;
  },
  existingStudentCodes: string[],
  currentStudentCode?: string
): { isValid: boolean; errors: ValidationError } => {
  const errors: ValidationError = {};

  // Mã sinh viên
  const code = formData.studentCode.trim().toUpperCase();
  if (!code) {
    errors.studentCode = 'Vui lòng nhập mã sinh viên';
  } else if (code.length < 3) {
    errors.studentCode = 'Mã sinh viên phải có ít nhất 3 ký tự';
  } else if (
    existingStudentCodes.some(
      c => c.toUpperCase() === code && c.toUpperCase() !== currentStudentCode?.toUpperCase()
    )
  ) {
    errors.studentCode = 'Mã sinh viên này đã tồn tại';
  }

  // Họ tên
  const name = formData.fullName.trim();
  if (!name) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  } else if (name.length < 2) {
    errors.fullName = 'Họ tên quá ngắn';
  }

  // Ngày sinh
  const dob = formData.dateOfBirth.trim();
  const dobRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (!dob) {
    errors.dateOfBirth = 'Vui lòng nhập ngày sinh';
  } else if (!dobRegex.test(dob)) {
    errors.dateOfBirth = 'Định dạng ngày sinh phải là DD/MM/YYYY (ví dụ: 15/08/2003)';
  } else {
    const [, day, month, year] = dob.match(dobRegex)!;
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1950 || y > 2020) {
      errors.dateOfBirth = 'Ngày sinh không hợp lệ';
    }
  }

  // Giới tính
  if (!formData.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  // Email
  const email = formData.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'Vui lòng nhập email';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Email không đúng định dạng (ví dụ: sv@gmail.com)';
  }

  // Số điện thoại
  const phone = formData.phone.trim();
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!phone) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (gồm 10 số, ví dụ: 0987654321)';
  }

  // Lớp
  if (!formData.className.trim()) {
    errors.className = 'Vui lòng nhập lớp học';
  }

  // Khoa
  if (!formData.faculty.trim()) {
    errors.faculty = 'Vui lòng nhập khoa/viện';
  }

  // GPA
  const gpaStr = formData.gpa.trim();
  if (!gpaStr) {
    errors.gpa = 'Vui lòng nhập điểm GPA';
  } else {
    const gpaNum = parseFloat(gpaStr);
    if (isNaN(gpaNum)) {
      errors.gpa = 'GPA phải là một số hợp lệ';
    } else if (gpaNum < 0 || gpaNum > 10) {
      errors.gpa = 'Điểm GPA phải nằm trong khoảng từ 0.0 đến 10.0';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
