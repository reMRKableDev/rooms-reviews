const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();

const User = require("../models/User.model");
const passport = require("passport");

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

/* GET login page */
router.get("/login", (req, res) => {
  res.render("auth/login", { message: req.flash("error") });
});

/* POST - login page */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

/* GET signup page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

/* POST signup page */
router.post("/signup", (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res
      .status(400)
      .render("auth/signup", { errorMessage: "Form cannot be empty!" });
    return;
  }

  User.findOne({ email })
    .then((userResult) => {
      // In the case that the user exist
      if (userResult) {
        res.status(400).render("auth/signup", {
          errorMessage: "Email already exists",
        });
        return;
      }

      // In the case that it is a new user
      bcrypt
        .hash(password, 10)
        .then((passwordHash) => {
          return User.create({ email, passwordHash, fullName });
        })
        .then((newUser) => {
          req.login(newUser, (err) => {
            if (err) {
              res.status(500).render("auth/signup", {
                errorMessage: "Login failed after signup",
              });
              return;
            }
            res.redirect("/profile");
          });
        })
        .catch((hashErr) => next(hashErr));
    })
    .catch((findErr) => next(findErr));
});

/* POST - logout */
router.get("/logout", (req, res) => {
  // req.logout --> passport method to remove user from passport session and log out of app
  req.logout();
  res.redirect("/");
});

module.exports = router;
