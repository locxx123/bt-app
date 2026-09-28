import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Student } from '../types/student';
import { useStudents } from '../context/StudentContext';
import { StudentCard } from '../components/StudentCard';
import { EmptyState } from '../components/EmptyState';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentList'>;

export const StudentListScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { students } = useStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu'>('All');

  // Lọc sinh viên theo từ khóa (Mã SV hoặc Họ tên) và bộ lọc Xếp loại
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        student.fullName.toLowerCase().includes(query) ||
        student.studentCode.toLowerCase().includes(query);

      const matchFilter = selectedFilter === 'All' || student.rank === selectedFilter;

      return matchSearch && matchFilter;
    });
  }, [students, searchQuery, selectedFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: students.length,
      gioi: students.filter(s => s.rank === 'Giỏi').length,
      kha: students.filter(s => s.rank === 'Khá').length,
      tb: students.filter(s => s.rank === 'Trung bình').length,
      yeu: students.filter(s => s.rank === 'Yếu').length,
    };
  }, [students]);

  const renderStudentItem = ({ item }: { item: Student }) => (
    <StudentCard
      student={item}
      onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>HỆ THỐNG QUẢN LÝ</Text>
          <Text style={styles.headerTitle}>Danh sách Sinh viên</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('StudentAdd')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo mã sinh viên hoặc họ tên..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterBar}>
        {(['All', 'Giỏi', 'Khá', 'Trung bình', 'Yếu'] as const).map(filter => {
          const isActive = selectedFilter === filter;
          const count =
            filter === 'All'
              ? stats.total
              : filter === 'Giỏi'
              ? stats.gioi
              : filter === 'Khá'
              ? stats.kha
              : filter === 'Trung bình'
              ? stats.tb
              : stats.yeu;

          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {filter === 'All' ? 'Tất cả' : filter} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={renderStudentItem}
        contentContainerStyle={[
          styles.listContent,
          filteredStudents.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'Không tìm thấy sinh viên' : 'Chưa có sinh viên nào'}
            description={
              searchQuery
                ? `Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Hãy thử tìm kiếm bằng mã hoặc tên khác.`
                : 'Bắt đầu thêm sinh viên đầu tiên vào hệ thống ngay hôm nay.'
            }
            buttonTitle={searchQuery ? 'Xóa bộ lọc tìm kiếm' : '+ Thêm sinh viên mới'}
            onButtonPress={() => {
              if (searchQuery) {
                setSearchQuery('');
                setSelectedFilter('All');
              } else {
                navigation.navigate('StudentAdd');
              }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    ...SHADOWS.card,
  },
  addButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    marginRight: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearSearchText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
    padding: 4,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 6,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
