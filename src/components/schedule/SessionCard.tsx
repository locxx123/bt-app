/**
 * @param {import('../../types').Session} session - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Session } from '../../types';

interface SessionCardProps {
  session: Session;
  onPress: () => void;
}

function SessionCard({ session, onPress }: SessionCardProps) {
  const name = session.course?.name ?? 'Môn học';
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Buổi học ${name}`}>
      <Text style={styles.time}>
        {session.startTime} - {session.endTime}
      </Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.room}>Phòng {session.room}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(SessionCard);

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.minTouch,
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  time: { ...typography.label, color: colors.primary },
  name: { ...typography.h3, color: colors.text, marginVertical: spacing.xs },
  room: { ...typography.caption, color: colors.textMuted },
});
