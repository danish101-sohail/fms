// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');
// const bcrypt = require('bcrypt');

// // Configure Passport to use the local strategy for user authentication
// passport.use(new LocalStrategy({
//   usernameField: 'email'
// }, async (email, password, done) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return done(null, false, { message: 'Incorrect email.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));

// // Serialize user information into the session
// passport.serializeUser((user, cb) => {
//   process.nextTick(() => {
//     cb(null, { id: user.id, email: user.email, role: user.role });
//   });
// });

// // Deserialize user information from the session
// passport.deserializeUser((user, cb) => {
//   process.nextTick(() => {
//     cb(null, user);
//   });
// });

// module.exports = passport;

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;