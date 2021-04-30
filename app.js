require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("./configs/passportLocal.config");
const googleStrategy = require("./configs/passportGoogle.config");
const isUserLoggedIn = require("./middleware/index");

require("./configs/db.config");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

require("./configs/session.config")(app);

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Passport configurations
app.use(passport.initialize());
app.use(passport.session());
require("./configs/serialize.config");
passport.use(localStrategy);
passport.use(googleStrategy);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Rooms & Reviews Application";

app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth.routes"));
app.use("/", isUserLoggedIn, require("./routes/reviews.routes"));
app.use("/", isUserLoggedIn, require("./routes/user.routes"));
app.use("/", isUserLoggedIn, require("./routes/room.routes"));

module.exports = app;
