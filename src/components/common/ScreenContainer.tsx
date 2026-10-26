/**
 * @param {React.ReactNode} children - Bắt buộc
 * @param {boolean} [scroll] - Cuộn nội dung bằng ScrollView
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import OfflineBanner from './OfflineBanner';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
}

export default function ScreenContainer({ children, scroll = false }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  scroll: { padding: spacing.lg },
});
