import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import spacing from '../../theme/spacing';
import { Assignment } from '../../types';
import { isOverdue } from '../../utils/date';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.AssignmentList>;

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'todo', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];

export default function AssignmentListScreen({ navigation }: Props) {
  const { assignments, pendingAssignmentIds, toggleStatus } = useAppData();
  const { isOnline } = useSync();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(
    () =>
      (assignments.data ?? []).filter(a => {
        if (filter === 'done') {
          return a.status === 'done';
        }
        if (filter === 'todo') {
          return a.status === 'todo';
        }
        if (filter === 'overdue') {
          return a.status !== 'done' && isOverdue(a.dueDate);
        }
        return true;
      }),
    [assignments.data, filter],
  );

  if (assignments.loading && !assignments.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!assignments.data) {
    return (
      <ScreenContainer>
        <ErrorView message={assignments.error?.message ?? 'Không tải được danh sách bài tập'} onRetry={assignments.refresh} />
      </ScreenContainer>
    );
  }

  const goToForm = () => navigation.navigate(ROUTES.AssignmentForm);

  return (
    <ScreenContainer>
      <FlatList<Assignment>
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingAssignmentIds.includes(item.id)}
            onPress={() => navigation.navigate(ROUTES.AssignmentDetail, { id: item.id })}
            onToggleStatus={() => toggleStatus(item)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={assignments.refreshing}
        onRefresh={assignments.refresh}
        ListHeaderComponent={
          <View>
            <AppButton title="Thêm bài tập" onPress={goToForm} />
            <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
            {!isOnline ? <LastUpdatedText timestamp={assignments.lastUpdated} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập nào"
            description="Không có bài tập phù hợp với bộ lọc hiện tại."
            actionLabel="Thêm bài tập"
            onAction={goToForm}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, padding: spacing.lg },
});
