import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CourseCard from '../../components/course/CourseCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import spacing from '../../theme/spacing';
import { Course } from '../../types';
import { sortSemesters } from '../../utils/semester';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.CourseList>;

const ALL = 'all';

export default function CourseListScreen({ navigation }: Props) {
  const { courses } = useAppData();
  const { isOnline } = useSync();
  const [query, setQuery] = useState('');
  const [semester, setSemester] = useState(ALL);

  const semesters = useMemo(
    () => sortSemesters((courses.data ?? []).map(c => c.semester)),
    [courses.data],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (courses.data ?? []).filter(
      c =>
        (semester === ALL || c.semester === semester) &&
        (!q || c.name.toLowerCase().includes(q)),
    );
  }, [courses.data, query, semester]);

  if (courses.loading && !courses.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!courses.data) {
    return (
      <ScreenContainer>
        <ErrorView message={courses.error?.message ?? 'Không tải được danh sách môn học'} onRetry={courses.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList<Course>
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(ROUTES.CourseDetail, { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={courses.refreshing}
        onRefresh={courses.refresh}
        ListHeaderComponent={
          <View>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Tìm theo tên môn học" />
            <FilterChips
              options={[
                { value: ALL, label: 'Tất cả' },
                ...semesters.map(s => ({ value: s, label: s })),
              ]}
              selected={semester}
              onSelect={setSemester}
            />
            {!isOnline ? <LastUpdatedText timestamp={courses.lastUpdated} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Thử đổi từ khóa tìm kiếm hoặc chọn học kỳ khác."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, padding: spacing.lg },
});
