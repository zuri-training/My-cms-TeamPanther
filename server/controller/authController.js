const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const { create } = require("../models/userModel");

//Creating a function for the JWT - token generator
const signToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_TOKEN_KEY}`, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

//We can also implement a create and send toke function
const createAndSendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + `${process.env.JWT_COOKIE_EXPIRES_IN}` * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //Remove the password from the output
  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user: user,
    },
  });
};

//SIGN UP LOGIC

exports.signup = async (req, res) => {
  try {
    // const newUser = await User.create(req.body); --> This pattern is inefficient for security reasons

    //Get newUser input
    const { firstName, lastName, email, role, password, passwordConfirm } =
      await req.body; //destructuring
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
      role: role,
      firstName: firstName,
      lastName: lastName,
      email: email,
      // userName: this.email.split("@")[0],
      password: password,
      passwordConfirm: passwordConfirm,
    });

    const userName = await newUser.email.split("@")[0];
    newUser.userName = userName;
    // await newUser.save(); //--> Not necessary here because it causes some unexpected behaviors.

    //Create and SendToken
    createAndSendToken(newUser, 201, res);
    //or
    // const token = await signToken(newUser._id);

    // return res.status(201).json({
    //   status: "Success",
    //   token,
    //   data: {
    //     user: newUser,
    //   },
    // });
  } catch (err) {
    res.status(400).json({
      status: "fails",
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
  const correct = await user.correctPassword(password, user.password); //using the instance method defined in userModels

  if (!user || !correct) {
    return next(new AppError("Incorrect email or password", 401)); //Customize error handler function
  }

  //3. send the jwt back to the client
  createAndSendToken(user, 200, res);
  //   const token = signToken(user._id);

  //   res.status(200).json({
  //     status: "success",
  //     token,
  //   });
});

// IMPLEMENT MIDDLE WARE TO PROTECT SOME ROUTES
exports.protect = async (req, res, next) => {
  //1. Get the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = await req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "Access Denied 🛑❌, you have not signed up or logged in. Sign up to access this resource!",
        401
      )
    );
  }

  try {
    //2. Validate the token
    const token = await req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, `${process.env.JWT_TOKEN_KEY}`);

    if (!decoded) {
      return next(
        new AppError("Invalid or expired token, Please log in again.", 401)
      );
    }

    //3. Check if the user exists
    const currentUser = await User.findById(decoded.id);
    // console.log(currentUser);

    if (!currentUser) {
      return next(
        new AppError("The user with this token no longer exists!", 401)
      );
    }

    // 4. Check if the user changed password after the jwt was issued

    const changedTimestamp = await parseInt(
      currentUser.changedPasswordAt.getTime() / 1000,
      10
    );
    const passwordChangedLater = await (decoded.iat < changedTimestamp);
    if (passwordChangedLater) {
      return next(
        new AppError(
          "User with this credentials have changed password, Please log in again!",
          401
        )
      );
    }

    //5. Put the user request data on request and then, Grant access to that protected route...
    req.user = currentUser; // PUT THE USER DATA ON THE REQ FOR FUTURE NEEDs...

    // 6. Activate the next middleware by returning next()
    return next();
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

//LOGIC FOR RESTRICTING ACCESS PRIVILEGES TO CERTAIN ROLES
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to access this resource", 403)
      );
    }
    next();
  };
};

//RESET PASSWORD FUNCTIONALITY
exports.forgotPassword = async (req, res, next) => {
  //1. Get the user from POST req via email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }
  //2. Generate Password Reset Token
  let resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // console.log(resetToken);

  //3. send reset token to user'email
  let resetURL = await `${req.protocol}://${req.get(
    "host"
  )}/login/resetPassword/${resetToken}`;

  let message = `Forgot your password? Submit a PATCH request with your new password and password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token valid for only 10 minutes.`,
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // return next(
    //   new AppError("There was an error sending the email. Try again later", 500)
    // );
    return res.status(500).json({
      status: "Message could not Send!",
      error: err.message,
    });
  }
};

//Functionality for reset PassWord
exports.resetPassword = async (req, res, next) => {
  //Reset Password Flow
  //1. Get user based on token
  try {
    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    console.log(hashedToken);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    // 2. If token has not expired, and there is a user, set the new password
    if (!user) {
      return next(
        new AppError(
          "Sorry, invalid or expired token, please repeat the process!, 400"
        )
      );
    }

    user.password = await req.body.password;
    user.passwordConfirm = await req.body.passwordConfirm;
    user.passwordResetToken = await undefined;
    user.passwordResetExpires = await undefined; //The last two steps will reset the last two user values here...
    // Don't forget to save because the steps above will only modify the database and not save it...
    await user.save();
    //3. Update changed password functionality for the current user

    //4. Log the  user in, Send JWT TO THE CLIENT...
    //or
    createAndSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //   status: "success",
    //   token,
    // });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

//Functionality to update password without forgetting it.

exports.updatePassword = async (req, res, next) => {
  try {
    //1. Get the user asking to update
    const user = await User.findOne(req.user._id).select("+password");
    console.log(user);
    //2. Check if the POSTed password is currently correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(
        new AppError(
          "Please enter your current password to reset it!, or navigate to reset password",
          401
        )
      );
    }
    //3. If so, update the password
    (user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm);
    await user.save();

    //user.fineByIdAndUpdate will not work as intended!

    //4. Log the  in, send the JWT back to the user...
    createAndSendToken(user, 200, res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //   status: "success",
    //   token,
    // });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
