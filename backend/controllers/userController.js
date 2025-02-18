const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
        const user = await User.findOne({ username }).select("-password"); // Exclude password for security
        console.log(user);

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
            followers: user.followers, // Full list of followers
            following: user.following, // Full list of following users
            posts: user.posts, // Posts created by the user
            savedPosts: user.savedPosts, // Posts saved by the user
            notifications: user.notifications, // User notifications
            createdAt: user.createdAt, // Account creation date
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

        // Prevent following themselves
        if (authenticatedUser.username === userToFollow.username) {
            return res.status(400).json({ msg: "You cannot follow yourself." });
        }

        // Check if already following
        if (authenticatedUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ msg: "You are already following this user." });
        }

        // Add to following list of authenticated user
        authenticatedUser.following.push(userToFollow._id);
        // Add to followers list of the user being followed
        userToFollow.followers.push(authenticatedUser._id);

        await authenticatedUser.save();
        await userToFollow.save();

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

module.exports = {
    getAllUsers,  // New function added
    getUserProfile,
    updateProfile,
    deleteProfile,
    followUser,
    unfollowUser
};
