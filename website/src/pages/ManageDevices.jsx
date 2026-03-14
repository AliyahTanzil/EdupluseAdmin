import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit, Trash2, Power, Wifi, WifiOff } from 'lucide-react';
import { devicesAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const ManageDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Biometric Scanner',
    model: '',
    deviceId: '',
    ipAddress: '',
    status: 'online'
  });

  // Fetch devices on mount and when page changes
  useEffect(() => {
    loadDevices();
  }, [page]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await devicesAPI.getAll({
        limit: pageSize,
        offset: page * pageSize
      });
      
      if (response.success) {
        setDevices(response.data || []);
      } else {
        setError(response.message || 'Failed to load devices');
        setDevices([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading devices');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await devicesAPI.delete(id);
      if (response.success) {
        setDevices(devices.filter(d => d.id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to delete device');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the device');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'online' ? 'offline' : 'online';
      const response = await devicesAPI.update(id, { status: newStatus });
      
      if (response.success) {
        setDevices(devices.map(d => 
          d.id === id ? { ...d, status: newStatus } : d
        ));
      } else {
        setError(response.message || 'Failed to update device status');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the device');
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name || !formData.deviceId || !formData.model) {
        setError('Please fill all required fields (Name, Device ID, Model)');
        setLoading(false);
        return;
      }

      const response = await devicesAPI.create(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          type: 'Biometric Scanner',
          model: '',
          deviceId: '',
          ipAddress: '',
          status: 'online'
        });
        setShowModal(false);
        loadDevices();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to add device');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding the device');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && devices.length === 0) return <LoadingSpinner message="Loading devices..." />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Operation completed successfully!" onClose={() => setSuccess(false)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Devices</h1>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add New Device
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Devices</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{devices.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Online</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{devices.filter(d => d.status === 'online').length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Offline</p>
            <p className="text-4xl font-bold text-red-600 mt-2">{devices.filter(d => d.status === 'offline').length}</p>
          </div>
        </Card>
      </div>

      {/* Devices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Device Name</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Device ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Model</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-6">{device.name}</td>
                  <td className="py-4 px-6">{device.deviceId}</td>
                  <td className="py-4 px-6">{device.model}</td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {device.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm w-fit ${
                      device.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status === 'online' ? (
                        <Wifi size={14} />
                      ) : (
                        <WifiOff size={14} />
                      )}
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusToggle(device.id, device.status)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Toggle Status"
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(device.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Delete Device"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {devices.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, devices.length)} of {devices.length}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage(page + 1)}
            disabled={devices.length < pageSize}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Device Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Device</h2>
              
              <form onSubmit={handleAddDevice} className="space-y-6">
                {/* Row 1: Name and Device ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Main Gate Entry"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="deviceId"
                      value={formData.deviceId}
                      onChange={handleChange}
                      placeholder="e.g., DEV-001"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Row 2: Model and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., ZKTeco F22"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Biometric Scanner">Biometric Scanner</option>
                      <option value="RFID Reader">RFID Reader</option>
                      <option value="Face Recognition">Face Recognition</option>
                      <option value="Card Reader">Card Reader</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* IP Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    placeholder="e.g., 192.168.1.100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button type="submit" variant="primary" className="flex-1">
                    Add Device
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageDevices;
