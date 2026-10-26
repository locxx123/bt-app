/**
 * @param {import('../../types').Course} course - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Môn ${course.name}`}>
      <View style={styles.row}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.credits}>{course.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.lecturer}>{course.lecturer}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(CourseCard);

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.minTouch,
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  code: { ...typography.label, color: colors.primary },
  credits: { ...typography.caption, color: colors.textMuted },
  name: { ...typography.h3, color: colors.text, marginVertical: spacing.xs },
  lecturer: { ...typography.caption, color: colors.textMuted },
});
