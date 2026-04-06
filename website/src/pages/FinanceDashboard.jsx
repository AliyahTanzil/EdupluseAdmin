import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrlSync } from '../config/apiConfig';
import { Card, Button } from '../components/Shared';
import { DollarSign, TrendingUp, CreditCard, BarChart3, LogOut, User, ChevronDown, TrendingDown, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalOutstanding: 0,
    totalExpenses: 0,
    paidStudents: 0,
    unpaidStudents: 0,
    totalStudents: 0,
    collectionRate: '0%',
    monthlyRevenue: 0,
    thisMonthCollection: 0,
    lastMonthCollection: 0
  });
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = getApiBaseUrlSync();
      
      // Check if user has permission to view finances
      if (!hasPermission('view_all_reports') && !hasPermission('create_reports')) {
        setLoading(false);
        return;
      }

      // Fetch reports data for financial information
      const [reportsRes, studentsRes] = await Promise.all([
        fetch(`${apiBase}/reports/attendance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        fetch(`${apiBase}/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);

      const reportsData = reportsRes.ok ? await reportsRes.json() : { data: [] };
      const studentsData = studentsRes.ok ? await studentsRes.json() : { data: [] };

      // Mock financial calculations based on available data
      const totalStudents = studentsData.data?.length || 0;
      const mockCollectionRate = Math.floor(Math.random() * 40) + 60; // 60-100%
      const paidCount = Math.floor(totalStudents * (mockCollectionRate / 100));
      const unpaidCount = totalStudents - paidCount;
      const monthlySchoolFees = 50000; // Mock base fee
      const totalCollected = paidCount * monthlySchoolFees;
      const totalOutstanding = unpaidCount * monthlySchoolFees;

      setStats({
        totalCollected,
        totalOutstanding,
        totalExpenses: Math.floor(totalCollected * 0.3), // Mock expenses as 30% of collection
        paidStudents: paidCount,
        unpaidStudents: unpaidCount,
        totalStudents,
        collectionRate: `${mockCollectionRate}%`,
        monthlyRevenue: totalCollected,
        thisMonthCollection: totalCollected,
        lastMonthCollection: Math.floor(totalCollected * 0.95)
      });

      // Mock transaction data
      setTransactions([
        {
          id: 1,
          type: 'collection',
          description: 'Monthly School Fees - Class 4A',
          amount: monthlySchoolFees,
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        },
        {
          id: 2,
          type: 'expense',
          description: 'Staff Salary Disbursement',
          amount: Math.floor(totalCollected * 0.5),
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
          status: 'completed'
        },
        {
          id: 3,
          type: 'collection',
          description: 'Monthly School Fees - Class 5B',
          amount: monthlySchoolFees,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
          status: 'completed'
        },
        {
          id: 4,
          type: 'expense',
          description: 'Utilities & Maintenance',
          amount: Math.floor(totalCollected * 0.1),
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    navigate('/logout');
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
    setShowProfileMenu(false);
  };

  const statCards = [
    {
      title: 'Total Collected',
      value: `₦${(stats.totalCollected / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'green',
      trend: `${((stats.thisMonthCollection - stats.lastMonthCollection) / stats.lastMonthCollection * 100).toFixed(1)}% vs last month`
    },
    {
      title: 'Outstanding Fees',
      value: `₦${(stats.totalOutstanding / 1000).toFixed(0)}K`,
      icon: AlertCircle,
      color: 'red',
      trend: `${stats.unpaidStudents} students`
    },
    {
      title: 'Total Expenses',
      value: `₦${(stats.totalExpenses / 1000).toFixed(0)}K`,
      icon: TrendingDown,
      color: 'orange',
      trend: 'This month'
    },
    {
      title: 'Collection Rate',
      value: stats.collectionRate,
      icon: BarChart3,
      color: 'blue',
      trend: `${stats.paidStudents}/${stats.totalStudents} students`
    },
    {
      title: 'Paid Students',
      value: stats.paidStudents,
      icon: CheckCircle,
      color: 'purple',
      trend: `${((stats.paidStudents / stats.totalStudents) * 100).toFixed(1)}% of total`
    },
    {
      title: 'Net Balance',
      value: `₦${((stats.totalCollected - stats.totalExpenses) / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'cyan',
      trend: 'Assets - Liabilities'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setShowProfileMenu(false)}>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.name}! 
                <span className="text-blue-600 font-semibold"> Treasurer</span>
              </p>
            </div>
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium text-blue-700 z-40"
                >
                  <User size={20} />
                  <span>{user?.name}</span>
                  <ChevronDown size={18} />
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProfileClick();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-medium transition-colors cursor-pointer"
                    >
                      <User size={18} />
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap = {
              green: 'bg-green-50 text-green-700 border-green-200',
              red: 'bg-red-50 text-red-700 border-red-200',
              orange: 'bg-orange-50 text-orange-700 border-orange-200',
              blue: 'bg-blue-50 text-blue-700 border-blue-200',
              purple: 'bg-purple-50 text-purple-700 border-purple-200',
              cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
            };
            return (
              <Card key={index} className={`border-2 ${colorMap[stat.color]}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className="text-2xl opacity-50" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <TrendingUp size={14} className={stat.color === 'red' ? 'text-red-600' : 'text-green-600'} />
                    <span className="text-gray-600">{stat.trend}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Financial Functions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Finance Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div onClick={() => navigate('/export-reports')} className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Reports</h3>
              <p className="text-gray-600 text-sm">Generate income statements and reports</p>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div onClick={() => navigate('/students')} className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mb-4">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Fee Collection</h3>
              <p className="text-gray-600 text-sm">Manage student fee payments</p>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div onClick={() => navigate('/attendance')} className="p-6">
              <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
                <BarChart3 className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-gray-600 text-sm">View financial analytics and trends</p>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-900">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900">Description</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-900">Type</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-900">Amount</th>
                  <th className="text-center px-6 py-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-600">{transaction.date}</td>
                    <td className="px-6 py-3 text-gray-900 font-medium">{transaction.description}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'collection' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'collection' ? 'Collection' : 'Expense'}
                      </span>
                    </td>
                    <td className={`text-right px-6 py-3 font-bold text-lg ${
                      transaction.type === 'collection' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'collection' ? '+' : '-'}₦{(transaction.amount / 1000).toFixed(0)}K
                    </td>
                    <td className="text-center px-6 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
