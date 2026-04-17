import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Save, Bell, Shield, Database, Palette } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    schoolName: 'EduPlus School',
    schoolEmail: 'admin@school.com',
    schoolPhone: '+1-800-000-0000',
    academicYear: '2024-2025',
    timezone: 'UTC',
    language: 'English',
    notifications: true,
    emailAlerts: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    maxLoginAttempts: 5,
    sessionTimeout: 30
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">Configure your school administration system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Settings saved successfully</p>
          </div>
        )}

        {/* School Information */}
        <Card className="mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Database size={24} className="text-blue-600" />
              School Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={settings.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Email</label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={settings.schoolEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Phone</label>
                <input
                  type="tel"
                  name="schoolPhone"
                  value={settings.schoolPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* System Preferences */}
        <Card className="mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Palette size={24} className="text-purple-600" />
              System Preferences
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>UTC</option>
                  <option>EST</option>
                  <option>CST</option>
                  <option>MST</option>
                  <option>PST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell size={24} className="text-orange-600" />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Enable In-App Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emailAlerts"
                checked={settings.emailAlerts}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Enable Email Alerts</span>
            </label>
          </div>
        </Card>

        {/* Security & Backup - D-18 fix: Only show to super admin users */}
        {(user?.isSuperUser || user?.adminType === 'ceo' || user?.adminType === 'principal') && (
        <Card className="mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield size={24} className="text-red-600" />
              Security & Backup
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Maintenance Mode</span>
              <span className="text-xs text-gray-500">(Disable access for non-admins)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="autoBackup"
                checked={settings.autoBackup}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Enable Automatic Backups</span>
            </label>
            {settings.autoBackup && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
                  name="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={handleChange}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>hourly</option>
                  <option>daily</option>
                  <option>weekly</option>
                  <option>monthly</option>
                </select>
              </div>
            )}
          </div>
        </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center gap-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
