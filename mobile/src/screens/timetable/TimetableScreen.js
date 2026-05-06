import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { timetableAPI, classAPI } from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import Card from '../../components/Card';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', 
  '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00',
  '02:00 - 03:00', '03:00 - 04:00'
];

const TimetableScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getClasses();
      setClasses(response.data.classes || response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setFetchingClasses(false);
    }
  };

  const fetchTimetable = async (classId) => {
    if (!classId) return;
    try {
      setLoading(true);
      const response = await timetableAPI.getTimetable(classId);
      setTimetable(response.data.timetable || response.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      // If 404, it might just mean no timetable yet
      setTimetable(null);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectForSlot = (day, slot) => {
    if (!timetable || !timetable.schedule) return null;
    const daySchedule = timetable.schedule.find(d => d.day === day);
    if (!daySchedule) return null;
    const slotData = daySchedule.slots.find(s => s.time === slot);
    return slotData ? slotData.subject : null;
  };

  if (fetchingClasses) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Select Class</Text>
          <View style={styles.pickerBorder}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={(v) => {
                setSelectedClass(v);
                fetchTimetable(v);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Choose a class..." value="" />
              {classes.map(c => (
                <Picker.Item key={c._id} label={c.name} value={c._id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {selectedClass ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <ScrollView horizontal>
            <View>
              {/* Header Row (Days) */}
              <View style={styles.row}>
                <View style={[styles.cell, styles.timeHeader]}>
                  <Text style={styles.headerText}>Time</Text>
                </View>
                {DAYS.map(day => (
                  <View key={day} style={[styles.cell, styles.dayHeader]}>
                    <Text style={styles.headerText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Time Slots Rows */}
              <ScrollView>
                {TIME_SLOTS.map(slot => (
                  <View key={slot} style={styles.row}>
                    <View style={[styles.cell, styles.timeCell]}>
                      <Text style={styles.timeText}>{slot}</Text>
                    </View>
                    {DAYS.map(day => {
                      const subject = getSubjectForSlot(day, slot);
                      return (
                        <View key={`${day}-${slot}`} style={[styles.cell, styles.subjectCell]}>
                          <Text style={styles.subjectText}>{subject || '-'}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event-note" size={60} color="#D1D5DB" />
          <Text style={styles.emptyText}>Select a class to view its timetable</Text>
        </View>
      )}

      {selectedClass && !loading && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('EditTimetable', { classId: selectedClass, currentTimetable: timetable })}
        >
          <MaterialIcons name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  pickerWrapper: { width: '100%' },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4, textTransform: 'uppercase' },
  pickerBorder: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, backgroundColor: '#F9FAFB', height: 44, justifyContent: 'center' },
  picker: { width: '100%' },
  row: { flexDirection: 'row' },
  cell: { width: 120, height: 60, padding: 8, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  timeHeader: { backgroundColor: '#F9FAFB', width: 100 },
  dayHeader: { backgroundColor: '#EFF6FF' },
  headerText: { fontWeight: '700', color: '#1F2937', fontSize: 12 },
  timeCell: { backgroundColor: '#F9FAFB', width: 100 },
  timeText: { fontSize: 10, color: '#6B7280', textAlign: 'center' },
  subjectCell: { backgroundColor: '#FFFFFF' },
  subjectText: { fontSize: 13, fontWeight: '500', color: '#374151', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginTop: 12 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});

export default TimetableScreen;
