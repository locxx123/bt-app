import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface SectionCardProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  actionLabel,
  onActionPress,
  style,
  children,
}) => (
  <View style={[styles.card, style]}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onActionPress ? (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
