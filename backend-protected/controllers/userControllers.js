const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    username,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    bio,
    address,
    profile_picture,
  } = req.body;

  try {
    // Check required fields
    if (!name || !username || !password || !phone_number || !gender || !date_of_birth || !membership_status || !address) {
      return res.status(400).json({ error: "Please add all required fields" });
    }

    // Check if username exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      bio,
      address,
      profile_picture,
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        membership_status: user.membership_status,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Authenticate user (login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        membership_status: user.membership_status,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user comes from auth middleware (decoded JWT)
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
