export const ROUTES = {
  // Tab
  HomeTab: 'HomeTab',
  CourseTab: 'CourseTab',
  ScheduleTab: 'ScheduleTab',
  AssignmentTab: 'AssignmentTab',
  ProfileTab: 'ProfileTab',
  // Màn hình
  Home: 'Home',
  CourseList: 'CourseList',
  CourseDetail: 'CourseDetail',
  Schedule: 'Schedule',
  SessionDetail: 'SessionDetail',
  AssignmentList: 'AssignmentList',
  AssignmentDetail: 'AssignmentDetail',
  AssignmentForm: 'AssignmentForm',
  Profile: 'Profile',
  EditProfile: 'EditProfile',
  GradeList: 'GradeList',
  GradeDetail: 'GradeDetail',
} as const;

/** Màn hình chi tiết chỉ nhận { id } qua route.params */
export type RootParamList = {
  [ROUTES.Home]: undefined;
  [ROUTES.CourseList]: undefined;
  [ROUTES.CourseDetail]: { id: number };
  [ROUTES.Schedule]: undefined;
  [ROUTES.SessionDetail]: { id: number };
  [ROUTES.AssignmentList]: undefined;
  [ROUTES.AssignmentDetail]: { id: number };
  [ROUTES.AssignmentForm]: undefined;
  [ROUTES.Profile]: undefined;
  [ROUTES.EditProfile]: undefined;
  [ROUTES.GradeList]: undefined;
  [ROUTES.GradeDetail]: { id: number };
};
