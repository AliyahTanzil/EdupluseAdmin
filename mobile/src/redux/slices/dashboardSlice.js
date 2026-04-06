import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalUsers: 0,
    totalSchools: 0,
    totalClasses: 0,
    activeStudents: 0,
  },
  recentActivity: [],
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.stats = action.payload.stats;
      state.recentActivity = action.payload.recentActivity;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setDashboardData, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
