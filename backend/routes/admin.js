const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Hall = require('../models/hall');
const User = require('../models/user');
const passport = require('../config/passport');

// Import authentication middleware 
const isAuthenticated = passport.authenticate('jwt', { session: false });

// Admin middleware
const isAdmin = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all bookings
router.get('/bookings', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('venue')
      .populate('applicant')
      .populate('approver');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Delete any booking
router.delete('/bookings/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Get venue analytics
router.get('/venues/:id/analytics', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ venue: req.params.id });
    
    // Monthly bookings count
    const monthlyBookings = {}; 
    bookings.forEach(booking => {
      const month = new Date(booking.date).getMonth();
      monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
    });

    // Slot distribution
    const slotCounts = {
      Forenoon: bookings.filter(b => b.slot === 'Forenoon').length,
      Afternoon: bookings.filter(b => b.slot === 'Afternoon').length
    };

    res.json({
      monthlyBookings,
      slotCounts,
      totalBookings: bookings.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;