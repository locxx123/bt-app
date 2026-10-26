/**
 * @param {string} message - Bắt buộc
 * @param {() => void} onRetry - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppButton from './AppButton';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Thử lại" variant="outline" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  message: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
});
