const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

dotenv.config();
const connectDB = require("./db");
const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const product = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ 
  origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"], 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const announcementRoutes = require('./routes/announcementRoutes');
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));
app.use("/api/auth", authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use("/api/products", product);
app.use("/api/chat", chatRoutes);
app.use("/api", adminRoutes);

const ChatMessage = require("./models/ChatMessage");
const Conversation = require("./models/Conversation");

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User Identity Handler (Crucial for notifications)
  socket.on("identity", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined notification room`);
  });

  // Message Handling with Conversation Tracking
  socket.on("chatMessage", async ({ conversationId, sender, receiver, message }) => {
    try {
      // 1. Save Message
      const chatMessage = await ChatMessage.create({
        conversationId,
        sender,
        receiver,
        message
      });

      // 2. Update/Create Conversation (FIXED)
      const conversation = await Conversation.findOneAndUpdate(
        {
          _id: conversationId,
          participants: { $all: [sender, receiver] }
        },
        {
          $set: { lastMessage: chatMessage._id },
          $inc: { unreadCount: 1 },
          $setOnInsert: {
            participants: [sender, receiver],
            createdAt: new Date()
          }
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      // 3. Emit Notifications (FIXED TARGETING)
      // To conversation room
      io.to(conversationId).emit("newMessage", chatMessage);
      
      // To receiver's personal room (Notification)
      io.to(receiver.toString()).emit("newMessageNotification", {
        _id: conversation._id,
        participants: conversation.participants,
        unreadCount: conversation.unreadCount,
        lastMessage: chatMessage
      });

    } catch (err) {
      console.error("Message handling error:", err);
      socket.emit("errorMessage", "Failed to send message");
    }
  });
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
