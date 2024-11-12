import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  fetchUserDetails: () => api.get('/users/me'),
};

export const venueService = {
  createVenue: (venueData) => api.post('/hall/create_hall', venueData),
  fetchVenues: () => api.get('/hall/view_halls'),
  fetchVenuesWithStatus: () => api.get('/hall/halls-status'),
  //clearHallStatus: (hallName) => api.post('/hall/clear_hall', { name: hallName }),
};

export const bookingService = {
  createBooking: (bookingData) => api.post('/booking/create', bookingData),
  fetchUserBookings: () => api.get('/booking/bookings'),
  approveBookingByHOD: (bookingId) => api.post(`/booking/approve/hod/${bookingId}`),
  approveBookingByFinal: (bookingId) => api.post(`/booking/approve/final/${bookingId}`),
  rejectBooking: (bookingId) => api.post(`/booking/reject/${bookingId}`),
  fetchPendingApprovals: () => api.get('/booking/pending-approvals'),
  deleteBooking: (bookingId) => api.delete(`/booking/${bookingId}`),
};

export const adminService = {
  getAllBookings: () => api.get('/admin/bookings'),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
  getVenueAnalytics: (id) => api.get(`/admin/venues/${id}/analytics`),
};

export default api;