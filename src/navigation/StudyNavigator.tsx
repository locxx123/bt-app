import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { MainTabParamList, StudyStackParamList } from '../types/study';
import { COLORS } from '../constants/theme';
import { useStudy } from '../context/StudyContext';
import { getAssignmentDisplayStatus } from '../utils/studyHelpers';
import { DashboardScreen } from '../screens/study/DashboardScreen';
import { SubjectsScreen } from '../screens/study/SubjectsScreen';
import { TimetableScreen } from '../screens/study/TimetableScreen';
import { AssignmentsScreen } from '../screens/study/AssignmentsScreen';
import { ProfileScreen } from '../screens/study/ProfileScreen';
import { SubjectDetailScreen } from '../screens/study/SubjectDetailScreen';
import { SessionDetailScreen } from '../screens/study/SessionDetailScreen';
import { AssignmentDetailScreen } from '../screens/study/AssignmentDetailScreen';
import { ResultDetailScreen } from '../screens/study/ResultDetailScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<StudyStackParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Dashboard: ['home', 'home-outline'],
  Subjects: ['book', 'book-outline'],
  Timetable: ['calendar', 'calendar-outline'],
  Assignments: ['document-text', 'document-text-outline'],
  Profile: ['person', 'person-outline'],
};

const renderTabIcon =
  (routeName: keyof MainTabParamList) =>
  ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) =>
    (
      <Ionicons
        name={TAB_ICONS[routeName][focused ? 0 : 1]}
        size={size}
        color={color}
      />
    );

const MainTabs: React.FC = () => {
  const { assignments, now } = useStudy();
  const overdueCount = assignments.filter(
    a => getAssignmentDisplayStatus(a, now) === 'overdue',
  ).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontWeight: '700', color: COLORS.text },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: renderTabIcon(route.name),
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Tổng quan' }}
      />
      <Tab.Screen
        name="Subjects"
        component={SubjectsScreen}
        options={{ title: 'Môn học' }}
      />
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{ title: 'Thời khóa biểu', tabBarLabel: 'Lịch học' }}
      />
      <Tab.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{
          title: 'Bài tập',
          tabBarBadge: overdueCount > 0 ? overdueCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Cá nhân & kết quả', tabBarLabel: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
};

export const StudyNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackTitle: 'Quay lại',
      headerTintColor: COLORS.primary,
      headerTitleStyle: { fontWeight: '700', color: COLORS.text },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="MainTabs"
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SubjectDetail"
      component={SubjectDetailScreen}
      options={{ title: 'Chi tiết môn học' }}
    />
    <Stack.Screen
      name="SessionDetail"
      component={SessionDetailScreen}
      options={{ title: 'Chi tiết buổi học' }}
    />
    <Stack.Screen
      name="AssignmentDetail"
      component={AssignmentDetailScreen}
      options={{ title: 'Chi tiết bài tập' }}
    />
    <Stack.Screen
      name="ResultDetail"
      component={ResultDetailScreen}
      options={{ title: 'Chi tiết kết quả học tập' }}
    />
  </Stack.Navigator>
);
