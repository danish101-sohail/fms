// frontend/src/components/Bookings/ViewBookingDetails.jsx
import PropTypes from 'prop-types';

const ViewBookingDetails = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Booking Details - {booking.venue.name}</h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Date</label>
              <p className="text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Slot</label>
              <p className="text-gray-600">{booking.slot}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Type</label>
              <p className="text-gray-600">{booking.type}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Status</label>
              <p className="text-gray-600">{booking.status}</p>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Applicant Name</label>
              <p className="text-gray-600">{booking.applicantName}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Branch</label>
              <p className="text-gray-600">{booking.branch}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Roll No</label>
              <p className="text-gray-600">{booking.rollNo}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Student Mobile</label>
              <p className="text-gray-600">{booking.studentMobile}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Faculty Mobile</label>
              <p className="text-gray-600">{booking.facultyMobile}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Faculty Email</label>
              <p className="text-gray-600">{booking.facultyEmail}</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Purpose of Event</label>
            <p className="text-gray-600">{booking.eventPurpose}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Hoardings Count & Size</label>
              <p className="text-gray-600">{booking.hoardingsCount}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Hoarding Locations</label>
              <p className="text-gray-600">{booking.hoardingsLocations}</p>
            </div>
          </div>

          {/* Equipment & Operators */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Equipment Required</label>
            <p className="text-gray-600">{booking.equipmentsRequired}</p>

            {booking.operatorsDuringOfficeHours && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">Operators During Office Hours</label>
                <p className="text-gray-600">{booking.operatorTypes}</p>
              </div>
            )}

            {booking.operatorsAfterOfficeHours && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">Operators After Office Hours</label>
                <p className="text-gray-600">{booking.operatorCompensation}</p>
              </div>
            )}
          </div>

          {/* Justification */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Justification</label>
            <p className="text-gray-600">{booking.justification}</p>
          </div>

          {/* Alternate Date/Slot */}
          {booking.alternateDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Alternate Date</label>
                <p className="text-gray-600">{new Date(booking.alternateDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Alternate Slot</label>
                <p className="text-gray-600">{booking.alternateSlot}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ViewBookingDetails.propTypes = {
  booking: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewBookingDetails;