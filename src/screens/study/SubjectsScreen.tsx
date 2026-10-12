import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStudy } from '../../context/StudyContext';
import { StudyNavigation, Subject } from '../../types/study';
import { COLORS, SPACING } from '../../constants/theme';
import { SearchBar } from '../../components/study/SearchBar';
import { FilterChips, FilterOption } from '../../components/study/FilterChips';
import { SubjectItem } from '../../components/study/SubjectItem';
import { EmptyState } from '../../components/EmptyState';
import { normalizeText } from '../../utils/studyHelpers';

const ALL = 'all';

export const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation<StudyNavigation>();
  const { subjects, semesters, currentSemesterId } = useStudy();
  const [keyword, setKeyword] = useState('');
  const [semesterId, setSemesterId] = useState<string>(currentSemesterId);
  const [filtered, setFiltered] = useState<Subject[]>([]);

  // Lọc lại danh sách khi từ khóa hoặc học kỳ thay đổi
  useEffect(() => {
    const q = normalizeText(keyword);
    setFiltered(
      subjects.filter(
        s =>
          (semesterId === ALL || s.semesterId === semesterId) &&
          (q === '' ||
            normalizeText(s.code).includes(q) ||
            normalizeText(s.name).includes(q)),
      ),
    );
  }, [keyword, semesterId, subjects]);

  const semesterOptions = useMemo<FilterOption<string>[]>(
    () => [
      { value: ALL, label: 'Tất cả' },
      ...[...semesters].reverse().map(s => ({ value: s.id, label: s.name })),
    ],
    [semesters],
  );

  const semesterName = (id: string) => semesters.find(s => s.id === id)?.name;
  const totalCredits = filtered.reduce((sum, s) => sum + s.credits, 0);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm theo mã hoặc tên môn học"
        />
        <FilterChips
          options={semesterOptions}
          selected={semesterId}
          onSelect={setSemesterId}
        />
        <Text style={styles.summary}>
          {filtered.length} môn học • {totalCredits} tín chỉ
        </Text>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <SubjectItem
            subject={item}
            semesterName={semesterName(item.semesterId)}
            onPress={() =>
              navigation.navigate('SubjectDetail', { subjectId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📚"
            title="Không tìm thấy môn học"
            description={
              keyword
                ? `Không có môn học nào khớp với "${keyword}".`
                : 'Học kỳ này chưa có môn học nào.'
            }
            buttonTitle={keyword ? 'Xóa tìm kiếm' : undefined}
            onButtonPress={keyword ? () => setKeyword('') : undefined}
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
  summary: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  list: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
    flexGrow: 1,
  },
});
