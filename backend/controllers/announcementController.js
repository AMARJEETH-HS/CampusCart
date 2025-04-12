const Announcement = require("../models/Announcement");

// Get all announcements.
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("user", "name email");
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Failed to load announcements", error: err });
  }
};

// Create a new announcement.
exports.createAnnouncement = async (req, res) => {
    console.log("hiii", req.body);
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  try {
    const { userId, message } = req.body;
    const announcement = new Announcement({ user: userId, message });
    await announcement.save();
    await announcement.populate("user", "name email");
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to post announcement", error: err });
  }
};

// Update an announcement.
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    ).populate("user", "name email");
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: "Failed to update announcement", error: err });
  }
};

// Delete an announcement.
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete announcement", error: err });
  }
};
