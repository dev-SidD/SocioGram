// src/utils/postActions.js
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

export const usePostActions = (userId, username) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!token || !userData) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load posts");

      setPosts(data);
      setError("");
    } catch (err) {
      if (err.message.includes("401")) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      } else {
        setError("Failed to load posts. Please try again.");
      }
      console.error("Error fetching posts:", err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const url = `http://localhost:5000/api/posts/${postId}/${isLiked ? "unlike" : "like"}`;
      const method = "PUT";
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to process request");

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      if (!commentText.trim()) return;

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText, username }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to add comment");

      await fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to delete comment");

      await fetchPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return { posts, error, fetchPosts, toggleLike, handleAddComment, handleDeleteComment };
};
