// // backend/routes/booking.js
// const express = require('express');
// const router = express.Router();
// const Booking = require('../models/booking');
// const Hall = require('../models/hall');
// const User = require('../models/user');
// const passport = require('../config/passport');

// // Middleware to check if user is authenticated
// // const isAuthenticated = (req, res, next) => {
// //   if (req.isAuthenticated()) {
// //     console.log('Authenticated user:', req.user);
// //     return next();
// //   }
// //   console.log('User not authenticated:', req.user);
// //   res.status(403).json({ error: 'Unauthorized' });
// // };
// const isAuthenticated = passport.authenticate('jwt', { session: false });

// // Middleware to check if user has specific roles
// const hasRole = (roles) => (req, res, next) => {
//   if (roles.includes(req.user.role)) {
//     return next();
//   }
//   res.status(403).json({ error: 'Forbidden' });
// };

// // Create Booking
// router.post('/create', isAuthenticated, async (req, res) => {
//   const { venueId, date, slot, type, alternateDate, alternateSlot } = req.body;

//   try {
//     console.log('User from request:', req.user);
//     // Check if the user exists
//     const applicant = await User.findById(req.user.id);
//     if (!applicant) {
//       console.log('Applicant not found:', req.user.id);
//       return res.status(400).json({ error: 'Invalid user' });
//     }

//     const venue = await Hall.findById(venueId);
//     if (!venue) {
//   return res.status(400).json({ error: 'Invalid venue' });
// }
//     // Check for existing bookings for the same venue, date, and slot
//     const existingBookings = await Booking.find({ venue: venueId, date, slot, status: { $in: ['Approved', 'Pending'] } });

//     // Determine the priority of the new booking
//     let newBookingPriority;
//     if (applicant.role === 'CPO' || applicant.role === 'Registrar') {
//       newBookingPriority = 2; // Highest priority
//     } else if (type === 'Official') {
//       newBookingPriority = 1; // Medium priority
//     } else {
//       newBookingPriority = 0; // Lowest priority
//     }

//     // Handle conflicts based on priority
//     for (const existingBooking of existingBookings) {
//       if (existingBooking.priority >= newBookingPriority) {
//         return res.status(400).json({ error: 'Slot already booked with higher or equal priority' });
//       } else {
//         // Downgrade the existing booking to the alternate slot
//         existingBooking.date = alternateDate;
//         existingBooking.slot = alternateSlot;
//         await existingBooking.save();
//       }
//     }

//     // Create the new booking
//     const newBooking = new Booking({
//       venue: venueId,
//       date,
//       slot,
//       type,
//       applicant: req.user.id,
//       alternateDate,
//       alternateSlot,
//       priority: newBookingPriority
//     });

//     // Automatic approval logic
//     if (applicant.role === 'CPO' || applicant.role === 'Registrar') {
//       newBooking.status = 'Approved';
//       newBooking.approvedByHOD = true;
//       newBooking.approvedByFinalApprover = true;
//     } else if (applicant.role === 'HOD') {
//       newBooking.approvedByHOD = true;
//     }
//     await newBooking.save();
//     res.status(201).json(newBooking);
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     res.status(500).json({ error: error.message || 'Failed to create booking' });
//   }
// });

// // Get Bookings for User
// router.get('/bookings', isAuthenticated, async (req, res) => {
//   try {
//     const bookings = await Booking.find({ applicant: req.user.id })
//       .populate('venue')
//       .populate('approver', 'name email role');
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });

// // Approve Booking by HOD
// router.post('/approve/hod/:id', isAuthenticated, hasRole(['HOD']), async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ error: 'Booking not found' });

//     if (booking.approvedByHOD) {
//       return res.status(400).json({ error: 'Booking already approved by HOD' });
//     }

//     booking.approvedByHOD = true;
//     booking.approver = req.user.id;
//     const updatedBooking = await booking.save();
//     res.json(updatedBooking);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to approve booking' });
//   }
// });

// // Approve Booking by Final Approver (Registrar or CPO)
// router.post('/approve/final/:id', isAuthenticated, hasRole(['Registrar', 'CPO']), async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id).populate('venue');
//     if (!booking) return res.status(404).json({ error: 'Booking not found' });

//     if (!booking.approvedByHOD) {
//       return res.status(400).json({ error: 'Booking must be approved by HOD first' });
//     }

//     if (booking.approvedByFinalApprover) {
//       return res.status(400).json({ error: 'Booking already approved by final approver' });
//     }

