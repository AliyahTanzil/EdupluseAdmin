import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { attendanceAPI } from '../../services/api';

const AttendanceScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [students, setStudents] = useState([
    { id: '1', name: 'John Doe', status: 'present' },
    { id: '2', name: 'Jane Smith', status: 'present' },
    { id: '3', name: 'James Wilson', status: 'absent' },
  ]);

  const toggleStatus = (id) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const attendanceData = {
        classId: selectedClass,
        date: new Date().toISOString().split('T')[0],
        records: students.map(s => ({
          studentId: s.id,
          status: s.status
        }))
      };

      await attendanceAPI.createAttendance(attendanceData);
      Alert.alert('Success', 'Attendance saved successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.subtitle}>{selectedClass} - {new Date().toLocaleDateString()}</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {students.map((student) => (
          <View key={student.id} style={styles.studentItem}>
            <Text style={styles.studentName}>{student.name}</Text>
            <TouchableOpacity 
              onPress={() => toggleStatus(student.id)}
              style={[
                styles.statusBadge, 
                student.status === 'present' ? styles.present : styles.absent
              ]}
            >
              <Text style={styles.statusText}>
                {student.status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Daily Record</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scroll: {
    padding: 15,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  present: {
    backgroundColor: '#D1FAE5',
  },
  absent: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AttendanceScreen;
