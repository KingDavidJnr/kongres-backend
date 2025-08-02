const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user.controller')

// route to sign up a new user
router.post('/register', UserController.signUp)

module.exports = router;
