import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingApprovals, approveBookingByHOD, approveBookingByFinal, rejectBooking } from '@/store/slices/bookingSlice';
import ViewBookingDetails from '../MyBookings/ViewBookingDetails';

const ApprovalsList = () => {
  const dispatch = useDispatch();
  const { pendingApprovals, loading, error } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  const handleApprove = async (bookingId) => {
    try {
      if (user.role === 'HOD') {
        await dispatch(approveBookingByHOD(bookingId));
      } else {
        await dispatch(approveBookingByFinal(bookingId));
      }
      dispatch(fetchPendingApprovals());
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await dispatch(rejectBooking(bookingId));
      dispatch(fetchPendingApprovals());
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading pending approvals...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Pending Approvals</h2>
      {pendingApprovals.length === 0 ? (
        <p className="text-center text-gray-600">No pending approvals.</p>
      ) : (
        <ul className="space-y-4">
          {pendingApprovals.map((booking) => (
            <li key={booking._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary">{booking.venue.name}</h3>
              <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Slot: {booking.slot}</p>
              <p className="text-gray-600">Type: {booking.type}</p>
              <p className="text-gray-600">Applicant: {booking.applicant.name} ({booking.applicant.email})</p>
              <p className="text-gray-600">Department: {booking.applicant.department}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(booking._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
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

export default ApprovalsList;