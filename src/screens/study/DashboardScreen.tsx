import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStudy } from '../../context/StudyContext';
import { StudyNavigation } from '../../types/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { StatCard } from '../../components/study/StatCard';
import { SubjectItem } from '../../components/study/SubjectItem';
import { SessionItem } from '../../components/study/SessionItem';
import { AssignmentItem } from '../../components/study/AssignmentItem';
import { EmptyState } from '../../components/EmptyState';
import {
  DAY_LABELS,
  calcGpa,
  formatDate,
  getDayOfWeek,
  getSessionStatus,
  sortSessionsByTime,
} from '../../utils/studyHelpers';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<StudyNavigation>();
  const {
    isLoading,
    now,
    student,
    semesters,
    currentSemesterId,
    subjects,
    sessions,
    assignments,
    results,
    getSubject,
  } = useStudy();

  const currentSubjects = useMemo(
    () => subjects.filter(s => s.semesterId === currentSemesterId),
    [subjects, currentSemesterId],
  );

  const today = getDayOfWeek(now);
  const todaySessions = useMemo(
    () => sortSessionsByTime(sessions.filter(s => s.dayOfWeek === today)),
    [sessions, today],
  );

  const upcomingAssignments = useMemo(
    () =>
      assignments
        .filter(
          a =>
            a.status !== 'done' &&
            new Date(a.dueDate).getTime() >= now.getTime(),
        )
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )
        .slice(0, 4),
    [assignments, now],
  );

  const unfinishedCount = assignments.filter(a => a.status !== 'done').length;

  // Điểm TB của học kỳ gần nhất đã có điểm tổng kết
  const latestGpa = useMemo(() => {
    for (let i = semesters.length - 1; i >= 0; i--) {
      const semester = semesters[i];
      const summary = calcGpa(
        subjects.filter(s => s.semesterId === semester.id),
        results,
      );
      if (summary.gpa10 !== null) {
        return { semester, summary };
      }
    }
    return null;
  }, [semesters, subjects, results]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>Xin chào,</Text>
        <Text style={styles.name}>{student.fullName}</Text>
        <Text style={styles.heroMeta}>
          MSV: {student.studentCode} • Lớp: {student.className}
        </Text>
        <Text style={styles.heroDate}>
          {DAY_LABELS[today]}, {formatDate(now)}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="school-outline"
          label="Điểm TB học kỳ"
          value={latestGpa ? latestGpa.summary.gpa10!.toFixed(2) : '--'}
          hint={
            latestGpa
              ? `${
                  latestGpa.semester.name
                } • Hệ 4: ${latestGpa.summary.gpa4!.toFixed(2)}`
              : 'Chưa có điểm'
          }
        />
        <StatCard
          icon="document-text-outline"
          label="Bài tập chưa xong"
          value={String(unfinishedCount)}
          hint={`Trên tổng ${assignments.length} bài tập`}
          color={unfinishedCount > 0 ? COLORS.warning : COLORS.success}
        />
      </View>

      <SectionCard
        title="Lịch học hôm nay"
        actionLabel="Thời khóa biểu"
        onActionPress={() =>
          navigation.navigate('MainTabs', { screen: 'Timetable' })
        }
      >
        {todaySessions.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="Hôm nay không có lịch học"
            description="Hãy tranh thủ ôn bài hoặc hoàn thành bài tập nhé."
          />
        ) : (
          todaySessions.map(session => (
            <SessionItem
              key={session.id}
              session={session}
              subject={getSubject(session.subjectId)}
              status={getSessionStatus(session, now)}
              onPress={() =>
                navigation.navigate('SessionDetail', { sessionId: session.id })
              }
            />
          ))
        )}
      </SectionCard>

      <SectionCard
        title="Bài tập sắp đến hạn"
        actionLabel="Xem tất cả"
        onActionPress={() =>
          navigation.navigate('MainTabs', { screen: 'Assignments' })
        }
      >
        {upcomingAssignments.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Không có bài tập sắp đến hạn"
            description="Bạn đã hoàn thành hoặc chưa có bài tập mới."
          />
        ) : (
          upcomingAssignments.map(a => (
            <AssignmentItem
              key={a.id}
              assignment={a}
              subject={getSubject(a.subjectId)}
              now={now}
              onPress={() =>
                navigation.navigate('AssignmentDetail', { assignmentId: a.id })
              }
            />
          ))
        )}
      </SectionCard>

      <SectionCard
        title={`Môn học kỳ này (${currentSubjects.length})`}
        actionLabel="Xem tất cả"
        onActionPress={() =>
          navigation.navigate('MainTabs', { screen: 'Subjects' })
        }
      >
        {currentSubjects.length === 0 ? (
          <EmptyState
            icon="📚"
            title="Chưa đăng ký môn học"
            description="Học kỳ này bạn chưa có môn học nào."
          />
        ) : (
          currentSubjects.map(subject => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              compact
              onPress={() =>
                navigation.navigate('SubjectDetail', { subjectId: subject.id })
              }
            />
          ))
        )}
      </SectionCard>
    </ScrollView>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  greeting: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  heroMeta: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: SPACING.sm,
  },
  heroDate: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
});
