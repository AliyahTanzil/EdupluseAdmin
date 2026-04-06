import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  offlineQueue: [],
  isSyncing: false,
  lastSyncTime: null,
  isOnline: true,
  syncError: null,
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    addToQueue: (state, action) => {
      state.offlineQueue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.offlineQueue = state.offlineQueue.filter(
        (item) => item.id !== action.payload
      );
    },
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
    setIsOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setSyncError: (state, action) => {
      state.syncError = action.payload;
    },
    clearQueue: (state) => {
      state.offlineQueue = [];
    },
  },
});

export const {
  addToQueue,
  removeFromQueue,
  setIsSyncing,
  setLastSyncTime,
  setIsOnline,
  setSyncError,
  clearQueue,
} = syncSlice.actions;
export default syncSlice.reducer;
