//IMPORT MODEL
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//GET A USER

//CREATE USER

//UPDATE USER

//DELETE USER

//Logic for handling not found
// if (!user) {
//   return next(new AppError("No user found with such credentials", 404));
// }
