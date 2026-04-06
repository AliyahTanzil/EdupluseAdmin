import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StudentsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Students Screen</Text>
  </View>
);

const GradesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Grades Screen</Text>
  </View>
);

const ReportsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Reports Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Screen</Text>
  </View>
);

const SchoolDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>School Details</Text>
  </View>
);

const StudentDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Student Details</Text>
  </View>
);

const AttendanceScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Attendance</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const ForgotPasswordScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Forgot Password</Text>
  </View>
);

const ResetPasswordScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Reset Password</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 18,
    color: '#1F2937',
  },
});

export { StudentsScreen, GradesScreen, ReportsScreen, ProfileScreen, SchoolDetailsScreen, StudentDetailsScreen, AttendanceScreen, SettingsScreen, ForgotPasswordScreen, ResetPasswordScreen };
