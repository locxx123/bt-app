import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface StatCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  hint?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  hint,
  color = COLORS.primary,
}) => (
  <View style={styles.card}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
    {hint ? <Text style={styles.hint}>{hint}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
