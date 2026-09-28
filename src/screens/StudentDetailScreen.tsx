import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { Header } from '../components/Header';
import { RankBadge } from '../components/RankBadge';
import { CustomButton } from '../components/CustomButton';
import { calculateRank } from '../utils/ranking';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetail'>;

export const StudentDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { studentId } = route.params;
  const { getStudentById, deleteStudent } = useStudents();

  const student = getStudentById(studentId);

  if (!student) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Chi tiết sinh viên" showBack onBack={() => navigation.goBack()} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>Không tìm thấy thông tin sinh viên</Text>
          <Text style={styles.notFoundSubtitle}>Sinh viên này có thể đã bị xóa khỏi hệ thống.</Text>
          <CustomButton
            title="Quay lại danh sách"
            onPress={() => navigation.navigate('StudentList')}
            style={styles.backBtn}
          />
        </View>
      </View>
    );
  }

  const rank = student.rank || calculateRank(student.gpa);

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa sinh viên "${student.fullName}" (Mã: ${student.studentCode}) khỏi hệ thống không? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa sinh viên',
          style: 'destructive',
          onPress: () => {
            deleteStudent(student.id);
            Alert.alert('Thành công', 'Đã xóa sinh viên thành công!', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('StudentList'),
              },
            ]);
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('StudentEdit', { studentId: student.id });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header
        title="Thông tin chi tiết"
        subtitle={student.studentCode}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEdit}
            style={styles.headerEditBtn}
          >
            <Text style={styles.headerEditText}>✏️ Sửa</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, SHADOWS.card]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {student.fullName.trim().split(' ').slice(-1)[0]?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </View>
          <Text style={styles.profileName}>{student.fullName}</Text>
          <View style={styles.profileCodeBadge}>
            <Text style={styles.profileCodeText}>{student.studentCode}</Text>
          </View>

          {/* Academic Highlight (GPA & Xếp loại) */}
          <View style={styles.academicRow}>
            <View style={styles.academicCol}>
              <Text style={styles.academicLabel}>Điểm GPA</Text>
              <Text style={styles.academicGpa}>{student.gpa.toFixed(1)} / 10</Text>
            </View>
            <View style={styles.academicDivider} />
            <View style={styles.academicCol}>
              <Text style={styles.academicLabel}>Xếp loại học lực</Text>
              <View style={styles.badgeWrapper}>
                <RankBadge rank={rank} size="large" />
              </View>
            </View>
          </View>
        </View>

        {/* Info Section: Thông tin đào tạo */}
        <View style={[styles.sectionCard, SHADOWS.card]}>
          <Text style={styles.sectionHeader}>🎓 Thông tin đào tạo</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Khoa / Viện:</Text>
            <Text style={styles.infoValue}>{student.faculty}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lớp học phần:</Text>
            <Text style={styles.infoValue}>{student.className}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái học vụ:</Text>
            <Text style={[styles.infoValue, { color: COLORS.success, fontWeight: '700' }]}>
              Đang học tập
            </Text>
          </View>
        </View>

        {/* Info Section: Thông tin cá nhân & Liên hệ */}
        <View style={[styles.sectionCard, SHADOWS.card]}>
          <Text style={styles.sectionHeader}>👤 Thông tin cá nhân & Liên hệ</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giới tính:</Text>
            <Text style={styles.infoValue}>{student.gender}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày sinh:</Text>
            <Text style={styles.infoValue}>{student.dateOfBirth}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={[styles.infoValue, { color: COLORS.primary }]} numberOfLines={1}>
              {student.email}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số điện thoại:</Text>
            <Text style={styles.infoValue}>{student.phone}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <CustomButton
            title="Chỉnh sửa thông tin"
            icon="✏️"
            onPress={handleEdit}
            variant="primary"
            size="large"
            style={styles.editButton}
          />

          <CustomButton
            title="Xóa sinh viên"
            icon="🗑️"
            onPress={handleDelete}
            variant="danger-outline"
            size="large"
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerEditBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  headerEditText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  profileCodeBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginTop: 6,
    marginBottom: SPACING.lg,
  },
  profileCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  academicRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  academicCol: {
    flex: 1,
    alignItems: 'center',
  },
  academicDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  academicLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  academicGpa: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  badgeWrapper: {
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  actionButtonsContainer: {
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  editButton: {
    width: '100%',
  },
  deleteButton: {
    width: '100%',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  notFoundSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  backBtn: {
    minWidth: 200,
  },
});
