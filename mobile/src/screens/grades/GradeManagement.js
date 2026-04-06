import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gradeAPI } from '../../services/api';

const GradeManagementScreen = () => {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const navigation = useNavigation();

  const fetchGradesData = async () => {
    try {
      setLoading(true);
      const res = await gradeAPI.getGrades();
      setGrades(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch grades:', err);
      // Fallback for demo if API fails
      setGrades([
        { id: '1', studentName: 'John Doe', subject: 'Mathematics', score: 85, grade: 'A' },
        { id: '2', studentName: 'Jane Smith', subject: 'Mathematics', score: 92, grade: 'A+' },
        { id: '3', studentName: 'Robert Johnson', subject: 'Mathematics', score: 78, grade: 'B' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradesData();
  }, []);

  const renderGradeItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>{item.grade}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subjectText}>{item.subject}</Text>
        <Text style={styles.scoreText}>Score: {item.score}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grade Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Information', 'Grade entry form is coming soon!')}
        >
          <Text style={styles.addButtonText}>+ ADD GRADE</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={grades}
          keyExtractor={item => item.id}
          renderItem={renderGradeItem}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchGradesData}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No grade records found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  gradeBadge: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4338CA',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  }
});

export default GradeManagementScreen;
