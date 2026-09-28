import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RankType } from '../types/student';
import { getRankBadgeStyle } from '../utils/ranking';
import { RADIUS, SPACING } from '../constants/theme';

interface RankBadgeProps {
  rank: RankType;
  size?: 'small' | 'medium' | 'large';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'medium' }) => {
  const badgeStyle = getRankBadgeStyle(rank);

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeStyle.bg,
          borderColor: badgeStyle.border,
          paddingVertical: isSmall ? 2 : isLarge ? 6 : 4,
          paddingHorizontal: isSmall ? 8 : isLarge ? 14 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: badgeStyle.text }]} />
      <Text
        style={[
          styles.text,
          {
            color: badgeStyle.text,
            fontSize: isSmall ? 11 : isLarge ? 14 : 12,
          },
        ]}
      >
        {rank}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs + 1,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
