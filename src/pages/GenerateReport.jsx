import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Download, BarChart3, TrendingUp, PieChart, Calendar } from 'lucide-react';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  const [selectedClass, setSelectedClass] = useState('all');

  const reportTypes = [
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Student and teacher attendance analysis',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Student grades and academic performance',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Fee collection and financial summary',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'analytics',
      name: 'Analytics Report',
      description: 'Comprehensive data analytics',
      icon: PieChart,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const classes = ['All Classes', '9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  const handleGenerateReport = (format) => {
    alert(`Generating ${reportType} report in ${format.toUpperCase()} format...`);
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

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Generate Reports</h1>
        <p className="text-gray-600">Create comprehensive reports for analysis and record keeping</p>
      </div>

      {/* Report Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all ${
                  reportType === report.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setReportType(report.id)}
              >
                <div className="p-6 text-center">
                  <div className={`bg-gradient-to-r ${report.color} p-4 rounded-lg text-white inline-block mb-3`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{report.name}</h3>
                  <p className="text-xs text-gray-600 mt-2">{report.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Report Configuration */}
      <Card className="mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Configuration</h2>

          {/* Date Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Class Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Select Class</h3>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {classes.map(cls => (
                <option key={cls} value={cls.toLowerCase()}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Report Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Include Summary</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-700">Include Charts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Include Detailed Data</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-700">Email Report</span>
              </label>
            </div>
          </div>

          {/* Export Formats */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Export Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['PDF', 'Excel', 'CSV', 'Print'].map((format) => (
                <Button
                  key={format}
                  variant="secondary"
                  fullWidth
                  className="py-3"
                  onClick={() => handleGenerateReport(format)}
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1 flex items-center justify-center gap-2">
              <Download size={18} />
              Generate Report
            </Button>
            <Button variant="secondary" className="flex-1">
              Preview
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Attendance Report - January 2024</p>
                  <p className="text-sm text-gray-600">Generated on Jan 31, 2024</p>
                </div>
                <Button variant="secondary" className="text-sm py-2">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GenerateReport;
