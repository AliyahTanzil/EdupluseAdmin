import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentAPI, classAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const StudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchStudents = useCallback(async (pageNum = 1, shouldRefresh = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      
      const params = {
        offset: (pageNum - 1) * 20,
        limit: 20,
        search: searchQuery,
        class: selectedClass,
      };

      const response = await studentAPI.getStudents(params);
      const newStudents = response.data.data || response.data.students || response.data; // Handle different API response structures

      if (shouldRefresh || pageNum === 1) {
        setStudents(newStudents);
      } else {
        setStudents(prev => [...prev, ...newStudents]);
      }

      setHasMore(newStudents.length === 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getClasses();
      const classesData = response.data.data || response.data.classes || response.data;
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchStudents(1);
    fetchClasses();
  }, [fetchStudents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchStudents(page + 1);
    }
  };

  const renderStudentCard = ({ item }) => (
    <Card 
      onPress={() => navigation.navigate('StudentDetails', { studentId: item.id })}
      style={styles.studentCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName?.[0]}{item.lastName?.[0]}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.rollNumber}>Roll No: {item.rollNumber || 'N/A'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => Alert.alert(
            'Actions', 
            `Manage ${item.firstName}`,
            [
              { text: 'View', onPress: () => navigation.navigate('StudentDetails', { studentId: item.id }) },
              { text: 'Edit', onPress: () => navigation.navigate('EditStudent', { student: item }) },
              { text: 'Delete', onPress: () => handleDelete(item.id), style: 'destructive' },
              { text: 'Cancel', style: 'cancel' }
            ]
          )}
        >
          <MaterialIcons name="more-vert" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.infoBadge}>
          <MaterialIcons name="class" size={14} color="#3B82F6" />
          <Text style={styles.badgeText}>{item.class?.name || 'Unassigned'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#DEF7EC' : '#FDE8E8' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#03543F' : '#9B1C1C' }]}>
            {item.status || 'Active'}
          </Text>
        </View>
      </View>
    </Card>
  );

  const handleDelete = (id) => {
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
              await studentAPI.deleteStudent(id);
              setStudents(students.filter(s => s._id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete student');
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchStudents(1)}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); fetchStudents(1); }}>
              <MaterialIcons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Class Filter - Simple scroll horizontal list */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: 'All' }, ...classes]}
          keyExtractor={item => item.name || 'all'}
          contentContainerStyle={styles.classFilterList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.classBadge, 
                selectedClass === (item.name === 'All' ? null : item.name) && styles.selectedClassBadge
              ]}
              onPress={() => {
                setSelectedClass(item.name === 'All' ? null : item.name);
                fetchStudents(1);
              }}
            >
              <Text style={[
                styles.classBadgeText,
                selectedClass === (item.name === 'All' ? null : item.name) && styles.selectedClassBadgeText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && students.length > 0 ? (
              <ActivityIndicator style={{ marginVertical: 20 }} color="#3B82F6" />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No students found</Text>
            </View>
          }
        />
      )}

      {/* FAB to add student */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddStudent')}
      >
        <MaterialIcons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  classFilterList: {
    paddingVertical: 4,
  },
  classBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedClassBadge: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  classBadgeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedClassBadgeText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  studentCard: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  rollNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default StudentsScreen;
