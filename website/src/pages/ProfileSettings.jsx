import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1-800-123-4567',
    address: user?.address || '123 Education Street, School City',
    department: user?.department || 'Administration',
    joinDate: user?.joinDate || '2023-01-15',
    bio: 'Educational Administrator'
  });

  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would update profile in backend
    console.log('Profile updated:', profile);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    setProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+1-800-123-4567',
      address: user?.address || '123 Education Street, School City',
      department: user?.department || 'Administration',
      joinDate: user?.joinDate || '2023-01-15',
      bio: 'Educational Administrator'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Profile updated successfully</p>
          </div>
        )}

        {/* Profile Header Card */}
        <Card className="mb-6">
          <div className="p-6 flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.department}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> Joined {profile.joinDate}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {user?.role === 'admin' && user?.isSuperUser ? 'Super Admin' : user?.role}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User size={24} className="text-blue-600" />
              Personal Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled={true}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase size={16} /> Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Address
                </label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="2"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !editing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Account Status</p>
                <p className="text-sm text-gray-600">Your account is active and verified</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Super Admin Status</p>
                <p className="text-sm text-gray-600">Full access to all system features</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">✓ Enabled</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          {editing && (
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </Button>
            </>
          )}
          {!editing && (
            <Button
              variant="secondary"
              onClick={() => navigate('/admin-dashboard')}
            >
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
