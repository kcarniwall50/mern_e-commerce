const express = require("express");
const {
  userUpdate,
  getAllUsers,
  getSingleUser,
  resetPassword,
  forgotPassword,
  login,
  register,
  deleteUser,
} = require("../Controllers/userController");
const protector = require("../middleware/protector");
const router = express.Router();

// register user
router.post("/api/user/register", register);

// user login
router.post("/api/user/login", login);

// logout user

// forgot password
router.post("/api/user/forgotPass", forgotPassword);

// reset password
router.post("/api/user/resetPassword/:resetToken", resetPassword);

// get single user
router.get("/api/get-user", protector, getSingleUser);

// get all users
router.get("/api/getAllUsers", protector, getAllUsers);

//user update
router.patch("/api/user/update", protector, userUpdate);

// delete user
router.delete("/api/user/delete/:id", protector, deleteUser);

module.exports = router;
