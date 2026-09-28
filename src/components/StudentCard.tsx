import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Student } from '../types/student';
import { RankBadge } from './RankBadge';
import { calculateRank } from '../utils/ranking';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

const AVATAR_COLORS = [
  { bg: '#EFF6FF', text: '#2563EB' },
  { bg: '#ECFDF5', text: '#059669' },
  { bg: '#FDF2F8', text: '#DB2777' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#F3E8FF', text: '#7C3AED' },
  { bg: '#E0F2FE', text: '#0284C7' },
];

export const StudentCard: React.FC<StudentCardProps> = ({ student, onPress }) => {
  const rank = student.rank || calculateRank(student.gpa);

  // Avatar initial letter
  const nameParts = student.fullName.trim().split(' ');
  const initial = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || 'S';
  const colorIndex = (student.studentCode.charCodeAt(student.studentCode.length - 1) || 0) % AVATAR_COLORS.length;
  const avatarTheme = AVATAR_COLORS[colorIndex];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, SHADOWS.card]}
    >
      <View style={styles.topRow}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarTheme.bg }]}>
          <Text style={[styles.avatarText, { color: avatarTheme.text }]}>{initial}</Text>
        </View>

        {/* Name and Student Code */}
        <View style={styles.nameContainer}>
          <Text style={styles.fullName} numberOfLines={1}>
            {student.fullName}
          </Text>
          <View style={styles.codeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{student.studentCode}</Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.className} numberOfLines={1}>
              {student.className}
            </Text>
          </View>
        </View>

        {/* Chevron arrow */}
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.divider} />

      {/* Bottom Info: GPA and Rank */}
      <View style={styles.bottomRow}>
        <View style={styles.gpaContainer}>
          <Text style={styles.gpaLabel}>GPA: </Text>
          <Text style={styles.gpaValue}>{student.gpa.toFixed(1)}</Text>
          <Text style={styles.gpaMax}>/10</Text>
        </View>

        <RankBadge rank={rank} size="small" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  className: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    flexShrink: 1,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: '300',
    paddingLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm + 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gpaLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  gpaValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  gpaMax: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
