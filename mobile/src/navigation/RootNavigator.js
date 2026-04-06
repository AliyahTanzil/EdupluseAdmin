import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { AuthContext } from './src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import AdminDashboardScreen from './src/screens/dashboards/AdminDashboardScreen';
import TeacherDashboardScreen from './src/screens/dashboards/TeacherDashboardScreen';
import StudentDashboardScreen from './src/screens/dashboards/StudentDashboardScreen';
import ParentDashboardScreen from './src/screens/dashboards/ParentDashboardScreen';
import UserManagementScreen from './src/screens/management/UserManagementScreen';
import SchoolManagementScreen from './src/screens/management/SchoolManagementScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Stack Navigator
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/**
 * Dashboard Tab Navigator
 */
function DashboardTabs({ userRole }) {
  const getDashboardComponent = () => {
    switch (userRole) {
      case 'teacher':
        return TeacherDashboardScreen;
      case 'student':
        return StudentDashboardScreen;
      case 'parent':
        return ParentDashboardScreen;
      default:
        return AdminDashboardScreen;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={getDashboardComponent()}
        options={{
          title: 'Dashboard',
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Management"
        component={UserManagementScreen}
        options={{
          title: 'Management',
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * App Stack Navigator (Main logged-in flow)
 */
function AppStack() {
  const { user } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainApp"
        children={() => <DashboardTabs userRole={user?.adminType} />}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator
 */
export default function RootNavigator({ isLoading, userToken }) {
  return (
    <NavigationContainer>
      {isLoading ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            options={{
              headerShown: false,
              animationEnabled: false,
            }}
          />
        </Stack.Navigator>
      ) : userToken == null ? (
        <AuthStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}
