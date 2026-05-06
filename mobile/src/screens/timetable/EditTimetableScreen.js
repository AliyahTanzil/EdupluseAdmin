import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { timetableAPI } from '../../services/api';
import Button from '../../components/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', 
  '11:00 - 12:00', '12:00 - 01:00', '01:00 - 02:00',
  '02:00 - 03:00', '03:00 - 04:00'
];

const EditTimetableScreen = ({ route, navigation }) => {
  const { classId, currentTimetable } = route.params;
  
  // Initialize schedule from currentTimetable or empty
  const [schedule, setSchedule] = useState(() => {
    const initial = {};
    DAYS.forEach(day => {
      initial[day] = {};
      TIME_SLOTS.forEach(slot => {
        const dayData = currentTimetable?.schedule?.find(d => d.day === day);
        const slotData = dayData?.slots?.find(s => s.time === slot);
        initial[day][slot] = slotData?.subject || '';
      });
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);

  const handleUpdateSlot = (day, slot, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedSchedule = DAYS.map(day => ({
        day,
        slots: TIME_SLOTS.map(slot => ({
          time: slot,
          subject: schedule[day][slot]
        })).filter(s => s.subject.trim() !== '')
      }));

      await timetableAPI.updateTimetable(classId, { schedule: formattedSchedule });
      Alert.alert('Success', 'Timetable updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving timetable:', error);
      Alert.alert('Error', 'Failed to save timetable');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {DAYS.map(day => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day}</Text>
            {TIME_SLOTS.map(slot => (
              <View key={slot} style={styles.slotRow}>
                <Text style={styles.slotTime}>{slot}</Text>
                <TextInput
                  style={styles.slotInput}
                  placeholder="Subject name"
                  value={schedule[day][slot]}
                  onChangeText={(v) => handleUpdateSlot(day, slot, v)}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          title="Save Timetable" 
          onPress={handleSave} 
          loading={saving}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  daySection: { backgroundColor: '#FFFFFF', marginBottom: 16, padding: 16 },
  dayTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 8 },
  slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  slotTime: { width: 100, fontSize: 12, color: '#6B7280' },
  slotInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#D1D5DB', paddingVertical: 4, fontSize: 14, color: '#374151' },
  footer: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});

export default EditTimetableScreen;
