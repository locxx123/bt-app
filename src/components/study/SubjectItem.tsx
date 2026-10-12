import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Subject } from '../../types/study';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface SubjectItemProps {
  subject: Subject;
  semesterName?: string;
  onPress: () => void;
  compact?: boolean;
}

export const SubjectItem: React.FC<SubjectItemProps> = ({
  subject,
  semesterName,
  onPress,
  compact = false,
}) => (
  <TouchableOpacity
    style={[styles.card, compact && styles.compact]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.codeBox}>
      <Text style={styles.credits}>{subject.credits}</Text>
      <Text style={styles.creditsLabel}>TC</Text>
    </View>
    <View style={styles.body}>
      <Text style={styles.name} numberOfLines={2}>
        {subject.name}
      </Text>
      <Text style={styles.meta}>
        {subject.code}
        {semesterName ? ` • ${semesterName}` : ''}
      </Text>
      {!compact ? (
        <View style={styles.lecturerRow}>
          <Ionicons name="person-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.meta}>{subject.lecturer}</Text>
        </View>
      ) : null}
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  compact: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  codeBox: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  credits: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  creditsLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
