import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import spacing from '../../theme/spacing';
import { Grade } from '../../types';
import { calcGpa } from '../../utils/gpa';
import { sortSemesters } from '../../utils/semester';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.GradeList>;

const ALL = 'all';

export default function GradeListScreen({ navigation }: Props) {
  const { grades } = useAppData();
  const { isOnline } = useSync();
  const [semester, setSemester] = useState(ALL);

  const semesters = useMemo(
    () => sortSemesters((grades.data ?? []).map(g => g.semester)),
    [grades.data],
  );
  const filtered = useMemo(
    () => (grades.data ?? []).filter(g => semester === ALL || g.semester === semester),
    [grades.data, semester],
  );
  const { gpa, totalCredits } = useMemo(
    () =>
      calcGpa(
        filtered,
        filtered.map(g => g.course!).filter(Boolean),
      ),
    [filtered],
  );

  if (grades.loading && !grades.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!grades.data) {
    return (
      <ScreenContainer>
        <ErrorView message={grades.error?.message ?? 'Không tải được kết quả học tập'} onRetry={grades.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList<Grade>
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() => navigation.navigate(ROUTES.GradeDetail, { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={grades.refreshing}
        onRefresh={grades.refresh}
        ListHeaderComponent={
          <View>
            <FilterChips
              options={[
                { value: ALL, label: 'Tất cả' },
                ...semesters.map(s => ({ value: s, label: s })),
              ]}
              selected={semester}
              onSelect={setSemester}
            />
            {!isOnline ? <LastUpdatedText timestamp={grades.lastUpdated} /> : null}
            <GpaSummary gpa={gpa} totalCredits={totalCredits} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Chưa có kết quả học tập"
            description="Học kỳ này chưa có môn nào có điểm."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, padding: spacing.lg },
});
