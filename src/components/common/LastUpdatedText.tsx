/**
 * @param {number | null} [timestamp] - Thời điểm lưu cache (ms)
 */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatDateTime } from '../../utils/date';

interface LastUpdatedTextProps {
  timestamp?: number | null;
}

export default function LastUpdatedText({ timestamp = null }: LastUpdatedTextProps) {
  if (!timestamp) {
    return null;
  }
  return <Text style={styles.text}>Cập nhật lần cuối: {formatDateTime(new Date(timestamp))}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    paddingVertical: spacing.xs,
  },
});
