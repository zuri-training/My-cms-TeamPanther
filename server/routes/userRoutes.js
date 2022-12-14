const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// Chaining the various routes!
//ADMIN CAN HANDLE THESE FUNCTIONS
// router
//   .get("/", controller.retrieveAllUsers)
//   .get("/:id", controller.getOneUsers)
//   .post("/", controller.createAUsers)
//   .put("/:id", controller.updateOneUsers)
//   .delete("/:id", controller.deleteOneUsers);

//PROTECT PAGES WITH MIDDLE WARE
// router
//   .get("/", authController.protect, userController.retrieveAllUsers)
//   .get("/:id", authController.protect, userController.getOneUsers)
//   .post("/", authController.protect, userController.createAUsers)
//   .put("/:id", authController.protect, userController.updateOneUsers)
//   .delete("/:id", authController.protect, userController.deleteOneUsers);

//authentication Routes : Signup & Login
router
  .post("/signup", authController.signup)
  .post("/login", authController.login);

module.exports = router;
