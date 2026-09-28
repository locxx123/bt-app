import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, GenderType } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { Header } from '../components/Header';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { validateStudentForm, ValidationError } from '../utils/validation';
import { calculateRank } from '../utils/ranking';
import { RankBadge } from '../components/RankBadge';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentAdd'>;

const GENDERS: GenderType[] = ['Nam', 'Nữ', 'Khác'];

export const StudentAddScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { students, addStudent } = useStudents();

  // Form states
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<GenderType>('Nam');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [faculty, setFaculty] = useState('Công nghệ thông tin');
  const [gpa, setGpa] = useState('');

  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tính xếp loại trực quan theo thời gian thực khi người dùng gõ GPA
  const parsedGpa = parseFloat(gpa);
  const liveRank = !isNaN(parsedGpa) && parsedGpa >= 0 && parsedGpa <= 10 ? calculateRank(parsedGpa) : null;

  const handleSubmit = () => {
    const existingCodes = students.map(s => s.studentCode);
    const { isValid, errors: validationErrors } = validateStudentForm(
      {
        studentCode,
        fullName,
        dateOfBirth,
        gender,
        email,
        phone,
        className,
        faculty,
        gpa,
      },
      existingCodes
    );

    if (!isValid) {
      setErrors(validationErrors);
      Alert.alert(
        'Thông tin chưa hợp lệ',
        'Vui lòng kiểm tra lại các trường thông tin có viền đỏ trước khi lưu.'
      );
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      addStudent({
        studentCode: studentCode.trim().toUpperCase(),
        fullName: fullName.trim(),
        dateOfBirth: dateOfBirth.trim(),
        gender,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        className: className.trim().toUpperCase(),
        faculty: faculty.trim(),
        gpa: parseFloat(gpa),
      });

      Alert.alert('Thành công', 'Đã thêm sinh viên mới thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('StudentList'),
        },
      ]);
    } catch {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm sinh viên, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header
        title="Thêm sinh viên mới"
        subtitle="Nhập đầy đủ thông tin hồ sơ"
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card: Thông tin cơ bản */}
          <View style={[styles.card, SHADOWS.card]}>
            <Text style={styles.cardTitle}>📌 Thông tin cơ bản</Text>

            <CustomInput
              label="Mã sinh viên"
              required
              placeholder="Ví dụ: B21DCCN001"
              value={studentCode}
              onChangeText={val => {
                setStudentCode(val);
                if (errors.studentCode) setErrors(prev => ({ ...prev, studentCode: undefined }));
              }}
              autoCapitalize="characters"
              error={errors.studentCode}
            />

            <CustomInput
              label="Họ và tên"
              required
              placeholder="Ví dụ: Nguyễn Văn An"
              value={fullName}
              onChangeText={val => {
                setFullName(val);
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
              }}
              autoCapitalize="words"
              error={errors.fullName}
            />

            {/* Giới tính */}
            <View style={styles.genderContainer}>
              <View style={styles.genderLabelRow}>
                <Text style={styles.genderLabel}>Giới tính</Text>
                <Text style={styles.requiredStar}> *</Text>
              </View>
              <View style={styles.genderButtonGroup}>
                {GENDERS.map(g => {
                  const isSelected = gender === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      activeOpacity={0.7}
                      onPress={() => setGender(g)}
                      style={[
                        styles.genderButton,
                        isSelected && styles.genderButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderButtonText,
                          isSelected && styles.genderButtonTextActive,
                        ]}
                      >
                        {g === 'Nam' ? '👨 ' : g === 'Nữ' ? '👩 ' : '👤 '}
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
            </View>

            <CustomInput
              label="Ngày sinh (DD/MM/YYYY)"
              required
              placeholder="Ví dụ: 15/03/2003"
              value={dateOfBirth}
              onChangeText={val => {
                setDateOfBirth(val);
                if (errors.dateOfBirth) setErrors(prev => ({ ...prev, dateOfBirth: undefined }));
              }}
              keyboardType="numbers-and-punctuation"
              error={errors.dateOfBirth}
            />
          </View>

          {/* Card: Thông tin đào tạo & GPA */}
          <View style={[styles.card, SHADOWS.card]}>
            <Text style={styles.cardTitle}>🎓 Đào tạo & Học lực</Text>

            <CustomInput
              label="Lớp"
              required
              placeholder="Ví dụ: D21CNPM01"
              value={className}
              onChangeText={val => {
                setClassName(val);
                if (errors.className) setErrors(prev => ({ ...prev, className: undefined }));
              }}
              autoCapitalize="characters"
              error={errors.className}
            />

            <CustomInput
              label="Khoa / Viện"
              required
              placeholder="Ví dụ: Công nghệ thông tin"
              value={faculty}
              onChangeText={val => {
                setFaculty(val);
                if (errors.faculty) setErrors(prev => ({ ...prev, faculty: undefined }));
              }}
              error={errors.faculty}
            />

            <CustomInput
              label="Điểm trung bình (GPA)"
              required
              placeholder="Nhập thang điểm 10 (Ví dụ: 8.5)"
              value={gpa}
              onChangeText={val => {
                setGpa(val);
                if (errors.gpa) setErrors(prev => ({ ...prev, gpa: undefined }));
              }}
              keyboardType="decimal-pad"
              error={errors.gpa}
            />

            {/* Xem trước xếp loại */}
            {liveRank ? (
              <View style={styles.rankPreviewRow}>
                <Text style={styles.rankPreviewText}>Dự kiến xếp loại:</Text>
                <RankBadge rank={liveRank} size="medium" />
              </View>
            ) : null}
          </View>

          {/* Card: Thông tin liên lạc */}
          <View style={[styles.card, SHADOWS.card]}>
            <Text style={styles.cardTitle}>📞 Thông tin liên lạc</Text>

            <CustomInput
              label="Email"
              required
              placeholder="Ví dụ: an.nguyen@student.edu.vn"
              value={email}
              onChangeText={val => {
                setEmail(val);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomInput
              label="Số điện thoại"
              required
              placeholder="Ví dụ: 0981234567"
              value={phone}
              onChangeText={val => {
                setPhone(val);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
              }}
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Lưu hồ sơ sinh viên"
            icon="💾"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isSubmitting}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  genderContainer: {
    marginBottom: SPACING.md,
  },
  genderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  requiredStar: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '700',
  },
  genderButtonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  genderButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  genderButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  rankPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  rankPreviewText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  submitBtn: {
    marginTop: SPACING.xs,
  },
});
