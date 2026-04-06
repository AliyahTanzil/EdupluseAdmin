import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  text: { fontSize: 18, color: '#1F2937' },
});

export { SchoolDetailsScreen, StudentDetailsScreen };
