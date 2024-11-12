import { createSlice } from '@reduxjs/toolkit';
import { fetchPendingApprovals } from './bookingSlice';

const approvalSlice = createSlice({
  name: 'approval',
  initialState: {
    pendingCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingCount = action.payload.length;
      });
  },
});

export default approvalSlice.reducer;