const router = require("express").Router();
const path = require("path");
const authController = require("../controller/authController");

router
  .get("/", (_, res) => res.sendFile(getFile("index.html")))
  .get("/about", (_, res) => res.sendFile(getFile("about.html")))
  .get("/faq", (_, res) => res.sendFile(getFile("faq.html")))
  .get("/login", (_, res) => res.sendFile(getFile("login.html")))
  .get("/register", (_, res) => res.sendFile(getFile("createaccount.html")))
  .get("/forgot-password", (_, res) =>
    res.sendFile(getFile("forgot-password.html"))
  )
  .get("/pricing", (_, res) => res.sendFile(getFile("ourpricing.html")))
  .get("/templates", (_, res) => res.sendFile(getFile("template.html")));

const getFile = (filename) =>
  path.join(__dirname, "../../", "client", filename);

module.exports = router;
