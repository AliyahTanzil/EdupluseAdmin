import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { store } from './redux/store';
import { setAuth } from './redux/slices/authSlice';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

// Dashboard Screens
import DashboardScreen from './screens/dashboard/DashboardScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import SchoolsScreen from './screens/schools/SchoolsScreen';
import { SchoolDetailsScreen } from './screens/schools/SchoolDetailsScreen';
import StudentsScreen from './screens/students/StudentsScreen';
import StudentDetailsScreen from './screens/students/StudentDetailsScreen';
import AddEditStudentScreen from './screens/students/AddEditStudentScreen';
import StudentReportCardScreen from './screens/students/StudentReportCardScreen';
import TeachersScreen from './screens/teachers/TeachersScreen';
import TeacherDetailScreen from './screens/teachers/TeacherDetailScreen';
import AddEditTeacherScreen from './screens/teachers/AddEditTeacherScreen';
import GradesScreen from './screens/grades/GradesScreen';
import AttendanceScreen from './screens/attendance/AttendanceScreen';
import TimetableScreen from './screens/timetable/TimetableScreen';
import EditTimetableScreen from './screens/timetable/EditTimetableScreen';
import ReportsScreen from './screens/reports/ReportsScreen';
import GenerateReportScreen from './screens/reports/GenerateReportScreen';
import SettingsScreen from './screens/settings/SettingsScreen';

// Section screens
import SchoolSectionScreen from './screens/sections/SchoolSectionScreen';
import SectionDashboardScreen from './screens/sections/SectionDashboardScreen';
import CreateClassScreen from './screens/sections/CreateClassScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation component for authenticated users
const DashboardNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'dashboard';
          else if (route.name === 'Schools') iconName = 'school';
          else if (route.name === 'Students') iconName = 'people';
          else if (route.name === 'Grades') iconName = 'grade';
          else if (route.name === 'Reports') iconName = 'assessment';
          else if (route.name === 'Profile') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.headerStyle,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Schools" component={SchoolsScreen} options={{ title: 'Schools' }} />
      <Tab.Screen name="Students" component={StudentsScreen} options={{ title: 'Students' }} />
      <Tab.Screen name="Grades" component={GradesScreen} options={{ title: 'Grades' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

function RootNavigator() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function bootstrapAsync() {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const user = await AsyncStorage.getItem('user');
        if (token && user) {
          store.dispatch(setAuth({
            user: JSON.parse(user),
            token,
            isAuthenticated: true,
          }));
        }
      } catch (error) {
        console.error('Failed to restore token', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    bootstrapAsync();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animationEnabled: true, headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="SchoolSections" component={SchoolSectionScreen} options={{ animationEnabled: false }} />
            <Stack.Screen name="SectionDashboard" component={SectionDashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CreateClass" component={CreateClassScreen} options={{ title: 'Create Class', headerShown: true, headerTintColor: '#3B82F6' }} />
            <Stack.Screen name="DashboardStack" component={DashboardNavigator} options={{ animationEnabled: false }} />
            <Stack.Screen name="SchoolDetails" component={SchoolDetailsScreen} options={{ title: 'School Details', headerShown: true }} />
            <Stack.Screen name="AddStudent" component={AddEditStudentScreen} options={{ title: 'Add Student', headerShown: true }} />
            <Stack.Screen name="EditStudent" component={AddEditStudentScreen} options={{ title: 'Edit Student', headerShown: true }} />
            <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} options={{ title: 'Student Details', headerShown: true }} />
            <Stack.Screen name="Teachers" component={TeachersScreen} options={{ title: 'Teachers', headerShown: true }} />
            <Stack.Screen name="TeacherDetails" component={TeacherDetailScreen} options={{ title: 'Teacher Details', headerShown: true }} />
            <Stack.Screen name="AddTeacher" component={AddEditTeacherScreen} options={{ title: 'Add Teacher', headerShown: true }} />
            <Stack.Screen name="EditTeacher" component={AddEditTeacherScreen} options={{ title: 'Edit Teacher', headerShown: true }} />
            <Stack.Screen name="StudentReportCard" component={StudentReportCardScreen} options={{ title: 'Report Card', headerShown: true }} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance', headerShown: true }} />
            <Stack.Screen name="Timetable" component={TimetableScreen} options={{ title: 'Timetable', headerShown: true }} />
            <Stack.Screen name="EditTimetable" component={EditTimetableScreen} options={{ title: 'Edit Timetable', headerShown: true }} />
            <Stack.Screen name="GenerateReport" component={GenerateReportScreen} options={{ title: 'Generate Report', headerShown: true }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings', headerShown: true }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ animationEnabled: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password', headerShown: true }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password', headerShown: true }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerStyle: {
    backgroundColor: '#F3F4F6',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
});
