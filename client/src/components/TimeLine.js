import React, { useEffect, useState } from "react";
import { usePostActions } from "../utils/postActions";
import { FaHeart, FaComment, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const Timeline = () => {
  const [commentText, setCommentText] = useState({});
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!userData || !localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const userId = userData?.id;
  const username = userData?.username;

  const {
    posts,
    fetchPosts,
    toggleLike,
    handleAddComment,
    handleDeleteComment,
    error,
  } = usePostActions(userId, username);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 🔔 Real-time like/comment notifications
  useEffect(() => {
    if (!socket) return;

    socket.on("notify", (data) => {
      if (data?.type === "like" || data?.type === "comment") {
        setNotification(`${data.senderUsername} ${data.message}`);
        setTimeout(() => setNotification(null), 4000);
      }
    });

    return () => socket.off("notify");
  }, [socket]);

  if (!userData) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-24">
      {/* 🔔 Notification Banner */}
      {notification && (
        <div className="bg-green-100 border border-green-300 text-green-800 text-sm px-4 py-2 rounded-md mb-4 text-center shadow-sm animate-pulse">
          {notification}
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg font-medium">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="space-y-8 mt-6">
          {posts.map((post) => {
            const isLiked = post.likes.includes(userId);

            return (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden transition hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                  <img
                    src={post.user.profilePicture || "/default-avatar.png"}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-300"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{post.user.username}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-[500px] object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-800 mb-4">{post.content}</p>

                  {/* Like + Comment icons */}
                  <div className="flex items-center gap-6 text-gray-500 mb-4">
                    <span
                      className={`flex items-center gap-2 cursor-pointer transition hover:text-red-500 ${
                        isLiked ? "text-red-500" : ""
                      }`}
                      onClick={() => toggleLike(post._id, isLiked)}
                    >
                      <FaHeart className="text-lg" />
                      <span className="text-sm">{post.likes.length}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <FaComment className="text-lg" />
                      <span className="text-sm">{post.comments.length}</span>
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Comments</h4>
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex gap-3 items-start bg-gray-50 px-4 py-3 rounded-xl border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="text-sm leading-snug text-gray-800">
                              <span className="font-semibold">{comment.username}</span>{" "}
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {comment.user === userId && (
                            <FaTrash
                              className="text-red-500 cursor-pointer hover:text-red-700 transition"
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Comment */}
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t">
                    <img
                      src={userData.profilePicture || "/default-avatar.png"}
                      alt="You"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [post._id]: e.target.value,
                        })
                      }
                      className="flex-1 text-sm px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      onClick={() => handleAddComment(post._id, commentText[post._id])}
                      className="text-sm px-4 py-2 bg-gradient-to-tr from-pink-500 to-pink-400 text-white rounded-full hover:from-pink-600 hover:to-pink-500 transition"
                    >
                      Post
                    </button>
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
