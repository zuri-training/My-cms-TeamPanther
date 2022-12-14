const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null, required: true },
    lastName: { type: String, default: null, required: true },
    email: {
      type: String,
      unique: true,
      default: null,
      required: true,
      lower: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password must be at least eight digit"],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [false, "Password didn't match"],
      minlength: 8,
    },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
