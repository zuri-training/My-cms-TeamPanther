const router = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// Chaining the various routes!
//ADMIN CAN HANDLE THESE FUNCTIONS
router
  .get(
    "/users",
    authController.protect,
    authController.restrictTo("admin", "privileged-user", "user"),
    userController.getAllUsers
  )
  .get(
    "/users/:email",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.getOneUser
  )
  .post(
    "/users",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.createNewUser
  )
  .put(
    "/users:id",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.updateOneUser
  )
  .patch(
    "/users:id",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.updateOneUser
  )
  .delete(
    "/users",
    authController.protect,
    authController.restrictTo("admin", "privileged-user"),
    userController.deleteOneUser
  );

//authentication Routes : Signup & Login
router
  .post("/signup", authController.signup)
  .post("/login", authController.login)
  .post("/login/forgotPassword", authController.forgotPassword)
  .patch("/login/resetPassword/:token", authController.resetPassword)
  .patch(
    "/dashboard/updatePassword",
    authController.protect,
    authController.updatePassword
  );

module.exports = router;
