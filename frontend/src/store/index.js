import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import venueReducer from './slices/venueSlice';
import bookingReducer from './slices/bookingSlice';
import approvalReducer from './slices/approvalSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,
      venue: venueReducer,
      booking: bookingReducer,
      approval: approvalReducer,
      admin: adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['auth/login/fulfilled', 'auth/fetchUserDetails/fulfilled'],
          ignoredActionPaths: ['payload.date'],
          ignoredPaths: ['auth.user', 'booking.bookings'],
        },
      }),
  });

export default store;