//     // Check if the user has authority over the venue
//     const venueName = booking.venue.name;
//     const userRole = req.user.role;
//     const authorizedVenues = ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'];

//     if (userRole === 'Registrar' && !authorizedVenues.includes(venueName)) {
//       return res.status(403).json({ error: 'Registrar can only approve bookings for specific venues' });
//     }

//     booking.approvedByFinalApprover = true;
//     booking.status = 'Approved';
//     booking.approver = req.user.id;
//     const updatedBooking = await booking.save();
//     res.json(updatedBooking);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to approve booking' });
//   }
// });

// // Reject Booking
// router.post('/reject/:id', isAuthenticated, hasRole(['HOD', 'Registrar', 'CPO']), async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ error: 'Booking not found' });

//     booking.status = 'Rejected';
//     booking.approver = req.user.id;
//     const updatedBooking = await booking.save();
//     res.json(updatedBooking);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to reject booking' });
//   }
// });

// // Get Pending Approvals
// router.get('/pending-approvals', isAuthenticated, hasRole(['HOD', 'CPO', 'Registrar']), async (req, res) => {
//   try {
//     let query = {status: { $in: ['Pending'] }};
//     if (req.user.role === 'HOD') {
//       query = { 
//         approvedByHOD: false, 
//         approvedByFinalApprover: false, 
//         'applicant.department': req.user.department 
//       };
//     } else if (req.user.role === 'CPO') {
//       query = { 
//         approvedByHOD: true, 
//         approvedByFinalApprover: false,
//         'venue.name': { $nin: ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'] }
//       };
//     } else if (req.user.role === 'Registrar') {
//       query = { 
//         approvedByHOD: true, 
//         approvedByFinalApprover: false,
//         'venue.name': { $in: ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'] }
//       };
//     }

//     const pendingBookings = await Booking.find(query)
//       .populate('venue')
//       .populate('applicant', 'name email department');

//     res.json(pendingBookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch pending approvals' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Hall = require('../models/hall');
const User = require('../models/user');
const passport = require('../config/passport');

const isAuthenticated = passport.authenticate('jwt', { session: false });

const hasRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden' });
};

// Check for existing bookings and resolve conflicts
async function checkAndResolveConflicts(booking, newBookingPriority) {
  const existingBookings = await Booking.find({ 
    venue: booking.venue, 
    date: booking.date, 
    slot: booking.slot, 
    status: { $in: ['Approved', 'Pending'] } 
  });

  for (const existingBooking of existingBookings) {
    if (existingBooking.priority >= newBookingPriority) {
      return false; // Can't resolve conflict, new booking should be rejected
    } else {
      // Try to move existing booking to its alternate slot
      if (existingBooking.alternateDate && existingBooking.alternateSlot) {
        const canMove = await checkAndResolveConflicts({
          ...existingBooking.toObject(),
          date: existingBooking.alternateDate,
          slot: existingBooking.alternateSlot
        }, existingBooking.priority);

        if (canMove) {
          existingBooking.date = existingBooking.alternateDate;
          existingBooking.slot = existingBooking.alternateSlot;
          await existingBooking.save();
        } else {
          existingBooking.status = 'Rejected';
          await existingBooking.save();
        }
      } else {
        existingBooking.status = 'Rejected';
        await existingBooking.save();
      }
    }
  }
  return true; // All conflicts resolved
}

// Create Booking
router.post('/create', isAuthenticated, async (req, res) => {
  const { venueId, date, slot, type, alternateDate, alternateSlot } = req.body;

  try {
    const applicant = await User.findById(req.user.id);
    if (!applicant) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    const venue = await Hall.findById(venueId);
    if (!venue) {
      return res.status(400).json({ error: 'Invalid venue' });
    }

    // Determine the priority of the new booking
    let newBookingPriority;
    if (applicant.role === 'CPO' || applicant.role === 'Registrar') {
      newBookingPriority = 2; // Highest priority
    } else if (type === 'Official') {
      newBookingPriority = 1; // Medium priority
    } else {
      newBookingPriority = 0; // Lowest priority
    }

    // Check and resolve conflicts
    const canBook = await checkAndResolveConflicts({
      venue: venueId,
      date,
      slot
    }, newBookingPriority);

    if (!canBook) {
      return res.status(400).json({ error: 'Unable to book the slot due to conflicts' });
    }

    // Create the new booking
    const newBooking = new Booking({
      venue: venueId,
      date,
      slot,
      type,
      applicant: req.user.id,
      alternateDate,
      alternateSlot,
      priority: newBookingPriority
    });

    // Automatic approval logic
    if (applicant.role === 'CPO' || applicant.role === 'Registrar') {
      newBooking.status = 'Approved';
      newBooking.approvedByHOD = true;
      newBooking.approvedByFinalApprover = true;
    } else if (applicant.role === 'HOD') {
      newBooking.approvedByHOD = true;
    }
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
});

// Get Bookings for User
router.get('/bookings', isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ applicant: req.user.id })
      .populate('venue')
      .populate('approver', 'name email role');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Approve Booking by HOD
