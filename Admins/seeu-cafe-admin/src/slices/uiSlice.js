// store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    activeRequests: 0
  },
  reducers: {
    startLoading: (state) => {
      state.activeRequests += 1;
      state.loading = true;
    },
    stopLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1);
      state.loading = state.activeRequests > 0;
    }
  }
});

export const { startLoading, stopLoading } = uiSlice.actions;
export default uiSlice.reducer;