// backend/routes/hall.js
const express = require('express');
const router = express.Router();
const Hall = require('../models/hall');
const User = require('../models/user');
const Booking = require('../models/booking');
const passport = require('../config/passport');

// Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(403).json({ error: 'Unauthorized' });
// };
const isAuthenticated = passport.authenticate('jwt', { session: false });

// Middleware to check if user has specific roles
const hasRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden' });
};

// Create Hall (Restricted to Registrar and CPO)
router.post('/create_hall', isAuthenticated, hasRole(['Registrar', 'CPO']), async (req, res) => {
  const { name, slots, reservedForOfficial } = req.body;

  const newHall = new Hall({
    name,
    slots,
    reservedForOfficial
  });

  try {
    const savedHall = await newHall.save();
    res.status(201).json(savedHall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hall' });
  }
});

// Get All Halls
router.get('/view_halls', async (req, res) => {
  try {
    const halls = await Hall.find({});
    res.json(halls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch halls' });
  }
});

// Get All Halls with Booking Status
router.get('/halls-status', async (req, res) => {
  try {
    const halls = await Hall.find({});
    const currentDate = new Date();
    const bookings = await Booking.find({
      date: { $gte: currentDate },
      status: { $in: ['Approved', 'Pending'] }
    }).populate('venue');

    const hallsWithStatus = halls.map(hall => {
      const hallBookings = bookings.filter(booking => booking.venue._id.toString() === hall._id.toString());
      return {
        ...hall.toObject(),
        bookings: hallBookings.map(booking => ({
          date: booking.date,
          slot: booking.slot,
          type: booking.type
        }))
      };
    });

    res.json(hallsWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch halls with status' });
  }
});

// // Clear Hall Status (Restricted to Registrar and CPO)
// router.post('/clear_hall', isAuthenticated, hasRole(['Registrar', 'CPO']), async (req, res) => {
//   const { name } = req.body;

//   try {
//     const updatedHall = await Hall.findOneAndUpdate(
//       { name },
//       { $set: { 'slots.$[].status': 'Not Filled' } },
//       { new: true }
//     );
//     res.json(updatedHall);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to clear hall status' });
//   }
// });

module.exports = router;