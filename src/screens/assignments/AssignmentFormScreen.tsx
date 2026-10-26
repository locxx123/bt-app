import React, { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../../components/common/AppButton';
import FilterChips from '../../components/common/FilterChips';
import FormInput from '../../components/common/FormInput';
import ScreenContainer from '../../components/common/ScreenContainer';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatDate, formatTime } from '../../utils/date';
import { latestSemester } from '../../utils/semester';
import { notify } from '../../utils/notify';
import { parseDueInput, validateDueDate, validateTitle } from '../../utils/validators';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.AssignmentForm>;

const defaultDue = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(23, 59, 0, 0);
  return `${formatDate(d)} ${formatTime(d)}`;
};

export default function AssignmentFormScreen({ navigation }: Props) {
  const { courses, addAssignment } = useAppData();
  const { isOnline } = useSync();
  const options = useMemo(() => {
    const list = courses.data ?? [];
    const current = latestSemester(list.map(c => c.semester));
    return list.filter(c => c.semester === current);
  }, [courses.data]);

  const [courseId, setCourseId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState(defaultDue());
  const [errors, setErrors] = useState({ title: '', due: '', course: '' });
  const [saving, setSaving] = useState(false);

  const selectedCourse = courseId ?? options[0]?.id ?? null;

  const submit = async () => {
    const next = {
      title: validateTitle(title),
      due: validateDueDate(due),
      course: selectedCourse === null ? 'Chưa có môn học để chọn' : '',
    };
    setErrors(next);
    if (next.title || next.due || next.course) {
      return;
    }
    setSaving(true);
    try {
      await addAssignment({
        courseId: selectedCourse as number,
        title: title.trim(),
        description: description.trim(),
        dueDate: (parseDueInput(due) as Date).toISOString(),
      });
      if (!isOnline) {
        notify('Đã lưu bài tập, sẽ đồng bộ khi có mạng');
      }
      navigation.goBack();
    } catch {
      notify('Không thể thêm bài tập, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.label}>Môn học</Text>
      <FilterChips
        options={options.map(c => ({ value: String(c.id), label: c.code }))}
        selected={String(selectedCourse)}
        onSelect={value => setCourseId(Number(value))}
      />
      {errors.course ? <Text style={styles.error}>{errors.course}</Text> : null}
      <FormInput label="Tiêu đề" value={title} onChangeText={setTitle} error={errors.title} />
      <FormInput label="Mô tả" value={description} onChangeText={setDescription} />
      <FormInput
        label="Hạn nộp (dd/MM/yyyy HH:mm)"
        value={due}
        onChangeText={setDue}
        error={errors.due}
      />
      <AppButton title="Lưu bài tập" onPress={submit} loading={saving} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.text },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
});
