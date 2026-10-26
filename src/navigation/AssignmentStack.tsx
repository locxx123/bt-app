import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import AssignmentFormScreen from '../screens/assignments/AssignmentFormScreen';
import AssignmentListScreen from '../screens/assignments/AssignmentListScreen';
import { ROUTES, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

export default function AssignmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.AssignmentList} component={AssignmentListScreen} options={{ title: 'Bài tập' }} />
      <Stack.Screen name={ROUTES.AssignmentDetail} component={AssignmentDetailScreen} options={{ title: 'Bài tập' }} />
      <Stack.Screen name={ROUTES.AssignmentForm} component={AssignmentFormScreen} options={{ title: 'Thêm bài tập' }} />
    </Stack.Navigator>
  );
}
