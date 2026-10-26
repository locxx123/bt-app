import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as courseService from '../../api/courseService';
import * as sessionService from '../../api/sessionService';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { KEYS } from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { DAY_LABELS, formatDateTime } from '../../utils/date';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.CourseDetail>;

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { isOnline } = useSync();
  const { assignments } = useAppData();
  const course = useCachedQuery(KEYS.course(id), () => courseService.getById(id));
  const sessions = useCachedQuery(KEYS.sessions, sessionService.getAll);

  useEffect(() => {
    if (course.data) {
      navigation.setOptions({ title: course.data.name });
    }
  }, [course.data, navigation]);

  if (course.loading && !course.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!course.data) {
    return (
      <ScreenContainer>
        <ErrorView message={course.error?.message ?? 'Không tải được môn học'} onRetry={course.refresh} />
      </ScreenContainer>
    );
  }

  const c = course.data;
  const courseSessions = (sessions.data ?? [])
    .filter(s => s.courseId === id)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const courseAssignments = (assignments.data ?? []).filter(a => a.courseId === id);

  return (
    <ScreenContainer scroll>
      {!isOnline ? <LastUpdatedText timestamp={course.lastUpdated} /> : null}
      <InfoRow label="Mã môn" value={c.code} />
      <InfoRow label="Số tín chỉ" value={String(c.credits)} />
      <InfoRow label="Giảng viên" value={c.lecturer} />
      <InfoRow label="Học kỳ" value={c.semester} />
      <Text style={styles.description}>{c.description}</Text>

      <Text style={styles.section}>Lịch học</Text>
      {courseSessions.length === 0 ? (
        <Text style={styles.empty}>Chưa có lịch học</Text>
      ) : (
        courseSessions.map(s => (
          <TouchableOpacity
            key={s.id}
            style={styles.row}
            onPress={() => navigation.getParent()?.navigate(ROUTES.ScheduleTab, {
              screen: ROUTES.SessionDetail,
              params: { id: s.id },
            })}
            accessibilityRole="button"
            accessibilityLabel={`Buổi học ${DAY_LABELS[s.dayOfWeek]}`}>
            <Text style={styles.rowTitle}>
              {DAY_LABELS[s.dayOfWeek]} · {s.startTime} - {s.endTime}
            </Text>
            <Text style={styles.rowSub}>Phòng {s.room}</Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.section}>Bài tập</Text>
      {courseAssignments.length === 0 ? (
        <Text style={styles.empty}>Chưa có bài tập</Text>
      ) : (
        courseAssignments.map(a => (
          <TouchableOpacity
            key={a.id}
            style={styles.row}
            onPress={() => navigation.navigate(ROUTES.AssignmentDetail, { id: a.id })}
            accessibilityRole="button"
            accessibilityLabel={`Bài tập ${a.title}`}>
            <Text style={styles.rowTitle}>{a.title}</Text>
            <View>
              <Text style={styles.rowSub}>
                Hạn {formatDateTime(a.dueDate)} · {a.status === 'done' ? 'Đã xong' : 'Chưa xong'}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  description: { ...typography.body, color: colors.text, marginVertical: spacing.md },
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
