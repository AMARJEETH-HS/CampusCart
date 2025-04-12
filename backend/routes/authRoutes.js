const express = require("express");
const { registerUser, loginUser , getProfile ,updateProfile} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getProfile);

const { upload } = require('../middleware/upload');

router.put('/update-profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
