// controllers/chatController.js
const mongoose = require('mongoose');
const ChatMessage = require("../models/ChatMessage");
const Conversation = require("../models/Conversation");
const asyncHandler = require('express-async-handler');



exports.getUserConversations = async (req, res) => {
  // console.log("hiii");
  // console.log(req.params.userId);

  try {
    const conversations = await ChatMessage.find({
      $or: [
        { sender: req.params.userId },
        { receiver: req.params.userId }
      ]
    })
    .populate("sender", "name email")     // adjust fields as needed
    .populate("receiver", "name email")   // adjust fields as needed
    .sort({ updatedAt: -1 });

    // console.log(conversations);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversations", error: err });
  }
};

// exports.getUserConversations = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const conversations = await ChatMessage.aggregate([
//       {
//         $match: {
//           $or: [
//             { sender: mongoose.Types.ObjectId(userId) },
//             { receiver: mongoose.Types.ObjectId(userId) }
//           ]
//         }
//       },
//       {
//         $sort: { updatedAt: -1 }
//       },
//       {
//         $group: {
//           _id: "$conversationId",
//           latestMessage: { $first: "$$ROOT" }
//         }
//       },
//       {
//         $replaceRoot: { newRoot: "$latestMessage" }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "sender",
//           foreignField: "_id",
//           as: "sender"
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "receiver",
//           foreignField: "_id",
//           as: "receiver"
//         }
//       },
//       {
//         $unwind: "$sender"
//       },
//       {
//         $unwind: "$receiver"
//       }
//     ]);

//     res.json(conversations);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load conversations", error: err });
//   }
// };




exports.getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  // console.log('Received conversationId:', conversationId, 'User ID:', userId);

  try {
    // 1. Find the conversation and ensure user is a participant
    const conversation = await ChatMessage.findOne({
      conversationId: conversationId, // this is a string
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    });
    // console.log(conversation , "hllll")

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found or access denied',
      });
    }

    // 2. Retrieve messages for the conversation
    const messages = await ChatMessage.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');

    // 3. Mark unread messages as read if they are for the current user
    const unreadMessages = messages.filter(
      (msg) => msg.receiver._id.equals(userId) && !msg.read
    );

    if (unreadMessages.length > 0) {
      await ChatMessage.updateMany(
        { _id: { $in: unreadMessages.map((msg) => msg._id) } },
        { $set: { read: true } }
      );

      await Conversation.findOneAndUpdate(
        { conversationId },
        { $inc: { unreadCount: -unreadMessages.length } }
      );
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      message: 'Server error while retrieving messages',
      error: error.message,
    });
  }
});
