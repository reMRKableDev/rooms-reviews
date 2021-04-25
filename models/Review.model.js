const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  review: { type: String, maxlength: 200 },
});

module.exports = model("Review", reviewSchema);
