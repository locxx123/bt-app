import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as assignmentService from '../../api/assignmentService';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { KEYS } from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Assignment } from '../../types';
import { formatDateTime, isOverdue } from '../../utils/date';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.AssignmentDetail>;

export default function AssignmentDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { isOnline } = useSync();
  const { assignments, pendingAssignmentIds, toggleStatus } = useAppData();
  const detail = useCachedQuery(KEYS.assignment(id), () => assignmentService.getById(id));

  // Trạng thái hiển thị lấy từ Context để đồng bộ với các tab khác
  const live = (assignments.data ?? []).find(a => a.id === id);
  const assignment: Assignment | null = detail.data
    ? { ...detail.data, ...(live ? { status: live.status } : null) }
    : live ?? null;

  useEffect(() => {
    if (assignment) {
      navigation.setOptions({ title: assignment.title });
    }
  }, [assignment?.title, navigation]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!assignment) {
    if (id > 0 && detail.loading) {
      return (
        <ScreenContainer>
          <LoadingView />
        </ScreenContainer>
      );
    }
    if (id > 0 && detail.error) {
      return (
        <ScreenContainer>
          <ErrorView message={detail.error.message} onRetry={detail.refresh} />
        </ScreenContainer>
      );
    }
    return (
      <ScreenContainer>
        <EmptyState title="Không tìm thấy bài tập" description="Bài tập có thể đã được đồng bộ hoặc bị xóa." />
      </ScreenContainer>
    );
  }

  const done = assignment.status === 'done';
  const overdue = !done && isOverdue(assignment.dueDate);

  return (
    <ScreenContainer scroll>
      {!isOnline && detail.lastUpdated ? <LastUpdatedText timestamp={detail.lastUpdated} /> : null}
      <Text style={styles.title}>{assignment.title}</Text>
      <SyncBadge pending={pendingAssignmentIds.includes(id)} />
      <InfoRow label="Môn học" value={assignment.course?.name ?? '-'} />
      <InfoRow label="Hạn nộp" value={formatDateTime(assignment.dueDate)} />
      <InfoRow label="Trạng thái" value={done ? 'Đã xong' : overdue ? 'Quá hạn' : 'Chưa xong'} />
      <Text style={styles.description}>{assignment.description || 'Không có mô tả'}</Text>
      <View style={styles.action}>
        <AppButton
          title={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
          variant={done ? 'outline' : 'primary'}
          onPress={() => toggleStatus(assignment)}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.text, marginVertical: spacing.lg },
  action: { marginBottom: spacing.xl },
});
