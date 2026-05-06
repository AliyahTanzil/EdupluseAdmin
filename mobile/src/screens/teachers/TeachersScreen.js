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
import { teacherAPI } from '../../services/api';
import Card from '../../components/Card';

const TeachersScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTeachers = useCallback(async (shouldRefresh = false) => {
    try {
      if (!shouldRefresh) setLoading(true);
      const params = { search: searchQuery };
      const response = await teacherAPI.getTeachers(params);
      setTeachers(response.data.teachers || response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Alert.alert('Error', 'Failed to load teachers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeachers(true);
  };

  const renderTeacherCard = ({ item }) => (
    <Card 
      onPress={() => navigation.navigate('TeacherDetails', { teacherId: item._id })}
      style={styles.teacherCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName?.[0]}{item.lastName?.[0]}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.subject}>{item.subject || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.infoBadge}>
          <MaterialIcons name="email" size={14} color="#3B82F6" />
          <Text style={styles.badgeText}>{item.email}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#DEF7EC' : '#FDE8E8' }]}>
          <Text style={[styles.statusText, { color: item.status === 'active' ? '#03543F' : '#9B1C1C' }]}>
            {item.status || 'Active'}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teachers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchTeachers()}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={teachers}
          renderItem={renderTeacherCard}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="person-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No teachers found</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTeacher')}
      >
        <MaterialIcons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  filterContainer: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12, height: 44 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  listContent: { padding: 16, paddingBottom: 80 },
  teacherCard: { padding: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#3B82F6' },
  headerInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  subject: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  infoBadge: { flexDirection: 'row', alignItems: 'center' },
  badgeText: { fontSize: 12, color: '#4B5563', marginLeft: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 12 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});

export default TeachersScreen;
