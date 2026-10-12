import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ClassSession, SessionStatus, Subject } from '../../types/study';
import { SESSION_STATUS_META } from '../../constants/study';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { Badge } from './Badge';

interface SessionItemProps {
  session: ClassSession;
  subject?: Subject;
  status: SessionStatus;
  onPress: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  subject,
  status,
  onPress,
}) => {
  const meta = SESSION_STATUS_META[status];
  const ended = status === 'ended';
  return (
    <TouchableOpacity
      style={[styles.card, ended && styles.ended]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.timeCol, { borderRightColor: meta.color }]}>
        <Text style={[styles.time, ended && styles.mutedText]}>
          {session.startTime}
        </Text>
        <Text style={styles.timeEnd}>{session.endTime}</Text>
      </View>
      <View style={styles.body}>
        <Text
          style={[styles.name, ended && styles.mutedText]}
          numberOfLines={2}
        >
          {subject?.name ?? 'Môn học'}
        </Text>
        <View style={styles.row}>
          <Ionicons
            name="location-outline"
            size={13}
            color={COLORS.textMuted}
          />
          <Text style={styles.meta}>
            {session.room} • {session.type}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="person-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.meta}>{session.lecturer}</Text>
        </View>
        <Badge label={meta.label} color={meta.color} bg={meta.bg} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  ended: {
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },
  timeCol: {
    width: 60,
    borderRightWidth: 3,
    marginRight: SPACING.md,
    justifyContent: 'center',
  },
  time: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  timeEnd: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  mutedText: {
    color: COLORS.textMuted,
  },
});
