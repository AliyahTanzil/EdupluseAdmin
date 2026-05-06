import React, { useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { userAPI } from '../../services/api';
import { setAuth } from '../../redux/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(formData);
      const updatedUser = response.data.user || response.data;
      
      // Update Redux state
      dispatch(setAuth({
        user: updatedUser,
        token,
        isAuthenticated: true,
      }));

      // Update AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
          </View>
          <Text style={styles.roleText}>{user?.role || user?.adminType || 'Administrator'}</Text>
        </View>

        <Input 
          label="First Name" 
          value={formData.firstName}
          onChangeText={(v) => setFormData(prev => ({ ...prev, firstName: v }))}
        />

        <Input 
          label="Last Name" 
          value={formData.lastName}
          onChangeText={(v) => setFormData(prev => ({ ...prev, lastName: v }))}
        />

        <Input 
          label="Email Address" 
          value={formData.email}
          editable={false} // Email usually not editable in profile edit
          containerStyle={styles.disabledInput}
        />

        <Input 
          label="Phone Number" 
          value={formData.phone}
          onChangeText={(v) => setFormData(prev => ({ ...prev, phone: v }))}
          keyboardType="phone-pad"
        />

        <Button 
          title="Save Changes" 
          onPress={handleUpdate} 
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
  roleText: { fontSize: 14, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  disabledInput: { opacity: 0.7 },
  saveButton: { marginTop: 20 },
});

export default ProfileScreen;
