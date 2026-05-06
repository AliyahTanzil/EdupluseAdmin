import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  FlatList
} from 'react-native';
import { studentAPI, gradesAPI } from '../../services/api';
import Card from '../../components/Card';

const StudentReportCardScreen = ({ route }) => {
  const { studentId } = route.params;
  const [report, setReport] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [studentId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const [studentRes, reportRes] = await Promise.all([
        studentAPI.getStudentById(studentId),
        gradesAPI.getStudentReportCard(studentId)
      ]);
      setStudent(studentRes.data.student || studentRes.data);
      setReport(reportRes.data.reportCard || reportRes.data);
    } catch (error) {
      console.error('Error fetching report card:', error);
      Alert.alert('Error', 'Failed to load report card');
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

  const renderSubjectGrade = ({ item }) => (
    <View style={styles.gradeRow}>
      <Text style={styles.subjectName}>{item.subject?.name || item.subject}</Text>
      <View style={styles.gradeBadge}>
        <Text style={styles.gradeText}>{item.grade}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <Text style={styles.studentName}>{student?.firstName} {student?.lastName}</Text>
        <Text style={styles.infoText}>Class: {student?.class?.name || 'N/A'}</Text>
        <Text style={styles.infoText}>Roll No: {student?.rollNumber || 'N/A'}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Academic Performance</Text>
      <Card style={styles.reportCard}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>GPA</Text>
            <Text style={styles.summaryValue}>{report?.gpa || 'N/A'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Attendance</Text>
            <Text style={styles.summaryValue}>{report?.attendancePercentage || 0}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rank</Text>
            <Text style={styles.summaryValue}>{report?.rank || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <Text style={styles.gradesTitle}>Subject-wise Grades</Text>
        <FlatList
          data={report?.subjectGrades || []}
          renderItem={renderSubjectGrade}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No grades recorded yet</Text>}
        />
      </Card>

      <View style={styles.remarksContainer}>
        <Text style={styles.remarksTitle}>General Remarks</Text>
        <Text style={styles.remarksText}>
          {report?.remarks || "Keep working hard and maintain consistent performance across all subjects."}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { padding: 20, alignItems: 'center', backgroundColor: '#3B82F6', marginBottom: 20 },
  studentName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#E0F2FE' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12 },
  reportCard: { padding: 16, marginBottom: 20 },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  gradesTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
  gradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  subjectName: { fontSize: 15, color: '#4B5563' },
  gradeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: '#EFF6FF' },
  gradeText: { color: '#3B82F6', fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic', marginVertical: 20 },
  remarksContainer: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderColor: '#E5E7EB', borderWidth: 1 },
  remarksTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  remarksText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
});

export default StudentReportCardScreen;
