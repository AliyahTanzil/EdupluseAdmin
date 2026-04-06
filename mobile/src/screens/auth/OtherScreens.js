import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  text: { fontSize: 18, color: '#1F2937' },
});

export { AttendanceScreen, SettingsScreen, ForgotPasswordScreen, ResetPasswordScreen };
