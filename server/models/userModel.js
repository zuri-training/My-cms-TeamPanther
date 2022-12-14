const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password must be at least eight digit"],
      minlength: [8, "Please provide at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password didn't match"],
      validate: {
        //This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the Same",
      },
    },
    changedPasswordAt: Date,
    photo: String,
  },
  { timestamps: true }
);

//Implementing a Logic to actually encrypt the password before saving user document in the db
userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//ON LOGIN confirm if password is true
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //returns boolean
};

//Function to check whether a user changed password // false means not changed
userSchema.methods.changedPasswordAfter = (JWTTimestamp) => {
  if (this["changedPasswordAt"]) {
    const changedTimestamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
