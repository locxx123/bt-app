import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import CourseListScreen from '../screens/courses/CourseListScreen';
import { ROUTES, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

export default function CourseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.CourseList} component={CourseListScreen} options={{ title: 'Môn học' }} />
      <Stack.Screen name={ROUTES.CourseDetail} component={CourseDetailScreen} options={{ title: 'Môn học' }} />
      <Stack.Screen name={ROUTES.AssignmentDetail} component={AssignmentDetailScreen} options={{ title: 'Bài tập' }} />
    </Stack.Navigator>
  );
}
