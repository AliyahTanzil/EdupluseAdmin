import api from './api';

export const dashboardService = {
  getDashboardData: async (role) => {
    try {
      const response = await api.get(`/dashboard/${role}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/activity', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
