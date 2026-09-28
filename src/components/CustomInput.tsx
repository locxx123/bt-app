import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  onClear?: () => void;
  prefix?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  required,
  onClear,
  prefix,
  value,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}> *</Text>}
      </View>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {prefix ? <Text style={styles.prefixText}>{prefix}</Text> : null}

        <TextInput
          style={[styles.input, style]}
          value={value}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {value && onClear ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xs + 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  requiredStar: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  prefixText: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginRight: SPACING.xs,
    fontWeight: '500',
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  clearButtonText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
});
