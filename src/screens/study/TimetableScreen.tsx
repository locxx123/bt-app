import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStudy } from '../../context/StudyContext';
import { DayOfWeek, StudyNavigation } from '../../types/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SESSION_STATUS_META } from '../../constants/study';
import { SessionItem } from '../../components/study/SessionItem';
import { EmptyState } from '../../components/EmptyState';
import {
  DAY_LABELS,
  DAY_SHORT_LABELS,
  WEEK_DAYS,
  formatDate,
  getDateOfWeekDay,
  getDayOfWeek,
  getSessionStatus,
  sortSessionsByTime,
} from '../../utils/studyHelpers';

export const TimetableScreen: React.FC = () => {
  const navigation = useNavigation<StudyNavigation>();
  const { sessions, now, getSubject } = useStudy();
  const today = getDayOfWeek(now);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today);

  const daySessions = useMemo(
    () => sortSessionsByTime(sessions.filter(s => s.dayOfWeek === selectedDay)),
    [sessions, selectedDay],
  );

  const countByDay = (day: DayOfWeek) =>
    sessions.filter(s => s.dayOfWeek === day).length;

  return (
    <View style={styles.container}>
      <View style={styles.dayBar}>
        {WEEK_DAYS.map(day => {
          const active = day === selectedDay;
          const date = getDateOfWeekDay(day, now);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayItem, active && styles.dayItemActive]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayLabel, active && styles.textActive]}>
                {DAY_SHORT_LABELS[day]}
              </Text>
              <Text style={[styles.dayDate, active && styles.textActive]}>
                {date.getDate()}
              </Text>
              <View
                style={[
                  styles.dot,
                  countByDay(day) === 0 && styles.dotHidden,
                  active && styles.dotActive,
                  day === today && !active && styles.dotToday,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {DAY_LABELS[selectedDay]},{' '}
          {formatDate(getDateOfWeekDay(selectedDay, now))}
          {selectedDay === today ? ' (Hôm nay)' : ''}
        </Text>
        <Text style={styles.headerCount}>{daySessions.length} buổi</Text>
      </View>

      <View style={styles.legend}>
        {(['ended', 'ongoing', 'upcoming'] as const).map(status => (
          <View key={status} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: SESSION_STATUS_META[status].color },
              ]}
            />
            <Text style={styles.legendText}>
              {SESSION_STATUS_META[status].label}
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        data={daySessions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SessionItem
            session={item}
            subject={getSubject(item.subjectId)}
            status={getSessionStatus(item, now)}
            onPress={() =>
              navigation.navigate('SessionDetail', { sessionId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🗓️"
            title="Không có lịch học"
            description={`${DAY_LABELS[selectedDay]} bạn không có buổi học nào.`}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  dayBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: 2,
    borderRadius: RADIUS.md,
  },
  dayItemActive: {
    backgroundColor: COLORS.primary,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  textActive: {
    color: '#FFFFFF',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
    backgroundColor: COLORS.textMuted,
  },
  dotHidden: {
    opacity: 0,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  dotToday: {
    backgroundColor: COLORS.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerCount: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  legend: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  list: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
});
