const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

// route to sign up a new user
router.post("/register", UserController.signUp);

// route for user to login
router.post("/login", UserController.login);

// route to update user profile
router.patch("/update", UserController.updateProfile);

// route to fetch single user profile
router.get("/profile", UserController.getProfile);

// route to delete user profile
router.delete("/delete", UserController.deleteProfile);

module.exports = router;
