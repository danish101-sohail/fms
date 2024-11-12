// const express = require('express');
// const port = 8000;
// const app = express();
// const db = require('./config/mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const passport = require('./config/passport');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS configuration
// const allowedOrigins = ['http://localhost:3000'];
// const corsOptions = {
//   origin: allowedOrigins,
//   credentials: true
// };
// app.use(cors(corsOptions));

// // Session configuration
// // app.use(session({
// //   secret: process.env.SESSION_SECRET || 'my_super_secret_key_12345',
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === 'production',
// //     maxAge: 24 * 60 * 60 * 1000 // 24 hours
// //   },
// //   store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/new_new_clone', collectionName: "sessions" })
// // }));

// // Initialize Passport and session
// app.use(passport.initialize());
// app.use(passport.session());

// // Initialize Passport and session
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api', require('./routes/index'));

// // Serve static files from the React frontend app
// const rootPath = __dirname.substring(0, __dirname.length - 8);
// app.use(express.static(rootPath + '/frontend/build'));

// // Any other routes should be handled by the React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(rootPath, 'frontend', 'build', 'index.html'));
// });

// // Start the server
// app.listen(port, (err) => {
//   if (err) {
//     console.log("Error while starting the server ", err);
//     return;
//   }
//   console.log("Server is up and running on port: ", port);
// });

const express = require('express');
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const passport = require('./config/passport');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};
app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api', require('./routes/index'));

// Serve static files from the React frontend app
const rootPath = __dirname.substring(0, __dirname.length - 8);
app.use(express.static(rootPath + '/frontend/build'));

// Any other routes should be handled by the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(rootPath, 'frontend', 'build', 'index.html'));
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log("Error while starting the server ", err);
    return;
  }
  console.log("Server is up and running on port: ", port);
});