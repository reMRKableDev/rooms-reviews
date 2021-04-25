const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

// Use & define local strategy
const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    User.findOne({ email })
      .then((foundUser) => {
        if (!foundUser) {
          return done(
            null,
            false,
            req.flash("error", "Incorrect email! Please try again")
          );
        }

        bcrypt
          .compare(password, foundUser.passwordHash)
          .then((verifiedStatus) => {
            return verifiedStatus
              ? done(null, foundUser)
              : done(
                  null,
                  false,
                  req.flash("error", "Incorrect password! Please try again")
                );
          })
          .catch((compareErr) => done(compareErr));
      })
      .catch((findErr) => done(findErr));
  }
);

module.exports = localStrategy;
