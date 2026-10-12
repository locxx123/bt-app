import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { COLORS, SPACING } from '../../constants/theme';

interface InfoRowProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueColor?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  valueColor,
}) => (
  <View style={styles.row}>
    <View style={styles.labelWrap}>
      {icon ? (
        <Ionicons name={icon} size={16} color={COLORS.textMuted} />
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text
      style={[styles.value, valueColor ? { color: valueColor } : null]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  value: {
    flex: 1,
    marginLeft: SPACING.md,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
