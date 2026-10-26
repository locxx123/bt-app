/**
 * @param {'todo' | 'done'} status - Bắt buộc
 * @param {() => void} onToggle - Bắt buộc
 */
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { AssignmentStatus } from '../../types';

interface StatusToggleProps {
  status: AssignmentStatus;
  onToggle: () => void;
}

export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const done = status === 'done';
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={28}
        color={done ? colors.success : colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: spacing.minTouch,
    minHeight: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
