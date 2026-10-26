import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import { ROUTES, RootParamList } from './routes';

const Stack = createNativeStackNavigator<RootParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.Schedule} component={ScheduleScreen} options={{ title: 'Thời khóa biểu' }} />
      <Stack.Screen name={ROUTES.SessionDetail} component={SessionDetailScreen} options={{ title: 'Buổi học' }} />
    </Stack.Navigator>
  );
}
