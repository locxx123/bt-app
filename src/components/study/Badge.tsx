import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color: string;
  bg: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bg }) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={[styles.text, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
