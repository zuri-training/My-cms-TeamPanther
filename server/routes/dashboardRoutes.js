const router = require("express").Router();
const path = require("path");
const authController = require("../controller/authController"); //use this as a middleware for authentication.
//Use authController.protect to validate a user before they access any resource.

router
  .get("/", (_, res) => {
    res.render("dashboard", {
      layout: false,
      fullName: "Oluwatowo Rosanwo",
      tagName: "@crimson",
    });
  })
  .get("/about", (_, res) => {
    res.sendFile(getFile("about.html"));
  });
module.exports = router;

const getFile = (filename) =>
  path.join(__dirname, "../../", "client", filename);
