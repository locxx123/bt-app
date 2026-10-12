import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/student';
import { StudentListScreen } from '../screens/StudentListScreen';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { StudentAddScreen } from '../screens/StudentAddScreen';
import { StudentEditScreen } from '../screens/StudentEditScreen';
import Excercise from '../screens/Excercise';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingScreen } from '../screens/Setting';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="setting" component={SettingScreen} />
      {/* <Stack.Screen name="StudentList" component={StudentListScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="StudentAdd" component={StudentAddScreen} />
      <Stack.Screen name="StudentEdit" component={StudentEditScreen} /> */}
    </Stack.Navigator>
  );
};
