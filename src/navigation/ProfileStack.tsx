import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { ROUTES, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} options={{ title: 'Cá nhân' }} />
      <Stack.Screen name={ROUTES.EditProfile} component={EditProfileScreen} options={{ title: 'Chỉnh sửa thông tin' }} />
      <Stack.Screen name={ROUTES.GradeList} component={GradeListScreen} options={{ title: 'Kết quả học tập' }} />
      <Stack.Screen name={ROUTES.GradeDetail} component={GradeDetailScreen} options={{ title: 'Chi tiết kết quả' }} />
    </Stack.Navigator>
  );
}
