import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as sessionService from '../../api/sessionService';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import { useSync } from '../../context/SyncContext';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { KEYS } from '../../storage/keys';
import spacing from '../../theme/spacing';
import { Session } from '../../types';
import { DAY_LABELS, getDayOfWeek } from '../../utils/date';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.Schedule>;

export default function ScheduleScreen({ navigation }: Props) {
  const { isOnline } = useSync();
  const sessions = useCachedQuery(KEYS.sessions, sessionService.getAll);
  const [day, setDay] = useState(getDayOfWeek());

  const list = useMemo(
    () =>
      (sessions.data ?? [])
        .filter(s => s.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessions.data, day],
  );

  if (sessions.loading && !sessions.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!sessions.data) {
    return (
      <ScreenContainer>
        <ErrorView message={sessions.error?.message ?? 'Không tải được thời khóa biểu'} onRetry={sessions.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList<Session>
        data={list}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate(ROUTES.SessionDetail, { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={sessions.refreshing}
        onRefresh={sessions.refresh}
        ListHeaderComponent={
          <View>
            <DaySelector selectedDay={day} onSelectDay={setDay} />
            {!isOnline ? <LastUpdatedText timestamp={sessions.lastUpdated} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={`${DAY_LABELS[day]} không có buổi học`}
            description="Chọn ngày khác để xem lịch học."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, padding: spacing.lg },
});
