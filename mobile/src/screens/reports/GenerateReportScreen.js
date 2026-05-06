import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { reportAPI, classAPI } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

const GenerateReportScreen = ({ route, navigation }) => {
  const { type } = route.params;
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    type,
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    class: '',
  });

  useEffect(() => {
    fetchClasses();
    navigation.setOptions({ title: `Generate ${type.charAt(0).toUpperCase() + type.slice(1)} Report` });
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getClasses();
      setClasses(response.data.classes || response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await reportAPI.generateReport(formData);
      Alert.alert('Success', 'Report generation started. It will appear in recent reports once ready.');
      navigation.goBack();
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Report Parameters</Text>
      
      <Input 
        label="Start Date" 
        value={formData.startDate}
        onChangeText={(v) => setFormData(prev => ({ ...prev, startDate: v }))}
        placeholder="YYYY-MM-DD"
      />

      <Input 
        label="End Date" 
        value={formData.endDate}
        onChangeText={(v) => setFormData(prev => ({ ...prev, endDate: v }))}
        placeholder="YYYY-MM-DD"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Class (Optional)</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.class}
            onValueChange={(v) => setFormData(prev => ({ ...prev, class: v }))}
            style={styles.picker}
          >
            <Picker.Item label="All Classes" value="" />
            {classes.map(c => (
              <Picker.Item key={c._id} label={c.name} value={c._id} />
            ))}
          </Picker>
        </View>
      </View>

      <Button 
        title="Generate Report" 
        onPress={handleGenerate} 
        loading={loading}
        style={styles.generateButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 20 },
  title: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 20 },
  pickerContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  pickerWrapper: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', height: 48, justifyContent: 'center' },
  picker: { width: '100%' },
  generateButton: { marginTop: 20 },
});

export default GenerateReportScreen;
