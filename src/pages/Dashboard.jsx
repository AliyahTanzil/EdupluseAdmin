import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard, Button } from '../components/Shared';
import { Users, UserCheck, BookOpen, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = [
    { 
      title: 'Total Students', 
      value: '1,250', 
      icon: Users,
      trend: { positive: true, value: 5, label: 'vs last month' },
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Total Teachers', 
      value: '85', 
      icon: UserCheck,
      trend: { positive: true, value: 2, label: 'vs last month' },
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Active Courses', 
      value: '42', 
      icon: BookOpen,
      trend: { positive: false, value: 3, label: 'vs last month' },
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      title: 'Today\'s Attendance', 
      value: '95%', 
      icon: CheckCircle,
      trend: { positive: true, value: 1, label: 'vs yesterday' },
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card elevation="lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>
              <span className="text-gray-700">Student John Doe checked in at 8:30 AM</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
              <span className="text-gray-700">New course "Advanced Math" added</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
              <span className="text-gray-700">Teacher meeting scheduled for tomorrow</span>
            </li>
          </ul>
        </Card>
        <Card elevation="lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/add-student')}>
              Add New Student
            </Button>
            <Button variant="success" fullWidth onClick={() => navigate('/generate-report')}>
              Generate Report
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/edit-timetable')}>
              Manage Timetable
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;