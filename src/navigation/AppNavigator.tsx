import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/student';
import { StudentListScreen } from '../screens/StudentListScreen';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { StudentAddScreen } from '../screens/StudentAddScreen';
import { StudentEditScreen } from '../screens/StudentEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="StudentList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="StudentList" component={StudentListScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="StudentAdd" component={StudentAddScreen} />
      <Stack.Screen name="StudentEdit" component={StudentEditScreen} />
    </Stack.Navigator>
  );
};
