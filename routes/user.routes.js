const { Router } = require("express");
const router = Router();

router.get("/profile", (req, res) => {
  // req.user --> where the user stored in the passport session can be found
  const { user } = req;
  res.status(200).render("users/profile", { user });
});

module.exports = router;
