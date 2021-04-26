const { Router } = require("express");
const router = Router();

const Room = require("../models/Room.model");
const fileUploader = require("../configs/cloudinary.config");

/* 
  GET - Create Room Form 
*/
router.get("/create-room", (req, res) => {
  const { user } = req;
  res.status(200).render("rooms/create", { user });
});

/* 
  POST - Save Form Data to Db
  Makes use of the multer upload to upload to cloudinary
*/
router.post(
  "/create-room",
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    const { name, description } = req.body;
    const { _id } = req.user;

    // have a default value for image url
    let imageUrl = "https://via.placeholder.com/150";

    // Sometimes images aren't added with a room.
    // To take that into consideration, we will first check if there is a req.file
    // if the file is there, add the cloudinary url.
    // Otherwise the default value above will be used for the image
    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }

    // imageUrl now can either be the cloudinary url or the default url above
    Room.create({ name, description, imageUrl, owner: _id })
      .then(() => {
        res.redirect("/rooms");
      })
      .catch((createErr) => next(createErr));
  }
);

/* GET - Render a specific room */
router.get("/rooms/:roomId", (req, res, next) => {
  const { roomId } = req.params;

  Room.findById(roomId)
    .populate("owner")
    .then((roomResult) => {
      // Check if there is a user loggedIn
      if (req.user) {
        // Check the owners of the room
        if (roomResult.owner.equals(req.user)) {
          // if the room is of the loggedInUser --> mark it as isOwner
          roomResult.isOwner = true;
        }
      }
      res.status(200).render("rooms/details", { roomResult, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

/* GET - Render Edit Form
 */
router.get("/rooms/:roomId/edit", (req, res, next) => {
  const { roomId } = req.params;

  Room.findById(roomId)
    .then((roomResult) => {
      res.status(200).render("rooms/edit-room", { roomResult, user: req.user });
    })
    .catch((findErr) => next(findErr));
});

/* 
POST - Update With Edit Form Data 
  Makes use of the multer upload to upload to cloudinary
*/
router.post(
  "/rooms/:roomId/edit",
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    const { roomId } = req.params;
    const { name, description } = req.body;

    // have a default value for image url
    let imageUrl = "https://via.placeholder.com/150";

    // Sometimes images aren't added with a room.
    // To take that into consideration, we will first check if there is a req.file
    // if the file is there, add the cloudinary url.
    // Otherwise the default value above will be used for the image
    if (req.file) {
      const { path } = req.file;
      imageUrl = path;
    }

    // imageUrl now can either be the cloudinary url or the default url above
    Room.findByIdAndUpdate(roomId, { name, description, imageUrl })
      .then((updatedRoom) => {
        res.redirect(`/rooms/${updatedRoom._id}`);
      })
      .catch((findUpdateErr) => next(findUpdateErr));
  }
);

/* POST - Delete a room */
router.post("/rooms/:roomId/delete", (req, res, next) => {
  const { roomId } = req.params;

  Room.findByIdAndDelete(roomId)
    .then(() => {
      res.redirect("/rooms");
    })
    .catch((deleteErr) => {
      next(deleteErr);
    });
});

module.exports = router;
