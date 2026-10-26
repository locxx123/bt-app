/**
 * @param {number} selectedDay - Bắt buộc, 2 (Thứ 2) đến 8 (Chủ nhật)
 * @param {(day: number) => void} onSelectDay - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { getDayOfWeek } from '../../utils/date';

interface DaySelectorProps {
  selectedDay?: number;
  onSelectDay: (day: number) => void;
}

const DAYS = [
  { day: 2, label: 'T2' },
  { day: 3, label: 'T3' },
  { day: 4, label: 'T4' },
  { day: 5, label: 'T5' },
  { day: 6, label: 'T6' },
  { day: 7, label: 'T7' },
  { day: 8, label: 'CN' },
];

export default function DaySelector({
  selectedDay = getDayOfWeek(),
  onSelectDay,
}: DaySelectorProps) {
  return (
    <View style={styles.container}>
      {DAYS.map(({ day, label }) => {
        const active = day === selectedDay;
        return (
          <TouchableOpacity
            key={day}
            style={[styles.day, active && styles.dayActive]}
            onPress={() => onSelectDay(day)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Chọn ${label}`}>
            <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  day: {
    minWidth: spacing.minTouch,
    minHeight: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { ...typography.label, color: colors.textMuted },
  textActive: { color: colors.white },
});
