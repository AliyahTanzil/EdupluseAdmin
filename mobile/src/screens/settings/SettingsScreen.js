import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Switch
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            dispatch(clearAuth());
          } 
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, toggle, value, onToggle }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={toggle}
    >
      <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
        <MaterialIcons name={icon} size={22} color="#4B5563" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch value={value} onValueChange={onToggle} />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.firstName?.[0]}{user?.lastName?.[0]}</Text>
        </View>
        <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <Card style={styles.card}>
          <SettingItem 
            icon="lock" 
            title="Security" 
            subtitle="Change password, 2FA" 
            onPress={() => Alert.alert('Coming Soon', 'Security settings are under development')} 
          />
          <SettingItem 
            icon="notifications" 
            title="Notifications" 
            toggle 
            value={notifications} 
            onToggle={setNotifications} 
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Appearance</Text>
        <Card style={styles.card}>
          <SettingItem 
            icon="palette" 
            title="Dark Mode" 
            toggle 
            value={darkMode} 
            onToggle={setDarkMode} 
          />
          <SettingItem 
            icon="translate" 
            title="Language" 
            subtitle="English (US)" 
            onPress={() => {}} 
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>About</Text>
        <Card style={styles.card}>
          <SettingItem 
            icon="help-outline" 
            title="Help & Support" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon="info-outline" 
            title="About EduPlus" 
            subtitle="Version 1.0.0" 
            onPress={() => {}} 
          />
        </Card>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>© 2026 EduPlus Management System</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  profileSection: { alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#3B82F6' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  profileEmail: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  editButton: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#3B82F6' },
  editButtonText: { color: '#3B82F6', fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#9CA3AF', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  card: { padding: 0, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  iconContainer: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '500', color: '#374151' },
  settingSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginHorizontal: 16, borderRadius: 12, backgroundColor: '#FEE2E2', marginBottom: 12 },
  logoutText: { marginLeft: 8, color: '#EF4444', fontWeight: '700', fontSize: 16 },
  footerText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginBottom: 20 },
});

export default SettingsScreen;
