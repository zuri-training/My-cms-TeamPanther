const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//Creating a function for the JWT - token generator
const signToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_TOKEN_KEY}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

//SIGN UP LOGIC

exports.signup = async (req, res) => {
  try {
    // const newUser = await User.create(req.body); --> This pattern is inefficient for security reasons

    //Get newUser input
    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      changedPasswordAt,
    } = await req.body; //destructuring
    //Validate user
    if (!(email && password && passwordConfirm && firstName && lastName)) {
      return res.status(400).send("All input is required!");
    }
    //Check if user already exists
    //Validate if user exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User already exists. Please Login.");
    }
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      changedPasswordAt: changedPasswordAt,
    });

    //Create Token
    const token = signToken(newUser._id);

    return res.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//LOGIN LOGIC

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password exists

  if (!email || !password) {
    return next(
      new AppError("Please provide a valid email and password!", 400)
    );
  }

  //2. Check if the user exists and the password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new AppError("No user with this email, please create and account", 401)
    );
  }

  const correct = await user.correctPassword(password, user.password); //using the instance method defined in userModels

  if (!correct) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3. send the jwt back to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

// IMPLEMENT MIDDLE WARE TO PROTECT SOME ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  //1. Get the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "Invalid authorization, you have not signed up or logged in. Sign up to access this resource!",
        401
      )
    );
  }

  //2. Validate the token
  const decoded = await promisify(jwt.verify)(
    token,
    `${process.env.JWT_TOKEN_KEY}`
  );
  // if (!decoded) {
  //   return next(
  //     new AppError("Invalid or expired token, Please log in again.", 401)
  //   );
  // }

  //3. Check if the user exists
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(
      new AppError("The user with this token no longer exists!", 401)
    );
  }

  //4. Check if the user changed password after the jwt was issued
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "User with this credentials have changed password, Please log in again!",
        401
      )
    );
  }

  //Grant access to that protected route
  //Put the user request data on request
  req.user = freshUser; // PUT THE USER DATA ON THE REQ FOR FUTURE NEED
  next();
});
