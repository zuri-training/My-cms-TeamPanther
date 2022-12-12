const express = require("express");
require("dotenv").config();
require("./config/database").connect();
const auth = require("./middleware/auth");

// import user
const User = require("./model/user");

// const { json } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//LOGIC

//ROUTES...
//Register route
app.post("/register", async (req, res) => {
  try {
    //Get user input
    const { firstName, lastName, email, password } = await req.body;
    //Validate user
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required!");
    }
    //Check if user already exists
    //Validate if user exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User already exists. Please Login.");
    }
    //Encrypt user password
    const encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create a user in our dataBase
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(), //sanitize
      password: encryptedUserPassword,
    });

    //Create user token
    // process.env.TOKEN_KEY
    const secretKey = await `${process.env.SECRET_KEY}`;
    const token = await jwt.sign({ user_id: user._id, email }, secretKey, {
      expiresIn: "5h",
    });
    // save user token
    user.token = token;

    // return new user;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

//Login Route
app.post("/login", async (req, res) => {
  const { email, password } = await req.body;

  //Validate the user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  //validate if user exist in out database
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    //Create a token
    const token = await jwt.sign(
      { user_id: user._id, email },
      `${process.env.SECRET_KEY}`,
      {
        expiresIn: "5h",
      }
    );
    //save token
    user.token = token;
    //return user
    return res.status(200).json(user);
  }
  res.status(400).send("Invalid Credentials");
});

//Auth Route
app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to Our CMS Platform");
});

module.exports = app;
