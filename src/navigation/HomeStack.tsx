import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import HomeScreen from '../screens/home/HomeScreen';
import { ROUTES, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.Home} component={HomeScreen} options={{ title: 'Tổng quan' }} />
      <Stack.Screen name={ROUTES.CourseDetail} component={CourseDetailScreen} options={{ title: 'Môn học' }} />
      <Stack.Screen name={ROUTES.AssignmentDetail} component={AssignmentDetailScreen} options={{ title: 'Bài tập' }} />
    </Stack.Navigator>
  );
}
