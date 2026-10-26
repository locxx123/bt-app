/**
 * @param {boolean} pending - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface SyncBadgeProps {
  pending: boolean;
}

export default function SyncBadge({ pending }: SyncBadgeProps) {
  if (!pending) {
    return null;
  }
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: { ...typography.caption, color: colors.warning, fontWeight: '600' },
});
