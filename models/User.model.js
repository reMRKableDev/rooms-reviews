const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, lowercase: true },
    passwordHash: { type: String },
    fullName: { type: String, trim: true, lowercase: true },
    googleId: { type: String },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
