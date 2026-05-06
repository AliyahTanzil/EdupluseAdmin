import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { studentAPI, classAPI } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

const AddEditStudentScreen = ({ route, navigation }) => {
  const isEdit = route.name === 'EditStudent';
  const studentData = route.params?.student;

  const [formData, setFormData] = useState({
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    email: studentData?.email || '',
    phone: studentData?.phone || '',
    rollNumber: studentData?.rollNumber || '',
    class: studentData?.class?._id || studentData?.class || '',
    address: studentData?.address || '',
    gender: studentData?.gender || 'male',
    dateOfBirth: studentData?.dateOfBirth ? new Date(studentData.dateOfBirth).toISOString().split('T')[0] : '',
    guardianName: studentData?.guardianName || '',
    guardianPhone: studentData?.guardianPhone || '',
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchClasses();
    if (isEdit) {
      navigation.setOptions({ title: `Edit ${studentData.firstName}` });
    }
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

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await studentAPI.updateStudent(studentData._id, formData);
        Alert.alert('Success', 'Student updated successfully');
      } else {
        await studentAPI.createStudent(formData);
        Alert.alert('Success', 'Student created successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving student:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (fetchingClasses) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.row}>
          <Input 
            label="First Name *" 
            placeholder="John" 
            value={formData.firstName}
            onChangeText={(v) => updateField('firstName', v)}
            error={errors.firstName}
            containerStyle={styles.halfWidth}
          />
          <Input 
            label="Last Name *" 
            placeholder="Doe" 
            value={formData.lastName}
            onChangeText={(v) => updateField('lastName', v)}
            error={errors.lastName}
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input 
          label="Email Address" 
          placeholder="john.doe@example.com" 
          value={formData.email}
          onChangeText={(v) => updateField('email', v)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input 
          label="Phone Number" 
          placeholder="+1 234 567 890" 
          value={formData.phone}
          onChangeText={(v) => updateField('phone', v)}
          keyboardType="phone-pad"
        />

        <View style={styles.row}>
          <Input 
            label="Roll Number" 
            placeholder="101" 
            value={formData.rollNumber}
            onChangeText={(v) => updateField('rollNumber', v)}
            containerStyle={styles.halfWidth}
          />
          <View style={[styles.pickerContainer, styles.halfWidth]}>
            <Text style={styles.pickerLabel}>Class *</Text>
            <View style={[styles.pickerWrapper, errors.class && styles.pickerError]}>
              <Picker
                selectedValue={formData.class}
                onValueChange={(v) => updateField('class', v)}
                style={styles.picker}
              >
                <Picker.Item label="Select Class" value="" />
                {classes.map(c => (
                  <Picker.Item key={c._id} label={c.name} value={c._id} />
                ))}
              </Picker>
            </View>
            {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Additional Details</Text>
        
        <View style={styles.row}>
          <View style={[styles.pickerContainer, styles.halfWidth]}>
            <Text style={styles.pickerLabel}>Gender</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(v) => updateField('gender', v)}
                style={styles.picker}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>
          <Input 
            label="Date of Birth" 
            placeholder="YYYY-MM-DD" 
            value={formData.dateOfBirth}
            onChangeText={(v) => updateField('dateOfBirth', v)}
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input 
          label="Home Address" 
          placeholder="123 Street, City" 
          value={formData.address}
          onChangeText={(v) => updateField('address', v)}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.sectionTitle}>Guardian Information</Text>
        <Input 
          label="Guardian Name" 
          placeholder="Jane Doe" 
          value={formData.guardianName}
          onChangeText={(v) => updateField('guardianName', v)}
        />
        <Input 
          label="Guardian Phone" 
          placeholder="+1 234 567 890" 
          value={formData.guardianPhone}
          onChangeText={(v) => updateField('guardianPhone', v)}
          keyboardType="phone-pad"
        />

        <Button 
          title={isEdit ? "Update Student" : "Add Student"} 
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
    justifyContent: 'center',
  },
  pickerError: {
    borderColor: '#EF4444',
  },
  picker: {
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddEditStudentScreen;
