/**
 * @param {import('../../types').Grade} grade - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Grade } from '../../types';

interface GradeRowProps {
  grade: Grade;
  onPress: () => void;
}

function GradeRow({ grade, onPress }: GradeRowProps) {
  const name = grade.course?.name ?? 'Môn học';
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Kết quả môn ${name}`}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.credits}>{grade.course?.credits ?? '-'} tín chỉ</Text>
      </View>
      <Text style={styles.total}>{grade.total.toFixed(2)}</Text>
      <Text style={styles.letter}>{grade.letter}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.minTouch,
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  info: { flex: 1 },
  name: { ...typography.h3, color: colors.text },
  credits: { ...typography.caption, color: colors.textMuted },
  total: { ...typography.h3, color: colors.text, marginHorizontal: spacing.md },
  letter: { ...typography.h2, color: colors.primary, minWidth: 32, textAlign: 'center' },
});
