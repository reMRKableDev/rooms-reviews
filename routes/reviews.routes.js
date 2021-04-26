const { Router } = require("express");
const router = Router();

const Review = require("../models/Review.model");
const Room = require("../models/Room.model");

/* POST - Create Reviews */
router.post("/rooms/:roomId/add-review", (req, res, next) => {
  const { roomId } = req.params;
  const { review } = req.body;
  const { user } = req;

  Review.create({ user: user._id, review })
    .then((newReview) => {
      Room.findById(roomId)
        .then((foundRoom) => {
          foundRoom.reviews.push(newReview._id);

          return foundRoom.save();
        })
        .then(() => {
          res.redirect(`/rooms`);
        })
        .catch((roomFindErr) => next(roomFindErr));
    })
    .catch((createReviewErr) => next(createReviewErr));
});

/* POST - Create Reviews */

module.exports = router;
