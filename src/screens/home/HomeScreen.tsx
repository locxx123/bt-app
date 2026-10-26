import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { daysLeft, formatDateTime } from '../../utils/date';
import { latestSemester } from '../../utils/semester';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.Home>;

export default function HomeScreen({ navigation }: Props) {
  const { student, courses, assignments } = useAppData();
  const { pendingCount, isOnline } = useSync();

  const refreshing = student.refreshing || courses.refreshing || assignments.refreshing;
  const refreshAll = () => {
    student.refresh();
    courses.refresh();
    assignments.refresh();
  };

  if (student.loading && !student.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!student.data) {
    return (
      <ScreenContainer>
        <ErrorView message={student.error?.message ?? 'Không tải được dữ liệu'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const courseList = courses.data ?? [];
  const current = latestSemester(courseList.map(c => c.semester));
  const currentCourses = courseList.filter(c => c.semester === current);
  const dueSoon = (assignments.data ?? []).filter(a => {
    const left = daysLeft(a.dueDate);
    return a.status !== 'done' && left >= 0 && left <= 7;
  });

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} />}>
        <View style={styles.hero}>
          <Text style={styles.name}>{student.data.fullName}</Text>
          <Text style={styles.code}>Mã sinh viên: {student.data.studentCode}</Text>
        </View>
        {!isOnline ? <LastUpdatedText timestamp={student.lastUpdated} /> : null}
        <Text style={[styles.sync, pendingCount === 0 && styles.syncOk]}>
          {pendingCount > 0
            ? `${pendingCount} thay đổi chưa đồng bộ`
            : 'Mọi thay đổi đã được đồng bộ'}
        </Text>

        <Text style={styles.section}>Môn đang học{current ? ` (${current})` : ''}</Text>
        {currentCourses.length === 0 ? (
          <Text style={styles.empty}>Chưa có môn học nào</Text>
        ) : (
          currentCourses.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.row}
              onPress={() => navigation.navigate(ROUTES.CourseDetail, { id: c.id })}
              accessibilityRole="button"
              accessibilityLabel={`Môn ${c.name}`}>
              <Text style={styles.rowTitle}>{c.name}</Text>
              <Text style={styles.rowSub}>
                {c.code} · {c.credits} tín chỉ
              </Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.section}>Bài tập đến hạn trong 7 ngày tới</Text>
        {dueSoon.length === 0 ? (
          <Text style={styles.empty}>Không có bài tập nào sắp đến hạn</Text>
        ) : (
          dueSoon.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.row}
              onPress={() => navigation.navigate(ROUTES.AssignmentDetail, { id: a.id })}
              accessibilityRole="button"
              accessibilityLabel={`Bài tập ${a.title}`}>
              <Text style={styles.rowTitle}>{a.title}</Text>
              <Text style={styles.rowSub}>
                {a.course?.name ?? 'Môn học'} · Hạn {formatDateTime(a.dueDate)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  name: { ...typography.h2, color: colors.white },
  code: { ...typography.body, color: colors.white, marginTop: spacing.xs },
  sync: { ...typography.label, color: colors.warning, marginBottom: spacing.sm },
  syncOk: { color: colors.success },
  section: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  empty: { ...typography.body, color: colors.textMuted },
  row: {
    minHeight: spacing.minTouch,
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTitle: { ...typography.h3, color: colors.text },
  rowSub: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
