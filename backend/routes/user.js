const express = require("express");
const {
  getAllUsers,
  getUserProfile,
  updateProfile,
  deleteProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getNotifications,
  markAllNotificationsAsRead
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure JWT verification

const router = express.Router();
router.get("/", getAllUsers);
// Route to get user profile by username                      
router.get("/profile/:username", getUserProfile); // Read profile

// Route to update the user's profile (only accessible to the authenticated user)
router.put("/profile_u/:username", authMiddleware, updateProfile);  // Update profile

// Route to delete the user's profile (only accessible to the authenticated user)
router.delete("/profile_d/:username", authMiddleware, deleteProfile); // Delete profile

// Route to follow another user
router.put("/follow/:username", authMiddleware, followUser);

// Route to unfollow another user
router.put("/unfollow/:username", authMiddleware, unfollowUser);
router.get("/search", authMiddleware, searchUsers);
router.get("/notifications", authMiddleware, getNotifications);
router.patch("/notifications/mark-all", authMiddleware, markAllNotificationsAsRead);

module.exports = router;
