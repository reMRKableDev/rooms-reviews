const passport = require("passport");
const User = require("../models/User.model");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((findErr) => done(findErr));
});
