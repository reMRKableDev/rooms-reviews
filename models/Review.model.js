const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  review: { type: String },
});

module.exports = model("Review", reviewSchema);
