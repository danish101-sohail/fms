// backend/routes/index.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Root Route
router.get('/', (req, res) => {
    res.send({
        "HELLO WORLD": "SERVER STARTED"
    });
});


// Include other routes
router.use('/hall', require('./hall'));
router.use('/booking', require('./booking'));
router.use('/users', require('./user')); // Include the users route
router.use('/admin', require('./admin')); // Include the admin route

module.exports = router;