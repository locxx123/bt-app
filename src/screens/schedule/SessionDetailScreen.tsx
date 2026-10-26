import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as sessionService from '../../api/sessionService';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import { useSync } from '../../context/SyncContext';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { KEYS } from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { DAY_LABELS } from '../../utils/date';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.SessionDetail>;

export default function SessionDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { isOnline } = useSync();
  const session = useCachedQuery(KEYS.session(id), () => sessionService.getById(id));

  useEffect(() => {
    if (session.data) {
      navigation.setOptions({ title: session.data.course?.name ?? 'Buổi học' });
    }
  }, [session.data, navigation]);

  if (session.loading && !session.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!session.data) {
    return (
      <ScreenContainer>
        <ErrorView message={session.error?.message ?? 'Không tải được buổi học'} onRetry={session.refresh} />
      </ScreenContainer>
    );
  }

  const s = session.data;
  return (
    <ScreenContainer scroll>
      {!isOnline ? <LastUpdatedText timestamp={session.lastUpdated} /> : null}
      <InfoRow label="Môn học" value={s.course?.name ?? '-'} />
      <InfoRow label="Giảng viên" value={s.course?.lecturer ?? '-'} />
      <InfoRow label="Thứ" value={DAY_LABELS[s.dayOfWeek]} />
      <InfoRow label="Thời gian" value={`${s.startTime} - ${s.endTime}`} />
      <InfoRow label="Phòng học" value={s.room} />
      <Text style={styles.note}>{s.note ? `Ghi chú: ${s.note}` : 'Không có ghi chú'}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: { ...typography.body, color: colors.text, marginTop: spacing.lg },
});
