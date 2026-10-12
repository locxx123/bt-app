import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterChipsProps<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map(option => {
        const active = option.value === selected;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
              {option.count !== undefined ? ` (${option.count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
