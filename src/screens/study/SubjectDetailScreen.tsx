import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStudy } from '../../context/StudyContext';
import { StudyStackParamList } from '../../types/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { InfoRow } from '../../components/study/InfoRow';
import { SessionItem } from '../../components/study/SessionItem';
import { AssignmentItem } from '../../components/study/AssignmentItem';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import {
  DAY_LABELS,
  calcTotalScore,
  formatScore,
  getSessionStatus,
  sortSessionsByTime,
  toGrade,
} from '../../utils/studyHelpers';

type Props = NativeStackScreenProps<StudyStackParamList, 'SubjectDetail'>;

export const SubjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId } = route.params;
  const { now, sessions, assignments, semesters, getSubject, getResult } =
    useStudy();
  const subject = getSubject(subjectId);

  useEffect(() => {
    if (subject) {
      navigation.setOptions({ title: subject.code });
    }
  }, [navigation, subject]);

  const subjectSessions = useMemo(
    () => sortSessionsByTime(sessions.filter(s => s.subjectId === subjectId)),
    [sessions, subjectId],
  );
  const subjectAssignments = useMemo(
    () =>
      assignments
        .filter(a => a.subjectId === subjectId)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [assignments, subjectId],
  );

  if (!subject) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="❓"
          title="Không tìm thấy môn học"
          description="Môn học này không tồn tại hoặc đã bị xóa."
          buttonTitle="Quay lại"
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const result = getResult(subject.id);
  const total = calcTotalScore(result);
  const semesterName = semesters.find(s => s.id === subject.semesterId)?.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.code}>{subject.code}</Text>
        <Text style={styles.name}>{subject.name}</Text>
        <Text style={styles.description}>{subject.description}</Text>
      </View>

      <SectionCard title="Thông tin môn học">
        <InfoRow
          icon="barcode-outline"
          label="Mã môn học"
          value={subject.code}
        />
        <InfoRow
          icon="layers-outline"
          label="Số tín chỉ"
          value={String(subject.credits)}
        />
        <InfoRow
          icon="person-outline"
          label="Giảng viên"
          value={subject.lecturer}
        />
        <InfoRow
          icon="calendar-outline"
          label="Học kỳ"
          value={semesterName ?? '--'}
        />
      </SectionCard>

      <SectionCard title={`Lịch học (${subjectSessions.length} buổi/tuần)`}>
        {subjectSessions.length === 0 ? (
          <Text style={styles.emptyText}>
            Môn học không có lịch học trong học kỳ hiện tại.
          </Text>
        ) : (
          subjectSessions.map(session => (
            <View key={session.id}>
              <Text style={styles.dayLabel}>
                {DAY_LABELS[session.dayOfWeek]}
              </Text>
              <SessionItem
                session={session}
                subject={subject}
                status={getSessionStatus(session, now)}
                onPress={() =>
                  navigation.push('SessionDetail', { sessionId: session.id })
                }
              />
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard title={`Bài tập (${subjectAssignments.length})`}>
        {subjectAssignments.length === 0 ? (
          <Text style={styles.emptyText}>Môn học chưa có bài tập nào.</Text>
        ) : (
          subjectAssignments.map(a => (
            <AssignmentItem
              key={a.id}
              assignment={a}
              subject={subject}
              now={now}
              onPress={() =>
                navigation.push('AssignmentDetail', { assignmentId: a.id })
              }
            />
          ))
        )}
      </SectionCard>

      <SectionCard title="Kết quả học tập">
        <InfoRow
          label="Chuyên cần (10%)"
          value={formatScore(result?.attendance)}
        />
        <InfoRow label="Giữa kỳ (30%)" value={formatScore(result?.midterm)} />
        <InfoRow label="Cuối kỳ (60%)" value={formatScore(result?.final)} />
        <InfoRow
          label="Điểm tổng kết"
          value={
            total !== null
              ? `${formatScore(total)} (${toGrade(total).letter})`
              : 'Chưa có'
          }
          valueColor={COLORS.primary}
        />
        <CustomButton
          title="Xem chi tiết kết quả"
          variant="outline"
          onPress={() =>
            navigation.push('ResultDetail', { subjectId: subject.id })
          }
          style={styles.button}
        />
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
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  code: {
    color: '#DBEAFE',
    fontSize: 13,
    fontWeight: '700',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  description: {
    color: '#E0E7FF',
    fontSize: 13,
    lineHeight: 19,
    marginTop: SPACING.sm,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    paddingVertical: SPACING.sm,
  },
  button: {
    marginTop: SPACING.md,
  },
});
