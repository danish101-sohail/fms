// frontend/src/components/Dashboard/VenueList.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenues, clearVenuesWithStatus } from '@/store/slices/venueSlice';
import VenueStatus from './VenueStatus';
import BookingForm from './BookingForm';

const VenueList = () => {
  const dispatch = useDispatch();
  const { venues, loading, error } = useSelector((state) => state.venue);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const filteredVenues = venues
    .filter(venue =>
      (venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (venue.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (loading) {
    return <div className="text-center mt-8">Loading venues...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Available Venues</h2>
      <input
        type="text"
        placeholder="Search venues by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      {filteredVenues.length === 0 ? (
        <p className="text-center text-gray-600">No venues found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map((venue) => (
            <li key={venue._id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-primary">{venue.name || 'Unnamed Venue'}</h3>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setSelectedVenue(venue._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Show Status
                </button>
                <button
                  onClick={() => {
                    setShowBookingForm(true);
                    setSelectedVenue(venue._id);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300"
                >
                  Book Venue
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedVenue && !showBookingForm && (
        <VenueStatus 
          venueId={selectedVenue} 
          onClose={() => {
            setSelectedVenue(null);
            dispatch(clearVenuesWithStatus());
          }} 
        />
      )}
      {showBookingForm && (
        <BookingForm 
          venueId={selectedVenue} 
          onClose={() => {
            setShowBookingForm(false);
            setSelectedVenue(null);
          }} 
        />
      )}
    </div>
  );
};

export default VenueList;