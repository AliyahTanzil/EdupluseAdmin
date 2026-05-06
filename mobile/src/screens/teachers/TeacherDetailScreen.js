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
import { teacherAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const TeacherDetailScreen = ({ route, navigation }) => {
  const { teacherId } = route.params;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherDetails();
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeacherById(teacherId);
      setTeacher(response.data.teacher || response.data);
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      Alert.alert('Error', 'Failed to load teacher details');
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

  if (!teacher) {
    return (
      <View style={styles.errorContainer}>
        <Text>Teacher not found</Text>
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
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>
            {teacher.firstName?.[0]}{teacher.lastName?.[0]}
          </Text>
        </View>
        <Text style={styles.nameLarge}>{teacher.firstName} {teacher.lastName}</Text>
        <Text style={styles.subjectLarge}>{teacher.subject || 'No Subject Assigned'}</Text>
        
        <View style={styles.actionButtons}>
          <Button 
            title="Edit Profile" 
            type="outline" 
            icon="edit"
            onPress={() => navigation.navigate('EditTeacher', { teacher })}
            style={styles.actionButton}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Card style={styles.infoCard}>
        <InfoRow icon="email" label="Email" value={teacher.email} onPress={() => Linking.openURL(`mailto:${teacher.email}`)} />
        <InfoRow icon="phone" label="Phone" value={teacher.phone} onPress={() => Linking.openURL(`tel:${teacher.phone}`)} />
      </Card>

      <Text style={styles.sectionTitle}>Work Details</Text>
      <Card style={styles.infoCard}>
        <InfoRow icon="business" label="Department" value={teacher.department} />
        <InfoRow icon="info" label="Status" value={teacher.status} />
      </Card>

      <Button 
        title="View Schedule" 
        icon="calendar-today"
        onPress={() => Alert.alert('Coming Soon', 'Schedule view is under development')}
        style={styles.scheduleButton}
      />
      
      <Button 
        title="Delete Teacher" 
        type="danger" 
        icon="delete"
        onPress={() => {
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this teacher?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                style: 'destructive', 
                onPress: async () => {
                  try {
                    await teacherAPI.deleteTeacher(teacher._id);
                    navigation.goBack();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to delete teacher');
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
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 24, elevation: 2 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarTextLarge: { fontSize: 36, fontWeight: '700', color: '#3B82F6' },
  nameLarge: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  subjectLarge: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  actionButtons: { flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: 'center' },
  actionButton: { marginHorizontal: 8, flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12, marginLeft: 4 },
  infoCard: { padding: 0, overflow: 'hidden', marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoContent: { flex: 1, marginLeft: 12 },
  infoLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  infoValue: { fontSize: 16, color: '#374151', marginTop: 2 },
  scheduleButton: { marginBottom: 12 },
  deleteButton: { backgroundColor: '#FEE2E2' },
});

export default TeacherDetailScreen;
