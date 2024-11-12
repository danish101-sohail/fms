import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, deleteBooking } from '@/store/slices/bookingSlice';
import ViewBookingDetails from '../MyBookings/ViewBookingDetails';

const MyBookingsList = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, bookingId: null });
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleDeleteClick = (bookingId) => {
    setDeleteConfirmation({ isOpen: true, bookingId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.bookingId) {
      await dispatch(deleteBooking(deleteConfirmation.bookingId));
      setDeleteConfirmation({ isOpen: false, bookingId: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, bookingId: null });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'All') return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="text-center mt-8">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">My Bookings</h2>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by status:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      {filteredBookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredBookings.map((booking) => (
            <li key={booking._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary">{booking.venue.name}</h3>
              <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Slot: {booking.slot}</p>
              <p className="text-gray-600">Type: {booking.type}</p>
              <p className="text-gray-600">Status: {booking.status}</p>
              {booking.alternateDate && (
                <p className="text-gray-600">
                  Alternate Date: {new Date(booking.alternateDate).toLocaleDateString()} ({booking.alternateSlot})
                </p>
              )}
              {booking.approver && (
                <p className="text-gray-600">
                  {booking.status === 'Rejected' ? 'Rejected' : 'Approved'} by: {booking.approver.name} ({booking.approver.role})
                </p>
              )}
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteClick(booking._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                >
                  Delete Booking
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p>Are you sure you want to delete this booking?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition-colors duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <ViewBookingDetails
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default MyBookingsList;