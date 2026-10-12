import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStudy } from '../../context/StudyContext';
import { AssignmentDisplayStatus, StudyNavigation } from '../../types/study';
import { ASSIGNMENT_STATUS_META } from '../../constants/study';
import { COLORS, SPACING } from '../../constants/theme';
import { SearchBar } from '../../components/study/SearchBar';
import { FilterChips, FilterOption } from '../../components/study/FilterChips';
import { AssignmentItem } from '../../components/study/AssignmentItem';
import { EmptyState } from '../../components/EmptyState';
import {
  getAssignmentDisplayStatus,
  isDueSoon,
  normalizeText,
} from '../../utils/studyHelpers';

type StatusFilter = 'all' | AssignmentDisplayStatus;

const FILTER_ORDER: AssignmentDisplayStatus[] = [
  'todo',
  'in_progress',
  'done',
  'overdue',
];

/** Thứ tự ưu tiên hiển thị: quá hạn → sắp đến hạn → còn lại → đã xong */
const priority = (status: AssignmentDisplayStatus, dueSoon: boolean) => {
  if (status === 'overdue') {
    return 0;
  }
  if (dueSoon) {
    return 1;
  }
  return status === 'done' ? 3 : 2;
};

export const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<StudyNavigation>();
  const { assignments, now, getSubject } = useStudy();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const withStatus = useMemo(
    () =>
      assignments.map(a => ({
        assignment: a,
        status: getAssignmentDisplayStatus(a, now),
        dueSoon: isDueSoon(a, now),
      })),
    [assignments, now],
  );

  const filterOptions = useMemo<FilterOption<StatusFilter>[]>(
    () => [
      { value: 'all', label: 'Tất cả', count: withStatus.length },
      ...FILTER_ORDER.map(status => ({
        value: status,
        label: ASSIGNMENT_STATUS_META[status].label,
        count: withStatus.filter(x => x.status === status).length,
      })),
    ],
    [withStatus],
  );

  const data = useMemo(() => {
    const q = normalizeText(keyword);
    return withStatus
      .filter(
        x =>
          (statusFilter === 'all' || x.status === statusFilter) &&
          (q === '' || normalizeText(x.assignment.title).includes(q)),
      )
      .sort(
        (a, b) =>
          priority(a.status, a.dueSoon) - priority(b.status, b.dueSoon) ||
          new Date(a.assignment.dueDate).getTime() -
            new Date(b.assignment.dueDate).getTime(),
      );
  }, [withStatus, keyword, statusFilter]);

  const overdueCount = withStatus.filter(x => x.status === 'overdue').length;
  const dueSoonCount = withStatus.filter(x => x.dueSoon).length;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm bài tập theo tên"
        />
        <FilterChips
          options={filterOptions}
          selected={statusFilter}
          onSelect={setStatusFilter}
        />
        {overdueCount + dueSoonCount > 0 ? (
          <Text style={styles.alert}>
            ⚠️ {overdueCount} bài quá hạn • {dueSoonCount} bài sắp đến hạn (3
            ngày)
          </Text>
        ) : null}
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.assignment.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item.assignment}
            subject={getSubject(item.assignment.subjectId)}
            now={now}
            onPress={() =>
              navigation.navigate('AssignmentDetail', {
                assignmentId: item.assignment.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📝"
            title="Không có bài tập"
            description={
              keyword
                ? `Không tìm thấy bài tập nào khớp với "${keyword}".`
                : 'Không có bài tập nào ở trạng thái này.'
            }
            buttonTitle={
              keyword || statusFilter !== 'all' ? 'Xóa bộ lọc' : undefined
            }
            onButtonPress={() => {
              setKeyword('');
              setStatusFilter('all');
            }}
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
  toolbar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  alert: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  list: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
    flexGrow: 1,
  },
});
