const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// @desc    Approve a user
// @route   PATCH /api/admin/users/:id/verify
// @access  Admin
const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  res.json(user);
});

// @desc    Reject a user (delete)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const rejectUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedUser);
});

// PATCH /api/users/:id/make-admin
// PATCH /api/users/:id/make-admin
const roleChange = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role === "admin" ? "admin" : "user" },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Role update failed", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  rejectUser,
  updateUser,
  roleChange,
};
