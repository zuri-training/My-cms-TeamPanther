const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// Chaining the various routes!
//ADMIN CAN HANDLE THESE FUNCTIONS
router
  .get(
    "/",
    authController.protect,
    authController.restrictTo("admin", "privileged-user", "user"),
    userController.getAllUsers
  )
  .get(
    "/:email",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.getOneUser
  )
  .post(
    "/",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.createNewUser
  )
  .put(
    "/:id",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.updateOneUser
  )
  .patch(
    "/:id",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.updateOneUser
  )
  .delete(
    "/",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.deleteOneUser
  );

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
  .post("/login", authController.login)
  .post("/forgotPassword", authController.forgotPassword)
  .patch("/resetPassword/:token", authController.resetPassword)
  .patch(
    "/dash-board/updatePassword",
    authController.protect,
    authController.updatePassword
  );

module.exports = router;
