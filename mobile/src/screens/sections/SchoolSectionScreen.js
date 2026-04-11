import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const SECTIONS = [
  {
    id: 'nursery',
    label: 'Nursery',
    icon: 'child-care',
    color: '#EC4899',
    bgColor: '#FDF2F8',
    description: 'Early years education',
  },
  {
    id: 'primary',
    label: 'Primary',
    icon: 'menu-book',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    description: 'Primary school classes',
  },
  {
    id: 'junior_secondary',
    label: 'Junior Secondary',
    icon: 'school',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'JSS 1 – JSS 3',
  },
  {
    id: 'senior_secondary',
    label: 'Senior Secondary',
    icon: 'science',
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'SSS 1 – SSS 3',
  },
];

const SchoolSectionScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);

  const handleSectionPress = (section) => {
    navigation.navigate('SectionDashboard', { section });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Admin'}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('DashboardStack')}
        >
          <MaterialIcons name="apps" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select a School Section</Text>
        <Text style={styles.subtitle}>
          Choose which section you'd like to manage
        </Text>
      </View>

      {/* Section Cards */}
      <View style={styles.grid}>
        {SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleSectionPress(section)}
          >
            <View style={[styles.iconCircle, { backgroundColor: section.bgColor }]}>
              <MaterialIcons name={section.icon} size={36} color={section.color} />
            </View>
            <Text style={styles.cardLabel}>{section.label}</Text>
            <Text style={styles.cardDescription}>{section.description}</Text>
            <View style={[styles.arrowBadge, { backgroundColor: section.bgColor }]}>
              <MaterialIcons name="arrow-forward" size={18} color={section.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  arrowBadge: {
    marginTop: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SchoolSectionScreen;
