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
import { teacherAPI } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

const AddEditTeacherScreen = ({ route, navigation }) => {
  const isEdit = route.name === 'EditTeacher';
  const teacherData = route.params?.teacher;

  const [formData, setFormData] = useState({
    firstName: teacherData?.firstName || '',
    lastName: teacherData?.lastName || '',
    email: teacherData?.email || '',
    phone: teacherData?.phone || '',
    subject: teacherData?.subject || '',
    department: teacherData?.department || '',
    status: teacherData?.status || 'active',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      navigation.setOptions({ title: `Edit ${teacherData.firstName}` });
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await teacherAPI.updateTeacher(teacherData._id, formData);
        Alert.alert('Success', 'Teacher updated successfully');
      } else {
        await teacherAPI.createTeacher(formData);
        Alert.alert('Success', 'Teacher created successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving teacher:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to save teacher');
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
            placeholder="Jane" 
            value={formData.firstName}
            onChangeText={(v) => updateField('firstName', v)}
            error={errors.firstName}
            containerStyle={styles.halfWidth}
          />
          <Input 
            label="Last Name *" 
            placeholder="Smith" 
            value={formData.lastName}
            onChangeText={(v) => updateField('lastName', v)}
            error={errors.lastName}
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input 
          label="Email Address *" 
          placeholder="jane.smith@example.com" 
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

        <Text style={styles.sectionTitle}>Professional Information</Text>
        
        <Input 
          label="Subject" 
          placeholder="Mathematics" 
          value={formData.subject}
          onChangeText={(v) => updateField('subject', v)}
        />

        <Input 
          label="Department" 
          placeholder="Science" 
          value={formData.department}
          onChangeText={(v) => updateField('department', v)}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Status</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(v) => updateField('status', v)}
              style={styles.picker}
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Inactive" value="inactive" />
            </Picker>
          </View>
        </View>

        <Button 
          title={isEdit ? "Update Teacher" : "Add Teacher"} 
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
  picker: {
    width: '100%',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default AddEditTeacherScreen;
