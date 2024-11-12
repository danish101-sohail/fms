import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { venueService } from '../../services/api';

export const createVenue = createAsyncThunk(
  'venue/createVenue',
  async (venueData, { rejectWithValue }) => {
    try {
      const response = await venueService.createVenue(venueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVenues = createAsyncThunk(
  'venue/fetchVenues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await venueService.fetchVenues();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVenuesWithStatus = createAsyncThunk(
  'venue/fetchVenuesWithStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await venueService.fetchVenuesWithStatus();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const clearHallStatus = createAsyncThunk(
//   'venue/clearHallStatus',
//   async (hallName, { rejectWithValue }) => {
//     try {
//       const response = await venueService.clearHallStatus(hallName);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

const venueSlice = createSlice({
  name: 'venue',
  initialState: {
    venues: [],
    venuesWithStatus: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVenuesWithStatus: (state) => {
        state.venuesWithStatus = [];
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.venues.push(action.payload);
      })
      .addCase(createVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(fetchVenuesWithStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenuesWithStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.venuesWithStatus = action.payload;
      })
      .addCase(fetchVenuesWithStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
    //   .addCase(clearHallStatus.fulfilled, (state, action) => {
    //     const updatedHall = action.payload;
    //     const index = state.venues.findIndex(venue => venue._id === updatedHall._id);
    //     if (index !== -1) {
    //       state.venues[index] = updatedHall;
    //     }
    //   });
  },
});

export const { clearError, clearVenuesWithStatus } = venueSlice.actions;
export default venueSlice.reducer;