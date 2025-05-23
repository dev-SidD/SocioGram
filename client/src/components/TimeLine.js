import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment, FaTrash } from "react-icons/fa";
import "../styles/Timeline.css";

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !userData) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/posts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to load posts");

        setPosts(data);
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
    };

    fetchPosts();
  }, [navigate, userData]);

  if (!userData) {
    navigate("/login");
    return null;
  }

  const userId = userData.id;
  const username = userData.username;

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setPosts(data);
  };

  // Like/Unlike a post
  const toggleLike = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

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

  // Add a comment
  const handleAddComment = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentText[postId] || "", username }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to add comment");

      await fetchPosts(); // refetch posts to sync comments

      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to delete comment");

      await fetchPosts(); // refetch posts to sync after deletion
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {error && <p className="error-msg">{error}</p>}

      {posts.length === 0 ? (
        <p>No posts.</p>
      ) : (
        <div className="timeline">
          {posts.map((post) => {
            const isLiked = post.likes.includes(userId);

            return (
              <div key={post._id} className="post_t">
                <div className="post-header">
                  <img
                    src={post.user.profilePicture || "/default-avatar.png"}
                    alt={post.user.username}
                    className="profile-img"
                  />
                  <div>
                    <h3>{post.user.username}</h3>
                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Post Image */}
                {post.image && <img src={post.image} alt="Post" className="post-image" />}

                <p className="post-content">{post.content}</p>

                {/* Likes & Comments */}
                <div className="post-footer">
                  <span className="like-comment" onClick={() => toggleLike(post._id, isLiked)}>
                    <FaHeart className="icon heart-icon" style={{ color: isLiked ? "red" : "gray" }} />
                    {post.likes.length}
                  </span>
                  <span className="like-comment">
                    <FaComment className="icon comment-icon" /> {post.comments.length}
                  </span>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <div className="comment-content">
                        <strong>{comment.username}:</strong> {comment.content}
                        <div className="comment-time">{new Date(comment.createdAt).toLocaleString()}</div>
                      </div>
                      {comment.user === userId && (
                        <FaTrash className="delete-icon" onClick={() => handleDeleteComment(post._id, comment._id)} />
                      )}
                    </div>
                  ))}


                  {/* Add Comment Input */}
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                    />
                    <button onClick={() => handleAddComment(post._id)}>Comment</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timeline;
