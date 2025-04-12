const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, hostel } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    hostel,
  });

  if (!user.verified) {
    return res.status(403).json({
      message:
        "Account request has been submitted soo please wait till verified .",
    });
  }
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      role: user.role,
      verified,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Note: The password field is selected manually since it's excluded by default.
  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    if (!user.verified) {
      return res.status(403).json({
        message: " Account not verified yet. please wait till it is approved",
      });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      role: user.role,
      verified: user.verified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  // Check if file was uploaded
  console.log("hiii");
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Get the current logged-in user from req.user (set by protect middleware)
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update the user's avatar. req.file.path contains the file path provided by multer.
  user.avatar = req.file.path;

  // Save the updated user.
  await user.save();

  // Optionally, omit sensitive fields from the returned user.
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    hostel: user.hostel,
    role: user.role,
    avatar: user.avatar,
    verified: user.verified,
    createdAt: user.createdAt,
  });
});

module.exports = { registerUser, loginUser , getProfile , updateProfile};
