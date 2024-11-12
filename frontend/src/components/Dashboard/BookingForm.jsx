import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '@/store/slices/bookingSlice';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const BookingForm = ({ venueId, onClose }) => {
  const dispatch = useDispatch();
  const { venues } = useSelector((state) => state.venue);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    date: '',
    slot: '',
    type: '',
    alternateDate: '',
    alternateSlot: '',
    applicantName: '',
    branch: '',
    rollNo: '',
    studentMobile: '',
    facultyMobile: '',
    facultyEmail: user?.email || '',
    eventPurpose: '',
    hoardingsCount: '',
    hoardingsLocations: '',
    equipmentsRequired: '',
    operatorsDuringOfficeHours: false,
    operatorTypes: '',
    operatorsAfterOfficeHours: false,
    operatorCompensation: '',
    justification: '',
    undertaking: false
  });

  const venue = venues.find(v => v._id === venueId || v.id === venueId);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBooking({ venueId: venueId, ...formData })).unwrap();
      toast.success('Booking successfully created!');
      onClose();
    } catch {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Book {venue.name}</h2>
        </div>

         {/* Form Content - Scrollable */}
        <div className="overflow-y-auto p-6 flex-grow">
          <form id="bookingForm" onSubmit={handleSubmit}>
            {/* Basic Booking Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="slot" className="block text-gray-700 font-bold mb-2">Slot</label>
                <select
                  id="slot"
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a slot</option>
                  <option value="Forenoon">Forenoon</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-gray-700 font-bold mb-2">Event Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select event type</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Official">Official</option>
                </select>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="applicantName" className="block text-gray-700 font-bold mb-2">Applicant Name</label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="branch" className="block text-gray-700 font-bold mb-2">Branch</label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="rollNo" className="block text-gray-700 font-bold mb-2">Roll No</label>
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="studentMobile" className="block text-gray-700 font-bold mb-2">Student Mobile</label>
                <input
                  type="tel"
                  id="studentMobile"
                  name="studentMobile"
                  value={formData.studentMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="facultyMobile" className="block text-gray-700 font-bold mb-2">Faculty Mobile</label>
                <input
                  type="tel"
                  id="facultyMobile"
                  name="facultyMobile"
                  value={formData.facultyMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="facultyEmail" className="block text-gray-700 font-bold mb-2">Faculty Email</label>
                <input
                  type="email"
                  id="facultyEmail"
                  name="facultyEmail"
                  value={formData.facultyEmail}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  disabled
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="eventPurpose" className="block text-gray-700 font-bold mb-2">Purpose of Event</label>
                <textarea
                  id="eventPurpose"
                  name="eventPurpose"
                  value={formData.eventPurpose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hoardingsCount" className="block text-gray-700 font-bold mb-2">No. of hoardings/signages with size</label>
                  <input
                    type="text"
                    id="hoardingsCount"
                    name="hoardingsCount"
                    value={formData.hoardingsCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="hoardingsLocations" className="block text-gray-700 font-bold mb-2">Likely Locations</label>
                  <input
                    type="text"
                    id="hoardingsLocations"
                    name="hoardingsLocations"
                    value={formData.hoardingsLocations}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Equipment and Operators */}
            <div className="mb-6">
              <label htmlFor="equipmentsRequired" className="block text-gray-700 font-bold mb-2">Equipment Required</label>
              <textarea
                id="equipmentsRequired"
                name="equipmentsRequired"
                value={formData.equipmentsRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="2"
              />

              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="operatorsDuringOfficeHours"
                    name="operatorsDuringOfficeHours"
                    checked={formData.operatorsDuringOfficeHours}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="operatorsDuringOfficeHours">Operators Required during office hours</label>
                </div>
                {formData.operatorsDuringOfficeHours && (
                  <input
                    type="text"
                    name="operatorTypes"
                    placeholder="Type of operators/staff (JE/Electrician/Sound Op etc)"
                    value={formData.operatorTypes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mt-2"
                  />
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="operatorsAfterOfficeHours"
                    name="operatorsAfterOfficeHours"
                    checked={formData.operatorsAfterOfficeHours}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="operatorsAfterOfficeHours">Operators Required after office hours</label>
                </div>
                {formData.operatorsAfterOfficeHours && (
                  <input
                    type="text"
                    name="operatorCompensation"
                    placeholder="Proposal to compensate operators/staff"
                    value={formData.operatorCompensation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mt-2"
                  />
                )}
              </div>
            </div>

            {/* Justification */}
            <div className="mb-6">
              <label htmlFor="justification" className="block text-gray-700 font-bold mb-2">Justification</label>
              <textarea
                id="justification"
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                placeholder="Justification for why central facilities needed"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
              />
            </div>

            {/* Undertaking */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="undertaking"
                  name="undertaking"
                  checked={formData.undertaking}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <label htmlFor="undertaking" className="text-sm text-gray-700">
                  I/We accept the terms and conditions regarding security, discipline, safety of equipment, placing and removal of hoardings/signages, cleanliness, and penalties/recoveries etc.
                </label>
              </div>
            </div>

            {/* Alternate Date/Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="alternateDate" className="block text-gray-700 font-bold mb-2">Alternate Date (Fill Same if no alternate)</label>
                <input
                  type="date"
                  id="alternateDate"
                  name="alternateDate"
                  value={formData.alternateDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="alternateSlot" className="block text-gray-700 font-bold mb-2">Alternate Slot (Fill same if no alternate)</label>
                <select
                  id="alternateSlot"
                  name="alternateSlot"
                  value={formData.alternateSlot}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select a slot</option>
                  <option value="Forenoon">Forenoon</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bookingForm"
            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Submit Booking
          </button>
        </div>
      </div>
    </div>
  );
};

BookingForm.propTypes = {
  venueId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookingForm;