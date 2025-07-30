const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Notification = require("../models/notification"); 
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Read user profile by username
const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username })
            .select("-password") // exclude password
            .populate("followers", "username fullName profilePicture")
            .populate("following", "username fullName profilePicture");

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        res.json({
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers, // Populated follower data
            following: user.following, // Populated following data
            posts: user.posts,
            savedPosts: user.savedPosts,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// Update user profile based on username, including password change
const updateProfile = async (req, res) => {
    const { username } = req.params;
    const { currUsername, fullName, email, bio, profilePicture, currentPassword, newPassword } = req.body;

    try {
        if (username !== currUsername) {
            return res.status(403).json({ msg: "You are not authorized to update this profile." });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Current password is incorrect." });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.json({
            msg: "Profile updated successfully",
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete user profile by username
const deleteProfile = async (req, res) => {
    const { username } = req.params;
    const { currUsername } = req.body;

    try {
        if (username !== currUsername) {
            return res.status(403).json({ msg: "You are not authorized to delete this profile." });
        }

        const user = await User.findOneAndDelete({ username });

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        res.json({ msg: "User account deleted successfully." });
    } catch (error) {
        console.error("Profile deletion error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Follow a user
const followUser = async (req, res) => {
  const { username } = req.params; 
  const { authenticatedUsername } = req.body;

  try {
    const authenticatedUser = await User.findOne({ username: authenticatedUsername });
    if (!authenticatedUser) {
      return res.status(404).json({ msg: "Authenticated user not found." });
    }

    const userToFollow = await User.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ msg: "User to follow not found." });
    }

    if (authenticatedUser.username === userToFollow.username) {
      return res.status(400).json({ msg: "You cannot follow yourself." });
    }

    if (authenticatedUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ msg: "You are already following this user." });
    }

    authenticatedUser.following.push(userToFollow._id);
    userToFollow.followers.push(authenticatedUser._id);

    await authenticatedUser.save();
    await userToFollow.save();

    // ✅ Create a notification
    const newNotification = await Notification.create({
      user: userToFollow._id,
      fromUser: authenticatedUser._id,
      type: "follow",
      message: `${authenticatedUser.username} followed you`,
    });

    // ✅ Emit via Socket.IO if user is online
    if (req.io && req.onlineUsers) {
      const recipientSocketId = req.onlineUsers.get(userToFollow._id.toString());
      if (recipientSocketId) {
        req.io.to(recipientSocketId).emit("new-notification", {
          _id: newNotification._id,
          message: newNotification.message,
          type: newNotification.type,
          fromUser: {
            _id: authenticatedUser._id,
            username: authenticatedUser.username,
            fullName: authenticatedUser.fullName,
            profilePicture: authenticatedUser.profilePicture,
          },
          createdAt: newNotification.createdAt,
        });
      }
    }

    res.json({ msg: "Successfully followed the user." });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// Unfollow a user
const unfollowUser = async (req, res) => {
    const { username } = req.params;
    const { authenticatedUsername } = req.body;

    try {
        const authenticatedUser = await User.findOne({ username: authenticatedUsername });

        if (!authenticatedUser) {
            return res.status(404).json({ msg: "Authenticated user not found." });
        }

        const userToUnfollow = await User.findOne({ username });

        if (!userToUnfollow) {
            return res.status(404).json({ msg: "User to unfollow not found." });
        }

        // Prevent unfollowing themselves
        if (authenticatedUser.username === userToUnfollow.username) {
            return res.status(400).json({ msg: "You cannot unfollow yourself." });
        }

        // Check if not following
        if (!authenticatedUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ msg: "You are not following this user." });
        }

        // Remove from following list of authenticated user
        authenticatedUser.following.pull(userToUnfollow._id);
        // Remove from followers list of the user being unfollowed
        userToUnfollow.followers.pull(authenticatedUser._id);

        await authenticatedUser.save();
        await userToUnfollow.save();

        res.json({ msg: "Successfully unfollowed the user." });
    } catch (error) {
        console.error("Unfollow error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Search users by username or full name (case-insensitive)
const searchUsers = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ msg: "Search query is required." });
    }

    try {
        const regex = new RegExp(query, "i"); // case-insensitive match

        const users = await User.find({
            $or: [
                { username: { $regex: regex } },
                { fullName: { $regex: regex } },
            ],
        }).select("username fullName profilePicture");

        res.json({ users });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
// controllers/userController.js
const getNotifications = async (req, res) => {
  try {
    // Fetch unread notifications for the user
    const notifications = await Notification.find({
      user: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("fromUser", "username fullName profilePicture")
      .populate("post", "image")
      .lean();

    // Filter out duplicates based on type + fromUser + post (or customize as needed)
    const uniqueMap = new Map();
    const uniqueNotifications = [];

    for (const notif of notifications) {
      const key = `${notif.type}-${notif.fromUser?._id}-${notif.post?._id || ""}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, true);
        uniqueNotifications.push(notif);
      }
    }

    res.json(uniqueNotifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ msg: "All notifications marked as read." });
  } catch (err) {
    console.error("Marking read error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
    getAllUsers,  // New function added
    getUserProfile,
    updateProfile,
    deleteProfile,
    followUser,
    unfollowUser,
    searchUsers,
    getNotifications,
    markAllNotificationsAsRead
};