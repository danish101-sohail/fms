// // backend/routes/user.js
// const express = require('express');
// const router = express.Router();
// const passport = require('passport');

// // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(403).json({ error: 'Unauthorized' });
// };

// //Login User
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ error: 'Internal Server Error', redirectTo: '/failed' });
//     }
//     if (!user) {
//       return res.status(401).json({ error: 'Authentication failed', message: info.message, redirectTo: '/failed' });
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to establish session', redirectTo: '/failed' });
//       }
//       return res.json({ 
//         message: 'Login successful', 
//         user: { id: user.id, email: user.email, role: user.role },
//         redirectTo: '/dashboard'
//       });
//     });
//   })(req, res, next);
// });

// // Get User Details
// router.get('/me', isAuthenticated, (req, res) => {
//   res.json(req.user);
// });

// // Logout User
// router.post('/logout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to log out' });
//     }
//     res.clearCookie('connect.sid');
//     return res.json({ message: 'Logged out successfully', redirectTo: '/login' });
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed', redirectTo: '/login' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Authentication failed',  redirectTo: '/login'});
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, isAdmin: user.isAdmin },
      redirectTo: user.isAdmin ? '/admin' : '/dashboard'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', redirectTo: '/login' });
  }
});

// Get User Details
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

// Logout User
router.post('/logout', (req, res) => {
  // With JWT, we don't need to do anything server-side for logout
  res.json({ message: 'Logout successful', redirectTo: '/login' });
});

module.exports = router;