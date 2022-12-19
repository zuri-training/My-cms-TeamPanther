//IMPORT MODEL
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//SET UP A FILTER OBJECT TO EXEMPT FIELDS THAT MUST NOT BE UPDATED
const myObjectFilter = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj.key;
  });
  return newObj;
};

//Creating a function for the JWT - token generator
const signToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_TOKEN_KEY}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

//GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // console.log(req.query);

    res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//GET A USER on HTTP GET request
exports.getOneUser = async (req, res, next) => {
  try {
    //Filter by Email
    const { email } = await req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "User fetch Failed",
      message: err.message,
    });
  }
};

//CREATE USER on POST REQUEST
exports.createNewUser = async (req, res) => {
  try {
    const { role, firstName, lastName, email, password, passwordConfirm } =
      await req.body;
    //1. Use userSchema to form new User
    const newUser = await User.create({
      role: role,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });

    const userName = await newUser.email.split("@")[0];
    newUser["userName"] = await userName;
    // await newUser.save();

    const token = await signToken(newUser._id);
    res.status(200).json({
      status: "success",
      token,
      message: `Admin successfully added new user at ${Date.now().toString()}`,
      data: {
        newUser,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
//UPDATE USER on POST
exports.updateOneUser = async (req, res) => {
  try {
    //filter body
    const filteredBody = await myObjectFilter(
      req.body,
      "firstName",
      "lastName",
      "email"
    );

    //Get the user to update filtered fields;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    //return response to client
    return res.status(200).json({
      status: `User updated successfully at ${Date.now().toLocaleString()}.`,
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

//DELETE USER
exports.deleteOneUser = async (req, res, next) => {
  try {
    //find user to delete
    const userToDelete = await User.findOneAndDelete({
      email: req.body.email || req.query.email,
    });
    if (userToDelete) {
      return res.status(200).json({
        status: `The user with email: ${
          req.body.email || req.query.email
        } and userName: ${
          userToDelete.userName
        } has been deleted successfully! `,
      });
    } else {
      return res.status(404).json({
        message: "No such user exists!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};


//A User deleting himself
exports.deleteMe = async (req, res, next) =>{
  const user = await User.findByIdAndUpdate(req.user.id, {active : false});

  res.status(204).json({
    status : success,
    data : null,
  })
}

//Logic for handling not found
// if (!user) {
//   return next(new AppError("No user found with such credentials", 404));

// for routes looking like this `/products?page=1&pageSize=50`
// app.get('/products', function(req, res) {
//   const page = req.query.page;
//   const pageSize = req.query.pageSize;
//   res.send(`Filter with parameters ${page} and ${pageSize});`
// }
