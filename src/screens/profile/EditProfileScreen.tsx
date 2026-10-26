import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import FormInput from '../../components/common/FormInput';
import ScreenContainer from '../../components/common/ScreenContainer';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES, RootParamList } from '../../navigation/routes';
import { notify } from '../../utils/notify';
import { validateName } from '../../utils/validators';

type Props = NativeStackScreenProps<RootParamList, typeof ROUTES.EditProfile>;

export default function EditProfileScreen({ navigation }: Props) {
  const { student, updateProfile } = useAppData();
  const { isOnline } = useSync();
  const s = student.data;
  const [fullName, setFullName] = useState(s?.fullName ?? '');
  const [className, setClassName] = useState(s?.className ?? '');
  const [major, setMajor] = useState(s?.major ?? '');
  const [email, setEmail] = useState(s?.email ?? '');
  const [phone, setPhone] = useState(s?.phone ?? '');
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!s) {
    return (
      <ScreenContainer>
        <EmptyState title="Chưa có dữ liệu" description="Hãy quay lại và tải thông tin cá nhân trước." />
      </ScreenContainer>
    );
  }

  const submit = async () => {
    const error = validateName(fullName);
    setNameError(error);
    if (error) {
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        className: className.trim(),
        major: major.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      if (!isOnline) {
        notify('Đã lưu thay đổi, sẽ đồng bộ khi có mạng');
      }
      navigation.goBack();
    } catch {
      notify('Không thể lưu thông tin, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <FormInput label="Họ tên" value={fullName} onChangeText={setFullName} error={nameError} />
      <FormInput label="Lớp" value={className} onChangeText={setClassName} />
      <FormInput label="Ngành" value={major} onChangeText={setMajor} />
      <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <FormInput label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <AppButton title="Lưu thay đổi" onPress={submit} loading={saving} />
    </ScreenContainer>
  );
}
