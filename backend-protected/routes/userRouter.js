const express = require("express");
const router = express.Router();

const { signupUser, loginUser, getMe } = require("../controllers/userControllers");
const requireAuth = require("../middleware/requireAuth");

// @route   POST /api/users/signup
// @desc    Register new user
// @access  Public
router.post("/signup", signupUser);

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users/me
// @desc    Get current logged-in user
// @access  Private
router.get("/me", requireAuth, getMe);

module.exports = router;
