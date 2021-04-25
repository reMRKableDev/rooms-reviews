const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      name: "passportCookie",
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
    })
  );
};