router.post('/approve/hod/:id', isAuthenticated, hasRole(['HOD']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.approvedByHOD) {
      return res.status(400).json({ error: 'Booking already approved by HOD' });
    }

    booking.approvedByHOD = true;
    booking.approver = req.user.id;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});

// Approve Booking by Final Approver (Registrar or CPO)
router.post('/approve/final/:id', isAuthenticated, hasRole(['Registrar', 'CPO']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('venue');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (!booking.approvedByHOD) {
      return res.status(400).json({ error: 'Booking must be approved by HOD first' });
    }

    if (booking.approvedByFinalApprover) {
      return res.status(400).json({ error: 'Booking already approved by final approver' });
    }

    // Check if the user has authority over the venue
    const venueName = booking.venue.name;
    const userRole = req.user.role;
    const authorizedVenues = ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'];

    if(userRole === 'CPO' && authorizedVenues.includes(venueName)){
      return res.status(403).json({ error: 'CPO can only approve bookings for specific venues' });
    }

    if (userRole === 'Registrar' && !authorizedVenues.includes(venueName)) {
      return res.status(403).json({ error: 'Registrar can only approve bookings for specific venues' });
    }

    booking.approvedByFinalApprover = true;
    booking.status = 'Approved';
    booking.approver = req.user.id;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});

// Reject Booking
router.post('/reject/:id', isAuthenticated, hasRole(['HOD', 'Registrar', 'CPO']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'Rejected';
    booking.approver = req.user.id;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});

// // Get Pending Approvals, Right now i am verifying the code
// router.get('/pending-approvals', isAuthenticated, hasRole(['HOD', 'CPO', 'Registrar']), async (req, res) => {
//   try {
//     let query = { status: 'Pending' };

//     if (req.user.role === 'HOD') {
//       query = { 
//         ...query,
//         approvedByHOD: false, 
//         approvedByFinalApprover: false, 
//         'applicant.department': req.user.department 
//       };
//     } else if (req.user.role === 'CPO') {
//       query = { 
//         ...query,
//         approvedByHOD: true, 
//         approvedByFinalApprover: false,
//         'venue.name': { $nin: ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'] }
//       };
//     } else if (req.user.role === 'Registrar') {
//       query = { 
//         ...query,
//         approvedByHOD: true, 
//         approvedByFinalApprover: false,
//         'venue.name': { $in: ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'] }
//       };
//     }

//     const pendingBookings = await Booking.find(query)
//       .populate('venue')
//       .populate('applicant', 'name email department');

//     res.json(pendingBookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch pending approvals' });
//   }
// });
router.get('/pending-approvals', isAuthenticated, hasRole(['HOD', 'CPO', 'Registrar']), async (req, res) => {
  try {
    let query = { status: 'Pending' };

    if (req.user.role === 'HOD') {
      query = { 
        ...query,
        approvedByHOD: false, 
        approvedByFinalApprover: false
      };
      const applicants = await User.find({ department: req.user.department });
      const applicantIds = applicants.map(a => a._id);
      query.applicant = { $in: applicantIds };
    } else if (req.user.role === 'CPO' || req.user.role === 'Registrar') {
      query = { 
        ...query,
        approvedByHOD: true, 
        approvedByFinalApprover: false
      };
    }

    const pendingBookings = await Booking.find(query)
      .populate('venue')
      .populate('applicant');

    // Filter the results based on venue names after populating
    const filteredBookings = pendingBookings.filter(booking => {
      if (req.user.role === 'CPO') {
        return !['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'].includes(booking.venue.name);
      } else if (req.user.role === 'Registrar') {
        return ['Pragya Bhawan', 'Pragya Hall', 'Vigyan Hall'].includes(booking.venue.name);
      }
      return true; // For HOD, return all bookings
    });

    res.json(filteredBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// Delete Booking
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check if the user is the owner of the booking
    if (booking.applicant.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this booking' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully', _id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;