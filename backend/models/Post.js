const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Stores the image URL (if uploaded)
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,  // Automatically sets the current timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now,  // Automatically sets the current timestamp
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
      },
    ],
    comments: [
      {
        user: {
          type: String,
          ref: "User",  // Reference to the User model
        },
        username: {
          type: String, // Store username directly for faster access
          required: true,
        },
        content: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
