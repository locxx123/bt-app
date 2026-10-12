import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useStudy } from '../../context/StudyContext';
import { StudyStackParamList } from '../../types/study';
import {
  ASSIGNMENT_STATUS_META,
  EDITABLE_STATUSES,
} from '../../constants/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { InfoRow } from '../../components/study/InfoRow';
import { Badge } from '../../components/study/Badge';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import {
  formatDateTime,
  formatDueText,
  getAssignmentDisplayStatus,
  isDueSoon,
} from '../../utils/studyHelpers';

type Props = NativeStackScreenProps<StudyStackParamList, 'AssignmentDetail'>;

export const AssignmentDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { now, assignments, getSubject, updateAssignmentStatus } = useStudy();
  const assignment = assignments.find(a => a.id === route.params.assignmentId);

  if (!assignment) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="❓"
          title="Không tìm thấy bài tập"
          description="Bài tập này không tồn tại."
          buttonTitle="Quay lại"
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const subject = getSubject(assignment.subjectId);
  const displayStatus = getAssignmentDisplayStatus(assignment, now);
  const meta = ASSIGNMENT_STATUS_META[displayStatus];
  const overdue = displayStatus === 'overdue';
  const dueSoon = isDueSoon(assignment, now);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Badge label={meta.label} color={meta.color} bg={meta.bg} />
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.subject}>
          {subject ? `${subject.code} • ${subject.name}` : 'Môn học'}
        </Text>
      </View>

      {overdue || dueSoon ? (
        <View
          style={[
            styles.alert,
            overdue ? styles.alertDanger : styles.alertWarning,
          ]}
        >
          <Ionicons
            name={overdue ? 'alert-circle' : 'time'}
            size={18}
            color={overdue ? COLORS.danger : '#B45309'}
          />
          <Text
            style={[
              styles.alertText,
              overdue ? styles.alertTextDanger : styles.alertTextWarning,
            ]}
          >
            {overdue
              ? `Bài tập đã quá hạn nộp (${formatDueText(assignment, now)})`
              : `Sắp đến hạn nộp: ${formatDueText(assignment, now)}`}
          </Text>
        </View>
      ) : null}

      <SectionCard title="Thời hạn">
        <InfoRow
          icon="calendar-outline"
          label="Hạn nộp"
          value={formatDateTime(assignment.dueDate)}
          valueColor={overdue ? COLORS.danger : undefined}
        />
        <InfoRow
          icon="hourglass-outline"
          label="Thời gian còn lại"
          value={
            assignment.status === 'done'
              ? 'Đã hoàn thành'
              : formatDueText(assignment, now)
          }
        />
      </SectionCard>

      <SectionCard title="Mô tả">
        <Text style={styles.paragraph}>{assignment.description}</Text>
      </SectionCard>

      <SectionCard title="Yêu cầu">
        {assignment.requirements.length === 0 ? (
          <Text style={styles.paragraph}>Không có yêu cầu bổ sung.</Text>
        ) : (
          assignment.requirements.map((req, index) => (
            <View key={index} style={styles.reqRow}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))
        )}
      </SectionCard>

      <SectionCard title="Cập nhật trạng thái">
        <View style={styles.statusRow}>
          {EDITABLE_STATUSES.map(status => {
            const active = assignment.status === status;
            const statusMeta = ASSIGNMENT_STATUS_META[status];
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  active && {
                    backgroundColor: statusMeta.bg,
                    borderColor: statusMeta.color,
                  },
                ]}
                onPress={() => updateAssignmentStatus(assignment.id, status)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.statusText,
                    active && { color: statusMeta.color },
                  ]}
                >
                  {statusMeta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {overdue ? (
          <Text style={styles.statusHint}>
            Bài tập quá hạn sẽ hết cảnh báo khi chuyển sang "Đã hoàn thành".
          </Text>
        ) : null}
      </SectionCard>

      {subject ? (
        <CustomButton
          title="Xem môn học"
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
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  subject: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  alertDanger: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.dangerBorder,
  },
  alertWarning: {
    backgroundColor: COLORS.warningLight,
    borderColor: '#FCD34D',
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  alertTextDanger: {
    color: COLORS.danger,
  },
  alertTextWarning: {
    color: '#B45309',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: 4,
  },
  reqText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
  statusRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  statusHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});
