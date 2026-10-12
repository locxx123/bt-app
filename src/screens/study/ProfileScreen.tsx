import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useStudy } from '../../context/StudyContext';
import { StudyNavigation, Subject } from '../../types/study';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { InfoRow } from '../../components/study/InfoRow';
import { FilterChips, FilterOption } from '../../components/study/FilterChips';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import {
  calcGpa,
  calcTotalScore,
  formatScore,
  toGrade,
} from '../../utils/studyHelpers';

const ALL = 'all';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<StudyNavigation>();
  const {
    student,
    semesters,
    currentSemesterId,
    subjects,
    results,
    getResult,
    updateContact,
  } = useStudy();

  const [semesterId, setSemesterId] = useState<string>(ALL);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  // Đồng bộ form khi thông tin sinh viên thay đổi (VD: sau khi tải từ bộ nhớ)
  useEffect(() => {
    setEmail(student.email);
    setPhone(student.phone);
  }, [student.email, student.phone]);

  const semesterOptions = useMemo<FilterOption<string>[]>(
    () => [
      { value: ALL, label: 'Tất cả' },
      ...[...semesters].reverse().map(s => ({ value: s.id, label: s.name })),
    ],
    [semesters],
  );

  const visibleSubjects = useMemo(
    () =>
      subjects.filter(s => semesterId === ALL || s.semesterId === semesterId),
    [subjects, semesterId],
  );

  const selectedSummary = useMemo(
    () => calcGpa(visibleSubjects, results),
    [visibleSubjects, results],
  );
  const overallSummary = useMemo(
    () => calcGpa(subjects, results),
    [subjects, results],
  );

  const handleSave = () => {
    const nextErrors: typeof errors = {};
    if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Email không hợp lệ';
    }
    if (!PHONE_REGEX.test(phone.trim())) {
      nextErrors.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    updateContact({ email: email.trim(), phone: phone.trim() });
    setEditing(false);
    Alert.alert('Thành công', 'Đã cập nhật thông tin liên hệ.');
  };

  const handleCancel = () => {
    setEmail(student.email);
    setPhone(student.phone);
    setErrors({});
    setEditing(false);
  };

  const semesterName = (id: string) => semesters.find(s => s.id === id)?.name;

  const renderSubject = ({ item }: { item: Subject }) => {
    const total = calcTotalScore(getResult(item.id));
    const grade = total !== null ? toGrade(total) : null;
    return (
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('ResultDetail', { subjectId: item.id })
        }
      >
        <View style={styles.resultBody}>
          <Text style={styles.resultName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.resultMeta}>
            {item.code} • {item.credits} tín chỉ •{' '}
            {semesterName(item.semesterId)}
          </Text>
        </View>
        <View style={styles.scoreBox}>
          <Text
            style={[
              styles.score,
              grade?.letter === 'F' && { color: COLORS.danger },
            ]}
          >
            {formatScore(total)}
          </Text>
          <Text style={styles.grade}>
            {grade
              ? grade.letter
              : item.semesterId === currentSemesterId
              ? 'Đang học'
              : '--'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  const header = (
    <View>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student.fullName.split(' ').pop()?.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{student.fullName}</Text>
        <Text style={styles.code}>{student.studentCode}</Text>
      </View>

      <SectionCard title="Thông tin sinh viên">
        <InfoRow
          icon="card-outline"
          label="Mã sinh viên"
          value={student.studentCode}
        />
        <InfoRow
          icon="person-outline"
          label="Họ tên"
          value={student.fullName}
        />
        <InfoRow icon="people-outline" label="Lớp" value={student.className} />
        <InfoRow
          icon="briefcase-outline"
          label="Ngành học"
          value={student.major}
        />
        <InfoRow
          icon="calendar-outline"
          label="Khóa học"
          value={student.cohort}
        />
      </SectionCard>

      <SectionCard
        title="Thông tin liên hệ"
        actionLabel={editing ? undefined : 'Chỉnh sửa'}
        onActionPress={() => setEditing(true)}
      >
        {editing ? (
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="example@stu.edu.vn"
              placeholderTextColor={COLORS.textMuted}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="0xxxxxxxxx"
              placeholderTextColor={COLORS.textMuted}
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
            <View style={styles.formActions}>
              <CustomButton
                title="Hủy"
                variant="outline"
                onPress={handleCancel}
                style={styles.formButton}
              />
              <CustomButton
                title="Lưu"
                onPress={handleSave}
                style={styles.formButton}
              />
            </View>
          </View>
        ) : (
          <>
            <InfoRow icon="mail-outline" label="Email" value={student.email} />
            <InfoRow
              icon="call-outline"
              label="Điện thoại"
              value={student.phone}
            />
          </>
        )}
      </SectionCard>

      <SectionCard title="Kết quả học tập">
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {formatScore(selectedSummary.gpa10)}
            </Text>
            <Text style={styles.summaryLabel}>
              {semesterId === ALL ? 'Điểm TB tích lũy' : 'Điểm TB học kỳ'}
            </Text>
            <Text style={styles.summaryHint}>
              Hệ 4: {selectedSummary.gpa4?.toFixed(2) ?? '--'}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {overallSummary.passedCredits}
            </Text>
            <Text style={styles.summaryLabel}>Tín chỉ tích lũy</Text>
            <Text style={styles.summaryHint}>Toàn khóa học</Text>
          </View>
        </View>
        <FilterChips
          options={semesterOptions}
          selected={semesterId}
          onSelect={setSemesterId}
        />
      </SectionCard>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visibleSubjects}
      keyExtractor={item => item.id}
      renderItem={renderSubject}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <EmptyState
          icon="📊"
          title="Chưa có kết quả"
          description="Học kỳ này chưa có môn học nào."
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: SPACING.sm,
  },
  code: {
    fontSize: 13,
    color: '#DBEAFE',
    marginTop: 2,
  },
  form: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    height: 44,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
  },
  formActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  formButton: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.border,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryHint: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  resultBody: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  resultMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scoreBox: {
    alignItems: 'center',
    minWidth: 56,
    marginHorizontal: SPACING.sm,
  },
  score: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  grade: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
