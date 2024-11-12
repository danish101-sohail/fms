import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, deleteBookingByAdmin } from '@/store/slices/adminSlice';
import { toast } from 'react-toastify';
import ViewBookingDetails from '../MyBookings/ViewBookingDetails';

const AdminBookingsList = () => {
  const dispatch = useDispatch();
  const { allBookings, loading, error } = useSelector((state) => state.admin);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, bookingId: null });

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleDeleteClick = (bookingId) => {
    setDeleteConfirmation({ isOpen: true, bookingId });
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteBookingByAdmin(deleteConfirmation.bookingId)).unwrap();
      toast.success('Booking deleted successfully');
      setDeleteConfirmation({ isOpen: false, bookingId: null });
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  if (loading) return <div className="text-center py-4">Loading bookings...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allBookings.map((booking) => (
            <tr key={booking._id}>
              <td className="px-6 py-4 whitespace-nowrap">{booking.venue.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(booking.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded text-sm ${
                  booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{booking.applicant.name}</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteClick(booking._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                onClick={() => setDeleteConfirmation({ isOpen: false, bookingId: null })}
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

export default AdminBookingsList;