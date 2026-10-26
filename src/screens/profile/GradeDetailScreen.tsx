import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as gradeService from '../../api/gradeService';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import { useSync } from '../../context/SyncContext';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { KEYS } from '../../storage/keys';
import { toScale4 } from '../../utils/gpa';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.GradeDetail>;

export default function GradeDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { isOnline } = useSync();
  const grade = useCachedQuery(KEYS.grade(id), () => gradeService.getById(id));

  useEffect(() => {
    if (grade.data) {
      navigation.setOptions({ title: grade.data.course?.name ?? 'Chi tiết kết quả' });
    }
  }, [grade.data, navigation]);

  if (grade.loading && !grade.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!grade.data) {
    return (
      <ScreenContainer>
        <ErrorView message={grade.error?.message ?? 'Không tải được kết quả học tập'} onRetry={grade.refresh} />
      </ScreenContainer>
    );
  }

  const g = grade.data;
  return (
    <ScreenContainer scroll>
      {!isOnline ? <LastUpdatedText timestamp={grade.lastUpdated} /> : null}
      <InfoRow label="Môn học" value={g.course?.name ?? '-'} />
      <InfoRow label="Số tín chỉ" value={String(g.course?.credits ?? '-')} />
      <InfoRow label="Học kỳ" value={g.semester} />
      <InfoRow label="Chuyên cần (10%)" value={String(g.attendance)} />
      <InfoRow label="Giữa kỳ (30%)" value={String(g.midterm)} />
      <InfoRow label="Cuối kỳ (60%)" value={String(g.final)} />
      <InfoRow label="Tổng kết (hệ 10)" value={g.total.toFixed(2)} />
      <InfoRow label="Điểm chữ" value={g.letter} />
      <InfoRow label="Điểm hệ 4" value={toScale4(g.total).toFixed(1)} />
    </ScreenContainer>
  );
}
