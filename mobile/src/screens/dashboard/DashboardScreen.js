import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { dashboardAPI } from '../../services/api';

const DashboardScreen = ({ navigation }) => {
  const user = useSelector(state => state.auth.user);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getSummary();
      setSummary(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.fullName}</Text>
        </View>
        <View style={styles.profileIcon}>
          <MaterialIcons name="person" size={24} color="#3B82F6" />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="school"
          label="Schools"
          value={summary?.totalSchools || 0}
          color="#3B82F6"
          onPress={() => navigation.navigate('Schools')}
        />
        <StatCard
          icon="people"
          label="Students"
          value={summary?.totalStudents || 0}
          color="#10B981"
          onPress={() => navigation.navigate('Students')}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="grade"
          label="Classes"
          value={summary?.totalClasses || 0}
          color="#F59E0B"
          onPress={() => navigation.navigate('Schools')}
        />
        <StatCard
          icon="assignment"
          label="Assignments"
          value={summary?.totalAssignments || 0}
          color="#8B5CF6"
          onPress={() => navigation.navigate('Reports')}
        />
      </View>

      {/* Performance Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.performanceCard}>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Average Attendance</Text>
            <Text style={styles.performanceValue}>{summary?.averageAttendance || 0}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${summary?.averageAttendance || 0}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.performanceCard}>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Average Grade</Text>
            <Text style={styles.performanceValue}>{summary?.averageGrade || 0}</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(summary?.averageGrade || 0) * 10}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Schools')}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Add School</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Students')}
        >
          <MaterialIcons name="person-add" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Add Student</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Teachers')}
        >
          <MaterialIcons name="person-pin" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Manage Teachers</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Attendance')}
        >
          <MaterialIcons name="event-available" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Mark Attendance</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Timetable')}
        >
          <MaterialIcons name="event-note" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>View Timetable</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Reports')}
        >
          <MaterialIcons name="assessment" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Generate Reports</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Grades')}
        >
          <MaterialIcons name="note-add" size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Upload Grades</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const StatCard = ({ icon, label, value, color, onPress }) => (
  <TouchableOpacity style={styles.statCard} onPress={onPress}>
    <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
});

export default DashboardScreen;
