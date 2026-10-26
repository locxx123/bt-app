import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../../components/common/AppButton';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import SyncBadge from '../../components/common/SyncBadge';
import GpaSummary from '../../components/grade/GpaSummary';
import InfoRow from '../../components/profile/InfoRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import spacing from '../../theme/spacing';
import { calcGpa } from '../../utils/gpa';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.Profile>;

export default function ProfileScreen({ navigation }: Props) {
  const { student, grades, profilePending } = useAppData();
  const { isOnline } = useSync();

  const refreshAll = () => {
    student.refresh();
    grades.refresh();
  };

  if (student.loading && !student.data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  if (!student.data) {
    return (
      <ScreenContainer>
        <ErrorView message={student.error?.message ?? 'Không tải được thông tin cá nhân'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const s = student.data;
  const gradeList = grades.data ?? [];
  const { gpa, totalCredits } = calcGpa(
    gradeList,
    gradeList.map(g => g.course!).filter(Boolean),
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={student.refreshing || grades.refreshing} onRefresh={refreshAll} />
        }>
        {!isOnline ? <LastUpdatedText timestamp={student.lastUpdated} /> : null}
        <SyncBadge pending={profilePending} />
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        <InfoRow label="Mã sinh viên" value={s.studentCode} />
        <InfoRow label="Họ tên" value={s.fullName} />
        <InfoRow label="Lớp" value={s.className} />
        <InfoRow label="Ngành" value={s.major} />
        <InfoRow label="Email" value={s.email} />
        <InfoRow label="Số điện thoại" value={s.phone} />
        <View style={styles.actions}>
          <AppButton title="Chỉnh sửa thông tin" onPress={() => navigation.navigate(ROUTES.EditProfile)} />
        </View>
        <View style={styles.actions}>
          <AppButton
            title="Kết quả học tập"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.GradeList)}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  actions: { marginTop: spacing.md },
});
