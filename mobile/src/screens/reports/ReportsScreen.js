import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { reportAPI } from '../../services/api';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportTypes = [
    { id: 'attendance', title: 'Attendance Report', icon: 'event-available', color: '#10B981' },
    { id: 'grades', title: 'Grades Report', icon: 'grade', color: '#F59E0B' },
    { id: 'performance', title: 'Performance Report', icon: 'trending-up', color: '#3B82F6' },
    { id: 'financial', title: 'Financial Report', icon: 'attach-money', color: '#EF4444' },
  ];

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const fetchRecentReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getReports();
      setReports(response.data.reports || response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReportType = ({ item }) => (
    <TouchableOpacity 
      style={styles.reportTypeCard}
      onPress={() => navigation.navigate('GenerateReport', { type: item.id })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialIcons name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.reportTypeTitle}>{item.title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
    </TouchableOpacity>
  );

  const renderRecentReport = ({ item }) => (
    <Card style={styles.recentReportCard}>
      <View style={styles.recentReportInfo}>
        <Text style={styles.recentReportName}>{item.name}</Text>
        <Text style={styles.recentReportDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => Alert.alert('Download', 'Downloading report...')}>
        <MaterialIcons name="file-download" size={24} color="#3B82F6" />
      </TouchableOpacity>
    </Card>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Generate New Report</Text>
      <FlatList
        data={reportTypes}
        renderItem={renderReportType}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />

      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Recent Reports</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#3B82F6" />
      ) : reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderRecentReport}
          keyExtractor={item => item._id}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent reports found</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 16 },
  reportTypeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  reportTypeTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1F2937' },
  recentReportCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 8 },
  recentReportInfo: { flex: 1 },
  recentReportName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  recentReportDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  emptyContainer: { alignItems: 'center', padding: 20 },
  emptyText: { color: '#9CA3AF' },
});

export default ReportsScreen;
