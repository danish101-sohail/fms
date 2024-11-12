// frontend/src/components/Admin/AdminVenueList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVenues } from '@/store/slices/venueSlice';
import VenueStatus from '../Dashboard/VenueStatus';
import VenueAnalytics from './VenueAnalytics';

const AdminVenueList = () => {
  const dispatch = useDispatch();
  const { venues, loading, error } = useSelector((state) => state.venue);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const filteredVenues = venues
    .filter(venue =>
      venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    )
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (loading) return <div className="text-center mt-8">Loading venues...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search venues by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVenues.map((venue) => (
          <div key={venue._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-primary mb-4">{venue.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedVenue(venue._id);
                  setShowStatus(true);
                  setShowAnalytics(false);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
              >
                Show Status
              </button>
              <button
                onClick={() => {
                  setSelectedVenue(venue._id);
                  setShowAnalytics(true);
                  setShowStatus(false);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-300"
              >
                View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>

      {showStatus && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <VenueStatus 
            venueId={selectedVenue} 
            onClose={() => setShowStatus(false)} 
          />
        </div>
      )}

      {showAnalytics && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Venue Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <VenueAnalytics venueId={selectedVenue} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenueList;