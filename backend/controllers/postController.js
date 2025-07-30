const { json } = require("express");
const Post = require("../models/Post");
const User = require("../models/user");
const Notification = require("../models/notification");

// Create a new post
const createPost = async (req, res) => {
    const { content, image } = req.body;
    const { user } = req;
    
    try {
        const newPost = new Post({
            content,
            image: image || null,
            user: user.id,
        });

        await newPost.save();

        // Add post ID to user's posts array
        await User.findByIdAndUpdate(user.id, { $push: { posts: newPost._id } });
       
        res.json({ msg: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Post creation error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all posts (Timeline)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username fullName profilePicture")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .populate("user", "username fullName profilePicture")
            .populate("comments.user", "username fullName profilePicture");

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Server error" });
    }
};
// Get all posts by a specific user ID
const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.find({ user: userId })
            .populate("user", "username fullName profilePicture")
            .sort({ createdAt: -1 });

        // if (!posts.length) {
        //     return res.status(404).json({ msg: "No posts found for this user." });
        // }

        res.json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a post (only by the author)
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { content, image } = req.body;
    const { user } = req;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (post.user.toString() !== user.id) {
            return res.status(403).json({ msg: "You are not authorized to update this post." });
        }

        post.content = content || post.content;
        post.image = image !== undefined ? image : post.image;

        await post.save();

        res.json({ msg: "Post updated successfully", post });
    } catch (error) {
        console.error("Post update error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a post (only by the author)
const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { user } = req;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (post.user.toString() !== user.id) {
            return res.status(403).json({ msg: "You are not authorized to delete this post." });
        }

        await post.deleteOne();

        // Remove post ID from user's posts array
        await User.findByIdAndUpdate(user.id, { $pull: { posts: postId } });

        res.json({ msg: "Post deleted successfully" });
    } catch (error) {
        console.error("Post deletion error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Like a post
const likePost = async (req, res) => {
  const { postId } = req.params;
  const { user } = req;

  try {
    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    if (post.likes.includes(user.id)) {
      return res.status(400).json({ msg: "You already liked this post." });
    }

    post.likes.push(user.id);
    await post.save();

    // ✅ Fetch full user to get username
    const likingUser = await User.findById(user.id);

    // Save notification
    if (post.user._id.toString() !== user.id) {
      const newNotification = await Notification.create({
        user: post.user._id,
        fromUser: likingUser._id,
        type: "like",
        message: `${likingUser.username} liked your post.`,
      });

      // Emit notification via socket
      const recipientSocketId = req.onlineUsers.get(post.user._id.toString());
      if (recipientSocketId) {
        req.io.to(recipientSocketId).emit("new-notification", {
          _id: newNotification._id,
          message: newNotification.message,
          type: newNotification.type,
          fromUser: {
            _id: likingUser._id,
            username: likingUser.username,
            fullName: likingUser.fullName,
            profilePicture: likingUser.profilePicture,
          },
          createdAt: newNotification.createdAt,
        });
      }
    }

    res.json({ msg: "Post liked successfully" });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Unlike a post
const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const { user } = req;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found." });
        }

        if (!post.likes.includes(user.id)) {
            return res.status(400).json({ msg: "You have not liked this post." });
        }

        post.likes.pull(user.id);
        await post.save();

        res.json({ msg: "Post unliked successfully" });
    } catch (error) {
        console.error("Unlike post error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a comment to a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { user } = req;

  try {
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    // ✅ Fetch full user to get username
    const commentingUser = await User.findById(user.id);

    const newComment = {
      user: commentingUser._id,
      username: commentingUser.username,
      content,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // ✅ Send notification if commenting on someone else's post
    if (post.user._id.toString() !== user.id) {
      const newNotification = await Notification.create({
        user: post.user._id,
        fromUser: commentingUser._id,
        type: "comment",
        message: `${commentingUser.username} commented on your post.`,
      });

      // ✅ Emit notification via socket if recipient is online
      const recipientSocketId = req.onlineUsers.get(post.user._id.toString());
      if (recipientSocketId) {
        req.io.to(recipientSocketId).emit("new-notification", {
          _id: newNotification._id,
          message: newNotification.message,
          type: newNotification.type,
          fromUser: {
            _id: commentingUser._id,
            username: commentingUser.username,
            fullName: commentingUser.fullName,
            profilePicture: commentingUser.profilePicture,
          },
          createdAt: newNotification.createdAt,
        });
      }
    }

    res.status(201).json({ msg: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


  

// Delete a comment from a post
const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { user } = req; // Extract user from request (assumed from middleware)
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        console.log("hat1")
        return res.status(404).json({ msg: "Post not found." });
      }
  
      const comment = post.comments.find((c) => c._id.toString() === commentId);
  
      if (!comment) {
        console.log("hat2")
        return res.status(404).json({ msg: "Comment not found." });
      }
  
      if (comment.user.toString() !== user.id) {
        return res.status(403).json({ msg: "You are not authorized to delete this comment." });
      }
  
      post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
      await post.save();
  
      res.json({ msg: "Comment deleted successfully" });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
     getPostsByUserId,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
};
