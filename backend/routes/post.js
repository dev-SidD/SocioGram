const express = require("express");
const { createPost, getAllPosts, getPostById, getPostsByUserId, updatePost, deletePost, likePost, unlikePost, addComment, deleteComment, getAllPostsByFollowedUsers } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.put("/:postId/like", authMiddleware, likePost);
router.put("/:postId/unlike", authMiddleware, unlikePost);
router.post("/:postId/comment", authMiddleware, addComment);
router.delete("/:postId/comment/:commentId", authMiddleware, deleteComment);
router.get("/user/:userId", getPostsByUserId);


module.exports = router;
