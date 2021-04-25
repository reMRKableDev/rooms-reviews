const isUserLoggedIn = (req, res, next) => {
  // req.user ? next() : res.redirect("/login");
  req.isAuthenticated() ? next() : res.redirect("/login");
};

module.exports = isUserLoggedIn;
