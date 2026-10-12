import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStudy } from '../../context/StudyContext';
import { StudyStackParamList } from '../../types/study';
import { SESSION_STATUS_META } from '../../constants/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { InfoRow } from '../../components/study/InfoRow';
import { Badge } from '../../components/study/Badge';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import {
  DAY_LABELS,
  formatDate,
  getDateOfWeekDay,
  getSessionStatus,
} from '../../utils/studyHelpers';

type Props = NativeStackScreenProps<StudyStackParamList, 'SessionDetail'>;

export const SessionDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { now, sessions, getSubject } = useStudy();
  const session = sessions.find(s => s.id === route.params.sessionId);

  if (!session) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="❓"
          title="Không tìm thấy buổi học"
          description="Buổi học này không tồn tại."
          buttonTitle="Quay lại"
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const subject = getSubject(session.subjectId);
  const status = getSessionStatus(session, now);
  const meta = SESSION_STATUS_META[status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { borderLeftColor: meta.color }]}>
        <Badge label={meta.label} color={meta.color} bg={meta.bg} />
        <Text style={styles.name}>{subject?.name ?? 'Môn học'}</Text>
        <Text style={styles.time}>
          {session.startTime} - {session.endTime}
        </Text>
        <Text style={styles.date}>
          {DAY_LABELS[session.dayOfWeek]},{' '}
          {formatDate(getDateOfWeekDay(session.dayOfWeek, now))}
        </Text>
      </View>

      <SectionCard title="Thông tin buổi học">
        <InfoRow
          icon="calendar-outline"
          label="Thứ"
          value={DAY_LABELS[session.dayOfWeek]}
        />
        <InfoRow
          icon="time-outline"
          label="Bắt đầu"
          value={session.startTime}
        />
        <InfoRow icon="time-outline" label="Kết thúc" value={session.endTime} />
        <InfoRow
          icon="location-outline"
          label="Phòng học"
          value={session.room}
        />
        <InfoRow
          icon="person-outline"
          label="Giảng viên"
          value={session.lecturer}
        />
        <InfoRow icon="book-outline" label="Hình thức" value={session.type} />
        {subject ? (
          <InfoRow icon="barcode-outline" label="Mã môn" value={subject.code} />
        ) : null}
      </SectionCard>

      {session.note ? (
        <SectionCard title="Ghi chú">
          <Text style={styles.note}>{session.note}</Text>
        </SectionCard>
      ) : null}

      {subject ? (
        <CustomButton
          title="Xem chi tiết môn học"
          variant="outline"
          onPress={() =>
            navigation.push('SubjectDetail', { subjectId: subject.id })
          }
        />
      ) : null}
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
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 5,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  time: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  date: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  note: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});
