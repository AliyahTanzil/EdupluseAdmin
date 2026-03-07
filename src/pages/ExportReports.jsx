import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Download, FileText, PieChart, BarChart3, TrendingUp } from 'lucide-react';

const ExportReports = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });

  const reports = [
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Export daily/weekly/monthly attendance records',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Student performance and grades',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'summary',
      name: 'Summary Report',
      description: 'Overall class and student summary',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'analytics',
      name: 'Analytics Report',
      description: 'Detailed analytics and insights',
      icon: PieChart,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const handleExport = (format) => {
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}`);
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Export Reports</h1>
        <p className="text-gray-600">Generate and download various reports in multiple formats</p>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all ${
                selectedReport === report.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${report.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Export Options */}
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Export Options</h2>

          {/* Date Range */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Select Date Range</h3>
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

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Select Export Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
                <Button
                  key={format}
                  variant="secondary"
                  fullWidth
                  className="py-3"
                  onClick={() => handleExport(format)}
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Include detailed breakdown</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-gray-700">Include charts and graphs</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Send to email</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="primary" className="flex-1 flex items-center justify-center gap-2">
              <Download size={18} />
              Download Report
            </Button>
            <Button variant="secondary" className="flex-1">
              Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExportReports;
