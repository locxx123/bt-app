/**
 * @param {string} title - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 * @param {'primary' | 'outline'} [variant]
 * @param {boolean} [loading]
 * @param {boolean} [disabled]
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const outline = variant === 'outline';
  const inactive = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, outline ? styles.outline : styles.primary, inactive && styles.inactive]}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}>
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.text, outline ? styles.textOutline : styles.textPrimary]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.minTouch,
    minWidth: spacing.minTouch,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primary },
  inactive: { opacity: 0.6 },
  text: { ...typography.h3 },
  textPrimary: { color: colors.white },
  textOutline: { color: colors.primary },
});
