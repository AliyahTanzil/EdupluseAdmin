import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './redux/store';
import { setAuth } from './redux/slices/authSlice';
import * as SplashScreen from 'expo-splash-screen';

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
import GradesScreen from './screens/grades/GradesScreen';
import AttendanceScreen from './screens/attendance/AttendanceScreen';
import ReportsScreen from './screens/reports/ReportsScreen';
import SettingsScreen from './screens/settings/SettingsScreen';

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

          if (route.name === 'Dashboard') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'Schools') {
            iconName = focused ? 'school' : 'school';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people';
          } else if (route.name === 'Grades') {
            iconName = focused ? 'grade' : 'grade';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'assessment' : 'assessment';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: styles.tabBar,
        headerTitleStyle: styles.headerTitle,
        headerStyle: styles.headerStyle,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Schools"
        component={SchoolsScreen}
        options={{ title: 'Schools' }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Tab.Screen
        name="Grades"
        component={GradesScreen}
        options={{ title: 'Grades' }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App Component with Redux store
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

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationEnabled: true,
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="DashboardStack"
              component={DashboardNavigator}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name="SchoolDetails"
              component={SchoolDetailsScreen}
              options={{ title: 'School Details' }}
            />
            <Stack.Screen
              name="StudentDetails"
              component={StudentDetailsScreen}
              options={{ title: 'Student Details' }}
            />
            <Stack.Screen
              name="Attendance"
              component={AttendanceScreen}
              options={{ title: 'Attendance' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ title: 'Forgot Password' }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ title: 'Reset Password' }}
            />
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
