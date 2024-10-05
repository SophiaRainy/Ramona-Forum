const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (user) {
        return done(null, user);
      }
      user = new User({
        facebookId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

module.exports = passport;