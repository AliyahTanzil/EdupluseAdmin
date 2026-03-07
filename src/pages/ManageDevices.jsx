import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2, Power, Wifi, WifiOff } from 'lucide-react';

const ManageDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Main Gate Entry',
      type: 'Biometric Scanner',
      ipAddress: '192.168.1.100',
      status: 'online',
      lastSync: '2024-01-22 10:30 AM',
      students: 150,
    },
    {
      id: 2,
      name: 'Exit Gate',
      type: 'Biometric Scanner',
      ipAddress: '192.168.1.101',
      status: 'online',
      lastSync: '2024-01-22 10:28 AM',
      students: 145,
    },
    {
      id: 3,
      name: 'Classroom 1',
      type: 'RFID Reader',
      ipAddress: '192.168.1.102',
      status: 'offline',
      lastSync: '2024-01-22 08:15 AM',
      students: 35,
    },
    {
      id: 4,
      name: 'Classroom 2',
      type: 'RFID Reader',
      ipAddress: '192.168.1.103',
      status: 'online',
      lastSync: '2024-01-22 10:25 AM',
      students: 40,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'Biometric Scanner',
    ipAddress: '',
  });

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.ipAddress) {
      setDevices([
        ...devices,
        {
          id: devices.length + 1,
          ...newDevice,
          status: 'offline',
          lastSync: 'Never',
          students: 0,
        },
      ]);
      setNewDevice({ name: '', type: 'Biometric Scanner', ipAddress: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const handleToggleDevice = (id) => {
    setDevices(
      devices.map((d) =>
        d.id === id ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } : d
      )
    );
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Manage Biometric Devices</h1>
          <p className="text-gray-600 mt-2">Configure and monitor attendance devices</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add Device
        </Button>
      </div>

      {/* Device Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Devices</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{devices.length}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Online</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {devices.filter((d) => d.status === 'online').length}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Offline</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {devices.filter((d) => d.status === 'offline').length}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Students Tracked</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {devices.reduce((sum, d) => sum + d.students, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Devices Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Connected Devices</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Device Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Address</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Sync</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Students</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{device.name}</td>
                    <td className="py-3 px-4 text-gray-600">{device.type}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono">{device.ipAddress}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center gap-1 ${
                          device.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {device.status === 'online' ? (
                          <Wifi size={14} />
                        ) : (
                          <WifiOff size={14} />
                        )}
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{device.lastSync}</td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-800">{device.students}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleToggleDevice(device.id)}
                        className="text-blue-600 hover:text-blue-800 inline-block"
                        title={device.status === 'online' ? 'Take Offline' : 'Bring Online'}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="text-red-600 hover:text-red-800 inline-block"
                        title="Delete Device"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Add Device Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Device"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
            <input
              type="text"
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              placeholder="e.g., Main Gate Entry"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
            <select
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Biometric Scanner</option>
              <option>RFID Reader</option>
              <option>Face Recognition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
            <input
              type="text"
              value={newDevice.ipAddress}
              onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
              placeholder="e.g., 192.168.1.100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddDevice}
            >
              Add Device
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageDevices;
