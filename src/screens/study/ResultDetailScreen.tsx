import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStudy } from '../../context/StudyContext';
import { StudyStackParamList } from '../../types/study';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { SectionCard } from '../../components/study/SectionCard';
import { InfoRow } from '../../components/study/InfoRow';
import { CustomButton } from '../../components/CustomButton';
import { EmptyState } from '../../components/EmptyState';
import {
  RESULT_WEIGHTS,
  calcTotalScore,
  formatScore,
  toGrade,
} from '../../utils/studyHelpers';

type Props = NativeStackScreenProps<StudyStackParamList, 'ResultDetail'>;

const ScoreBar: React.FC<{ label: string; score: number | null }> = ({
  label,
  score,
}) => (
  <View style={styles.barRow}>
    <View style={styles.barHeader}>
      <Text style={styles.barLabel}>{label}</Text>
      <Text style={styles.barValue}>{formatScore(score)}</Text>
    </View>
    <View style={styles.barTrack}>
      <View
        style={[styles.barFill, { width: `${((score ?? 0) / 10) * 100}%` }]}
      />
    </View>
  </View>
);

export const ResultDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { semesters, getSubject, getResult } = useStudy();
  const subject = getSubject(route.params.subjectId);

  if (!subject) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="❓"
          title="Không tìm thấy kết quả"
          description="Môn học này không tồn tại."
          buttonTitle="Quay lại"
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const result = getResult(subject.id);
  const total = calcTotalScore(result);
  const grade = total !== null ? toGrade(total) : null;
  const passed = total !== null && total >= 4;
  const semesterName = semesters.find(s => s.id === subject.semesterId)?.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.subjectMeta}>
          {subject.code} • {subject.credits} tín chỉ • {semesterName}
        </Text>
        <View style={styles.totalRow}>
          <View style={styles.totalBox}>
            <Text style={styles.totalValue}>{formatScore(total)}</Text>
            <Text style={styles.totalLabel}>Hệ 10</Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.totalValue}>{grade?.letter ?? '--'}</Text>
            <Text style={styles.totalLabel}>Điểm chữ</Text>
          </View>
          <View style={styles.totalBox}>
            <Text style={styles.totalValue}>
              {grade ? grade.point.toFixed(1) : '--'}
            </Text>
            <Text style={styles.totalLabel}>Hệ 4</Text>
          </View>
        </View>
      </View>

      {!result ? (
        <EmptyState
          icon="📊"
          title="Chưa có kết quả"
          description="Môn học này chưa có điểm thành phần nào."
        />
      ) : (
        <>
          <SectionCard title="Điểm thành phần">
            <ScoreBar
              label={`Chuyên cần (${RESULT_WEIGHTS.attendance * 100}%)`}
              score={result.attendance}
            />
            <ScoreBar
              label={`Giữa kỳ (${RESULT_WEIGHTS.midterm * 100}%)`}
              score={result.midterm}
            />
            <ScoreBar
              label={`Cuối kỳ (${RESULT_WEIGHTS.final * 100}%)`}
              score={result.final}
            />
          </SectionCard>

          <SectionCard title="Tổng kết">
            <InfoRow label="Điểm tổng kết" value={formatScore(total)} />
            <InfoRow
              label="Kết quả"
              value={
                total === null ? 'Chưa tổng kết' : passed ? 'Đạt' : 'Không đạt'
              }
              valueColor={
                total === null
                  ? COLORS.textMuted
                  : passed
                  ? COLORS.success
                  : COLORS.danger
              }
            />
            <InfoRow
              label="Tín chỉ tích lũy"
              value={passed ? `${subject.credits} tín chỉ` : '0 tín chỉ'}
            />
            <Text style={styles.formula}>
              Điểm tổng kết = CC × 0.1 + GK × 0.3 + CK × 0.6
            </Text>
          </SectionCard>
        </>
      )}

      <CustomButton
        title="Xem chi tiết môn học"
        variant="outline"
        onPress={() =>
          navigation.push('SubjectDetail', { subjectId: subject.id })
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  subjectName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  subjectMeta: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  totalBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  totalLabel: {
    color: '#DBEAFE',
    fontSize: 11,
    marginTop: 2,
  },
  barRow: {
    marginBottom: SPACING.md,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 13,
    color: COLORS.secondary,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  formula: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});
