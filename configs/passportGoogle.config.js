const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

// Use & define local strategy
module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true,
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("Google account details:", profile);

    User.findOne({ googleID: profile.id })
      .then((user) => {
        if (user) {
          done(null, user);
          return;
        }

        User.create({
          email: profile.emails[0].value,
          fullName: profile.displayName,
          googleId: profile.id,
        })
          .then((newUser) => {
            done(null, newUser);
          })
          .catch((err) => done(err)); // closes User.create()
      })
      .catch((err) => done(err)); // closes User.findOne()
  }
);
