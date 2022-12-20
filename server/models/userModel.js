const crypto = require("crypto"); //built in node module we will use to generate password reset token.
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose.set("setDefaultsOnInsert", false);

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "privileged-user", "admin"],
      default: "user",
    },
    userName: String,
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: String,
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
    changedPasswordAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
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

//This middleware will be implemented in the background when we modify password or create new document
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1000;
  next();
});

//Function to check whether a user changed password // false means not changed -->This didn't work here, but worked in
//auth controllers
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  try {
    if (this.changedPasswordAt) {
      const changedTimestamp = await parseInt(
        this.changedPasswordAt.getTime() / 1000,
        10
      );
      return await (JWTTimestamp < changedTimestamp);
    }
    return false;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//ON LOGIN confirm if password is true
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //returns boolean
};

//TO CREATE PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = async function () {
  try {
    const resetToken = await crypto.randomBytes(32).toString("hex");

    //encrypt
    this.passwordResetToken = await crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = mongoose.model("User", userSchema);
