/**
 * @param {number} gpa - Bắt buộc, hệ 4
 * @param {number} totalCredits - Bắt buộc, số tín chỉ tích lũy
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface GpaSummaryProps {
  gpa: number;
  totalCredits: number;
}

export default function GpaSummary({ gpa, totalCredits }: GpaSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.value}>{gpa.toFixed(2)}</Text>
        <Text style={styles.label}>GPA (hệ 4)</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.value}>{totalCredits}</Text>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radius,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cell: { flex: 1, alignItems: 'center' },
  value: { ...typography.h1, color: colors.primary },
  label: { ...typography.caption, color: colors.textMuted },
});
