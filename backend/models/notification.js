const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Recipient of the notification
    required: true,
  },
  type: {
    type: String,
    enum: ["follow", "like", "comment"],
    required: true,
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Who triggered the notification
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",  // Optional, for like/comment
    default: null,
  },
  message: {
    type: String,
    required: false, // Optional now
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// ✅ Compound index for optimized query performance
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
