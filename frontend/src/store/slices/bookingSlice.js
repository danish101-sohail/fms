import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/api';

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.fetchUserBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveBookingByHOD = createAsyncThunk(
  'booking/approveBookingByHOD',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.approveBookingByHOD(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const approveBookingByFinal = createAsyncThunk(
  'booking/approveBookingByFinal',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.approveBookingByFinal(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectBooking = createAsyncThunk(
  'booking/rejectBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.rejectBooking(bookingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPendingApprovals = createAsyncThunk(
  'booking/fetchPendingApprovals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.fetchPendingApprovals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBooking = createAsyncThunk(
    'booking/deleteBooking',
    async (bookingId, { rejectWithValue }) => {
      try {
        const response = await bookingService.deleteBooking(bookingId);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    pendingApprovals: [],
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
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(approveBookingByHOD.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(approveBookingByFinal.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApprovals = action.payload;
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(booking => booking._id !== action.payload._id);
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;