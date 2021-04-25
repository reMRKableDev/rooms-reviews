const express = require("express");
const router = express.Router();

const Room = require("../models/Room.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* 
  GET - All rooms *** This route should be accessible by everyone
*/
router.get("/rooms", (req, res, next) => {
  Room.find({})
    .populate("owner reviews")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .then((allRoomsResults) => {
      // Check if there is a user loggedIn
      if (req.user) {
        allRoomsResults.forEach((roomItem) => {
          // Check the owners of the room
          if (roomItem.owner.equals(req.user)) {
            // if the room is of the loggedInUser --> mark it as isOwner
            roomItem.isOwner = true;
          }
        });
      }
      // render the page with all the rooms + marked rooms
      res
        .status(200)
        .render("rooms/all-rooms", { rooms: allRoomsResults, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

module.exports = router;
