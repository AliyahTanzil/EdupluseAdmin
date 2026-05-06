import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const StudentDetailsScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getStudentById(studentId);
      setStudent(response.data.student || response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      Alert.alert('Error', 'Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Text>Student not found</Text>
      </View>
    );
  }

  const InfoRow = ({ icon, label, value, onPress }) => (
    <TouchableOpacity 
      style={styles.infoRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <MaterialIcons name={icon} size={20} color="#9CA3AF" />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
      </View>
      {onPress && <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>
            {student.firstName?.[0]}{student.lastName?.[0]}
          </Text>
        </View>
        <Text style={styles.nameLarge}>{student.firstName} {student.lastName}</Text>
        <Text style={styles.rollLarge}>Roll Number: {student.rollNumber || 'N/A'}</Text>
        
        <View style={styles.actionButtons}>
          <Button 
            title="Edit Profile" 
            type="outline" 
            icon="edit"
            onPress={() => navigation.navigate('EditStudent', { student })}
            style={styles.actionButton}
          />
          <Button 
            title="Attendance" 
            icon="event-available"
            onPress={() => navigation.navigate('Attendance', { studentId: student._id })}
            style={styles.actionButton}
          />
        </View>
      </View>

      {/* Academic Info */}
      <Text style={styles.sectionTitle}>Academic Information</Text>
      <Card style={styles.infoCard}>
        <InfoRow icon="class" label="Class" value={student.class?.name} />
        <InfoRow icon="email" label="Email" value={student.email} onPress={() => Linking.openURL(`mailto:${student.email}`)} />
        <InfoRow icon="phone" label="Phone" value={student.phone} onPress={() => Linking.openURL(`tel:${student.phone}`)} />
      </Card>

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>Personal Details</Text>
      <Card style={styles.infoCard}>
        <InfoRow icon="cake" label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : null} />
        <InfoRow icon="person" label="Gender" value={student.gender} />
        <InfoRow icon="location-on" label="Address" value={student.address} />
      </Card>

      {/* Parent/Guardian Info */}
      <Text style={styles.sectionTitle}>Guardian Information</Text>
      <Card style={styles.infoCard}>
        <InfoRow icon="supervisor-account" label="Guardian Name" value={student.guardianName} />
        <InfoRow icon="phone" label="Guardian Phone" value={student.guardianPhone} onPress={() => Linking.openURL(`tel:${student.guardianPhone}`)} />
      </Card>

      <Button 
        title="View Report Card" 
        type="secondary"
        icon="assessment"
        onPress={() => navigation.navigate('StudentReportCard', { studentId: student._id })}
        style={styles.reportButton}
      />
      
      <Button 
        title="Delete Student" 
        type="danger" 
        icon="delete"
        onPress={() => {
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this student?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                style: 'destructive', 
                onPress: async () => {
                  try {
                    await studentAPI.deleteStudent(student._id);
                    navigation.goBack();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to delete student');
                  }
                } 
              }
            ]
          );
        }}
        style={styles.deleteButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#3B82F6',
  },
  nameLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  rollLarge: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  actionButton: {
    marginHorizontal: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#374151',
    marginTop: 2,
  },
  reportButton: {
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
});

export default StudentDetailsScreen;
