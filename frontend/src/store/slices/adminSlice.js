// frontend/src/store/slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/api';

export const fetchAllBookings = createAsyncThunk(
  'admin/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBookingByAdmin = createAsyncThunk(
  'admin/deleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await adminService.deleteBooking(bookingId);
      return { ...response.data, _id: bookingId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    allBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteBookingByAdmin.fulfilled, (state, action) => {
        state.allBookings = state.allBookings.filter(
          booking => booking._id !== action.payload._id
        );
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;