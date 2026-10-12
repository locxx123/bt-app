import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Assignment, Subject } from '../../types/study';
import { ASSIGNMENT_STATUS_META } from '../../constants/study';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import {
  formatDateTime,
  formatDueText,
  getAssignmentDisplayStatus,
  isDueSoon,
} from '../../utils/studyHelpers';
import { Badge } from './Badge';

interface AssignmentItemProps {
  assignment: Assignment;
  subject?: Subject;
  now: Date;
  onPress: () => void;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  subject,
  now,
  onPress,
}) => {
  const status = getAssignmentDisplayStatus(assignment, now);
  const meta = ASSIGNMENT_STATUS_META[status];
  const overdue = status === 'overdue';
  const dueSoon = isDueSoon(assignment, now);
  const highlightColor = overdue
    ? COLORS.danger
    : dueSoon
    ? COLORS.warning
    : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        highlightColor ? { borderLeftColor: highlightColor } : null,
        overdue && styles.overdueCard,
        dueSoon && styles.dueSoonCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <Text
          style={[styles.title, status === 'done' && styles.doneTitle]}
          numberOfLines={2}
        >
          {assignment.title}
        </Text>
        <Badge label={meta.label} color={meta.color} bg={meta.bg} />
      </View>
      <Text style={styles.subject} numberOfLines={1}>
        {subject ? `${subject.code} • ${subject.name}` : 'Môn học'}
      </Text>
      <View style={styles.dueRow}>
        <Ionicons
          name="time-outline"
          size={14}
          color={highlightColor ?? COLORS.textMuted}
        />
        <Text style={styles.due}>{formatDateTime(assignment.dueDate)}</Text>
        {status !== 'done' ? (
          <Text
            style={[
              styles.dueHint,
              highlightColor ? { color: highlightColor } : null,
            ]}
          >
            {formatDueText(assignment, now)}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    ...SHADOWS.card,
  },
  overdueCard: {
    backgroundColor: COLORS.dangerLight,
  },
  dueSoonCard: {
    backgroundColor: COLORS.warningLight,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  doneTitle: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  subject: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  due: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  dueHint: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});
