/**
 * @param {{ value: string, label: string }[]} options - Bắt buộc
 * @param {string} selected - Bắt buộc
 * @param {(value: string) => void} onSelect - Bắt buộc
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {options.map(option => {
        const active = option.value === selected;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Lọc ${option.label}`}>
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm, paddingRight: spacing.lg },
  chip: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: spacing.minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { ...typography.label, color: colors.textMuted },
  textActive: { color: colors.white },
});
