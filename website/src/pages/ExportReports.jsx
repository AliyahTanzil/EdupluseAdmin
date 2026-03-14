import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Download, FileText, PieChart, BarChart3, TrendingUp, Loader } from 'lucide-react';
import { reportsAPI, classesAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const ExportReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [selectedReport, setSelectedReport] = useState('attendance');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [exportOptions, setExportOptions] = useState({
    includeBreakdown: true,
    includeCharts: true,
    sendEmail: false,
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classesAPI.getAll({ limit: 100, offset: 0 });
      if (response.success) {
        setClasses(response.data || []);
      } else {
        setError(response.message || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Error loading classes:', err);
    }
  };

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

  const handleExport = async (format) => {
    try {
      setExporting(true);
      setError(null);

      // Validate date range
      if (new Date(dateRange.start) > new Date(dateRange.end)) {
        setError('Start date must be before end date');
        setExporting(false);
        return;
      }

      const payload = {
        type: selectedReport,
        format: format.toLowerCase(),
        dateFrom: dateRange.start,
        dateTo: dateRange.end,
        classId: selectedClass === 'all' ? null : parseInt(selectedClass),
        includeBreakdown: exportOptions.includeBreakdown,
        includeCharts: exportOptions.includeCharts,
        sendEmail: exportOptions.sendEmail,
      };

      const response = await reportsAPI.export(payload);

      if (response.success) {
        setSuccess(true);
        // Trigger download
        if (response.downloadUrl) {
          const link = document.createElement('a');
          link.href = response.downloadUrl;
          link.download = `${selectedReport}-export.${format.toLowerCase()}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to export report');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while exporting report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Report exported successfully!" onClose={() => {}} />}

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
        <p className="text-gray-600">Generate and download reports in multiple formats</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Select Export Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
                <Button
                  key={format}
                  variant={format === 'PDF' ? 'primary' : 'secondary'}
                  fullWidth
                  className="py-3 flex items-center justify-center gap-2"
                  onClick={() => handleExport(format)}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {format}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4">Additional Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeBreakdown}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeBreakdown: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Include detailed breakdown</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeCharts: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Include charts and graphs</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.sendEmail}
                  onChange={(e) => setExportOptions({ ...exportOptions, sendEmail: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Send to email</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExportReports;
