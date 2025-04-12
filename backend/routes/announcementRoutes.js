const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { protect } = require("../middleware/authMiddleware");

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("user", "name email");
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Create announcement
router.post("/", protect, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const announcement = await Announcement.create({
      user: req.user._id,
      message,
    });

    const populated = await announcement.populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update announcement
router.put("/:id", protect, async (req, res) => {
  const { message } = req.body;

  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) return res.status(404).json({ message: "Not found" });

    if (announcement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    announcement.message = message || announcement.message;
    await announcement.save();
    const populated = await announcement.populate("user", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete announcement
router.delete("/:id", protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) return res.status(404).json({ message: "Not found" });

    if (announcement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await announcement.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
