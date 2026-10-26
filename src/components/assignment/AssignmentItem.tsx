/**
 * @param {import('../../types').Assignment} assignment - Bắt buộc
 * @param {boolean} [pending] - Có thay đổi chưa đồng bộ
 * @param {() => void} onPress - Bắt buộc
 * @param {() => void} onToggleStatus - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Assignment } from '../../types';
import { formatDateTime, isOverdue } from '../../utils/date';
import SyncBadge from '../common/SyncBadge';
import StatusToggle from './StatusToggle';

interface AssignmentItemProps {
  assignment: Assignment;
  pending?: boolean;
  onPress: () => void;
  onToggleStatus: () => void;
}

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: AssignmentItemProps) {
  const overdue = assignment.status !== 'done' && isOverdue(assignment.dueDate);
  return (
    <View style={[styles.card, overdue && styles.cardOverdue]}>
      <TouchableOpacity
        style={styles.body}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Bài tập ${assignment.title}`}>
        <Text style={[styles.title, assignment.status === 'done' && styles.done]}>
          {assignment.title}
        </Text>
        <Text style={styles.course}>{assignment.course?.name ?? 'Môn học'}</Text>
        <Text style={[styles.due, overdue && styles.dueOverdue]}>
          {overdue ? 'Quá hạn: ' : 'Hạn nộp: '}
          {formatDateTime(assignment.dueDate)}
        </Text>
        <SyncBadge pending={pending} />
      </TouchableOpacity>
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
    </View>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardOverdue: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  body: { flex: 1, minHeight: spacing.minTouch, padding: spacing.md },
  title: { ...typography.h3, color: colors.text },
  done: { textDecorationLine: 'line-through', color: colors.textMuted },
  course: { ...typography.caption, color: colors.textMuted, marginVertical: spacing.xs },
  due: { ...typography.caption, color: colors.text, marginBottom: spacing.xs },
  dueOverdue: { color: colors.danger, fontWeight: '600' },
});
