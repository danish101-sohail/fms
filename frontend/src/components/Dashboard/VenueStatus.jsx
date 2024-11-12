import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchVenuesWithStatus, clearHallStatus } from '@/store/slices/venueSlice';
import { fetchVenuesWithStatus} from '@/store/slices/venueSlice';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);

const VenueStatus = ({ venueId, onClose }) => {
  const dispatch = useDispatch();
  const { venuesWithStatus, loading, error } = useSelector((state) => state.venue);
  //const { user } = useSelector((state) => state.auth);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    if (venuesWithStatus.length === 0) {
      dispatch(fetchVenuesWithStatus());
    } else {
      const venue = venuesWithStatus.find(v => v._id === venueId);
      setSelectedVenue(venue);
    }
  }, [dispatch, venuesWithStatus, venueId]);

//   const handleClearStatus = (hallName) => {
//     dispatch(clearHallStatus(hallName));
//   };

//   const canClearStatus = user && ['Registrar', 'CPO'].includes(user.role);

  if (loading) {
    return <div className="text-center mt-8">Loading venue status...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-danger">Error: {error}</div>;
  }

  if (!selectedVenue) {
    return <div className="text-center mt-8">Venue not found.</div>;
  }

  const events = selectedVenue.bookings.map(booking => {
    let start, end;
    if (booking.slot === 'Forenoon') {
      start = new Date(booking.date);
      start.setHours(10, 0, 0);
      end = new Date(booking.date);
      end.setHours(14, 0, 0);
    } else if (booking.slot === 'Afternoon') {
      start = new Date(booking.date);
      start.setHours(14, 0, 0);
      end = new Date(booking.date);
      end.setHours(18, 0, 0);
    }
  
    return {
      title: `${booking.slot} - ${booking.type}`,
      start,
      end,
      allDay: false,
      resource: booking.slot,
    };
  });

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.resource === 'Afternoon' ? '#e74c3c' : '#3498db',
      color: 'white',
      border: 'none',
      //display: 'block',
      width: '100%',
      textOverflow: 'ellipsis',
    };
    return { style };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full m-4">
        <h2 className="text-2xl font-bold mb-4 text-primary">{selectedVenue.name} Status</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500}}
          eventPropGetter={eventStyleGetter}
        />
        {/* {canClearStatus && selectedVenue.bookings.length > 0 && (
          <button
            onClick={() => handleClearStatus(selectedVenue.name)}
            className="mt-4 bg-secondary text-white px-3 py-1 rounded hover:bg-opacity-80 transition-colors duration-300"
          >
            Clear Status
          </button>
        )} */}
        <button
          onClick={onClose}
          className="mt-4 ml-2 bg-gray-300 text-black px-3 py-1 rounded hover:bg-opacity-80 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

VenueStatus.propTypes = {
  venueId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VenueStatus;