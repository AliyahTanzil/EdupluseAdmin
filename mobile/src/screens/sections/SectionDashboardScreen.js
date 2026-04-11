import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { classAPI } from '../../services/api';

// Maps sectionId → default class names for that section
const SECTION_CLASS_MAP = {
  nursery: ['Nursery 1', 'Nursery 2', 'Nursery 3'],
  primary: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
  junior_secondary: ['JSS 1', 'JSS 2', 'JSS 3'],
  senior_secondary: ['SSS 1', 'SSS 2', 'SSS 3'],
};

const SectionDashboardScreen = ({ route, navigation }) => {
  const { section } = route.params; // { id, label, icon, color, bgColor, description }
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await classAPI.getClasses({ section: section.id });
      setClasses(response.data || []);
    } catch (error) {
      // If the API is not yet available, show placeholder classes
      console.log('Using placeholder classes:', error.message);
      const placeholders = (SECTION_CLASS_MAP[section.id] || []).map(
        (name, index) => ({
          id: `placeholder-${index}`,
          name,
          section: section.id,
          studentCount: 0,
          placeholder: true,
        })
      );
      setClasses(placeholders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [section.id]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Re-fetch when coming back from CreateClass
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClasses();
    });
    return unsubscribe;
  }, [navigation, fetchClasses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const handleClassPress = (cls) => {
    if (cls.placeholder) {
      Alert.alert(
        'No Data Yet',
        `${cls.name} has no students enrolled. Create or manage this class first.`
      );
      return;
    }
    // Navigate to class detail in the future
    Alert.alert(cls.name, `Students: ${cls.studentCount || 0}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={section.color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: section.bgColor }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={section.color} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialIcons name={section.icon} size={32} color={section.color} />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: section.color }]}>
              {section.label}
            </Text>
            <Text style={styles.headerSubtitle}>{section.description}</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{classes.length}</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {classes.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {classes.filter((c) => !c.placeholder).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Classes List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Classes</Text>
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: section.color }]}
          onPress={() =>
            navigation.navigate('CreateClass', { section })
          }
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Create Class</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="class" size={56} color="#D1D5DB" />
            <Text style={styles.emptyText}>No classes yet</Text>
            <Text style={styles.emptySubtext}>
              Tap "Create Class" to add one
            </Text>
          </View>
        ) : (
          classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.classCard}
              activeOpacity={0.7}
              onPress={() => handleClassPress(cls)}
            >
              <View
                style={[
                  styles.classIcon,
                  { backgroundColor: section.bgColor },
                ]}
              >
                <MaterialIcons
                  name="class"
                  size={24}
                  color={section.color}
                />
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classMeta}>
                  {cls.studentCount || 0} students
                  {cls.teacher ? ` · ${cls.teacher}` : ''}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

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
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  classMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
});

export default SectionDashboardScreen;
