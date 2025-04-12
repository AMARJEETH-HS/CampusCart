// routes/chatRoutes.js
const express = require("express");
const { 
  getConversationMessages,
  getUserConversations // Add this new controller
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();



router.get("/conversation/:conversationId", protect, getConversationMessages);

// GET user's conversations
router.get("/conversations/:userId", protect, getUserConversations);

// GET conversation messages

module.exports = router;