import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';
import AssignmentStack from './AssignmentStack';
import CourseStack from './CourseStack';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import ScheduleStack from './ScheduleStack';
import { ROUTES } from './routes';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, [IconName, IconName]> = {
  [ROUTES.HomeTab]: ['home', 'home-outline'],
  [ROUTES.CourseTab]: ['book', 'book-outline'],
  [ROUTES.ScheduleTab]: ['calendar', 'calendar-outline'],
  [ROUTES.AssignmentTab]: ['document-text', 'document-text-outline'],
  [ROUTES.ProfileTab]: ['person', 'person-outline'],
};

const renderTabIcon =
  (routeName: string) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
    <Ionicons name={TAB_ICONS[routeName][focused ? 0 : 1]} size={size} color={color} />;

export default function AppNavigator() {
  const { assignments } = useAppData();
  const todoCount = (assignments.data ?? []).filter(a => a.status !== 'done').length;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: renderTabIcon(route.name),
        })}>
        <Tab.Screen name={ROUTES.HomeTab} component={HomeStack} options={{ title: 'Tổng quan' }} />
        <Tab.Screen name={ROUTES.CourseTab} component={CourseStack} options={{ title: 'Môn học' }} />
        <Tab.Screen name={ROUTES.ScheduleTab} component={ScheduleStack} options={{ title: 'Lịch học' }} />
        <Tab.Screen
          name={ROUTES.AssignmentTab}
          component={AssignmentStack}
          options={{ title: 'Bài tập', tabBarBadge: todoCount > 0 ? todoCount : undefined }}
        />
        <Tab.Screen name={ROUTES.ProfileTab} component={ProfileStack} options={{ title: 'Cá nhân' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
