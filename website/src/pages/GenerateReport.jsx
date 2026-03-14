import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { ArrowLeft, Download, BarChart3, TrendingUp, PieChart, Calendar, FileText, Loader } from 'lucide-react';
import { reportsAPI, classesAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const GenerateReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedClass, setSelectedClass] = useState('all');
  const [classes, setClasses] = useState([]);
  const [reportOptions, setReportOptions] = useState({
    includeSummary: true,
    includeCharts: true,
    includeDetails: false,
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setError(null);
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
      id: 'summary',
      name: 'Summary Report',
      description: 'Overall class and student summary',
      icon: FileText,
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

  const handleGenerateReport = async (format) => {
    try {
      setGenerating(true);
      setError(null);

      // Validate date range
      if (new Date(dateRange.start) > new Date(dateRange.end)) {
        setError('Start date must be before end date');
        setGenerating(false);
        return;
      }

      const payload = {
        type: reportType,
        format: format.toLowerCase(),
        dateFrom: dateRange.start,
        dateTo: dateRange.end,
        classId: selectedClass === 'all' ? null : parseInt(selectedClass),
        includeSummary: reportOptions.includeSummary,
        includeCharts: reportOptions.includeCharts,
        includeDetails: reportOptions.includeDetails,
      };

      const response = await reportsAPI.generate(payload);

      if (response.success) {
        setSuccess(true);
        // Trigger download
        if (response.downloadUrl) {
          const link = document.createElement('a');
          link.href = response.downloadUrl;
          link.download = `${reportType}-report.${format.toLowerCase()}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to generate report');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Report generated successfully!" onClose={() => {}} />}

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
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Date Range</h3>
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

          {/* Options */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-4">Report Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportOptions.includeSummary}
                  onChange={(e) => setReportOptions({ ...reportOptions, includeSummary: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Include Summary</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportOptions.includeCharts}
                  onChange={(e) => setReportOptions({ ...reportOptions, includeCharts: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Include Charts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportOptions.includeDetails}
                  onChange={(e) => setReportOptions({ ...reportOptions, includeDetails: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Include Detailed Data</span>
              </label>
            </div>
          </div>

          {/* Export Formats */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Export Format</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['PDF', 'Excel', 'CSV'].map((format) => (
                <Button
                  key={format}
                  variant={format === 'PDF' ? 'primary' : 'secondary'}
                  fullWidth
                  className="py-3 flex items-center justify-center gap-2"
                  onClick={() => handleGenerateReport(format)}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Generating...
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
        </div>
      </Card>
    </div>
  );
};

export default GenerateReport;
