import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { attendanceAPI, classAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

const AttendanceScreen = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: status }
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getClasses();
      setClasses(response.data.classes || response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setFetchingClasses(false);
    }
  };

  const fetchStudents = async (classId) => {
    if (!classId) return;
    try {
      setLoading(true);
      const response = await classAPI.getClassStudents(classId);
      const studentList = response.data.students || response.data;
      setStudents(studentList);
      
      // Initialize attendance with 'present' for all
      const initialAttendance = {};
      studentList.forEach(s => {
        initialAttendance[s._id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students for this class');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }

    setSaving(true);
    try {
      const attendanceData = students.map(s => ({
        student: s._id,
        status: attendance[s._id] || 'present',
      }));

      await attendanceAPI.markBulk({
        class: selectedClass,
        date,
        records: attendanceData,
      });

      Alert.alert('Success', 'Attendance marked successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
      Alert.alert('Error', 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const StatusButton = ({ status, currentStatus, onPress, icon, color }) => (
    <TouchableOpacity 
      style={[
        styles.statusButton, 
        currentStatus === status && { backgroundColor: color }
      ]}
      onPress={onPress}
    >
      <MaterialIcons 
        name={icon} 
        size={20} 
        color={currentStatus === status ? '#FFFFFF' : '#9CA3AF'} 
      />
    </TouchableOpacity>
  );

  const renderStudentItem = ({ item }) => (
    <Card style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.rollNumber}>Roll No: {item.rollNumber || 'N/A'}</Text>
      </View>
      <View style={styles.statusActions}>
        <StatusButton 
          status="present" 
          currentStatus={attendance[item._id]} 
          onPress={() => handleStatusChange(item._id, 'present')}
          icon="check-circle"
          color="#10B981"
        />
        <StatusButton 
          status="absent" 
          currentStatus={attendance[item._id]} 
          onPress={() => handleStatusChange(item._id, 'absent')}
          icon="cancel"
          color="#EF4444"
        />
        <StatusButton 
          status="late" 
          currentStatus={attendance[item._id]} 
          onPress={() => handleStatusChange(item._id, 'late')}
          icon="access-time"
          color="#F59E0B"
        />
      </View>
    </Card>
  );

  if (fetchingClasses) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Select Class</Text>
          <View style={styles.pickerBorder}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(v) => {
                setSelectedClass(v);
                fetchStudents(v);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Choose a class..." value="" />
              {classes.map(c => (
                <Picker.Item key={c._id} label={c.name} value={c._id} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.dateInfo}>
          <Text style={styles.dateLabel}>Date</Text>
          <Text style={styles.dateValue}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : selectedClass ? (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Present</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {Object.values(attendance).filter(s => s === 'present').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Absent</Text>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>
                {Object.values(attendance).filter(s => s === 'absent').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Late</Text>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {Object.values(attendance).filter(s => s === 'late').length}
              </Text>
            </View>
          </View>

          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>No students found in this class</Text>
              </View>
            }
          />
          
          <View style={styles.footer}>
            <Button 
              title="Save Attendance" 
              onPress={handleSave} 
              loading={saving}
              disabled={students.length === 0}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="class" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Please select a class to mark attendance</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerWrapper: {
    flex: 2,
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  pickerBorder: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    height: 44,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  dateInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    height: 44,
    textAlignVertical: 'center',
    lineHeight: 44,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  rollNumber: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusActions: {
    flexDirection: 'row',
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#F3F4F6',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default AttendanceScreen;
