const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 2 && new Set(arr).size === 2;
      },
      message: "Conversation must have exactly 2 unique participants"
    }
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatMessage"
  },
  unreadCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

// Index for faster participant lookups
conversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);