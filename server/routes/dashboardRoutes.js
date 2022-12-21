const router = require("express").Router();
const path = require("path");
const authController = require("../controller/authController"); //use this as a middleware for authentication.
//Use authController.protect to validate a user before they access any resource.
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router
  .get("/", async (req, res) => {
    const jwtCookie = req.headers.cookie?.split("=")[1];

    if (!jwtCookie) {
      return res.redirect("/login");
    }

    const jwtUser = jwt.decode(jwtCookie);

    const user = await User.findOne({ _id: jwtUser?.id });

    if (!user) {
      return res.redirect("/login");
    }

    const { firstName, lastName, email } = user;

    res.render("dashboard", {
      layout: false,
      fullName: `${firstName} ${lastName}`,
      email,
    });
  })
  .get("/about", (_, res) => {
    res.sendFile(getFile("about.html"));
  });
module.exports = router;

const getFile = (filename) =>
  path.join(__dirname, "../../", "client", filename);
