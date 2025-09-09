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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* 🔔 Notification Banner */}
      {notification && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-800 text-sm px-6 py-3 rounded-2xl mb-6 text-center shadow-sm animate-pulse">
          {notification}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-6 py-3 rounded-2xl mb-6 text-center">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaHeart className="text-white text-xl sm:text-2xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Be the first to share something amazing!</p>
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base">
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = post.likes.includes(userId);

            return (
              <div
                key={post._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              >
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
                      <img
                        src={post.user.profilePicture || "/default-avatar.png"}
                        alt={post.user.username}
                        className="w-full h-full rounded-full object-cover bg-white p-0.5"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">{post.user.username}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                {post.image && (
                  <div className="relative">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full max-h-[400px] sm:max-h-[600px] object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <p className="text-sm sm:text-base text-gray-800 mb-4 leading-relaxed">{post.content}</p>

                  {/* Like + Comment icons */}
                  <div className="flex items-center gap-4 sm:gap-6 text-gray-500 mb-4">
                    <button
                      className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                        isLiked ? "text-red-500" : "hover:text-red-500"
                      }`}
                      onClick={() => toggleLike(post._id, isLiked)}
                    >
                      <FaHeart className={`text-lg sm:text-xl ${isLiked ? "fill-current" : ""}`} />
                      <span className="text-xs sm:text-sm font-medium">{post.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-blue-500">
                      <FaComment className="text-lg sm:text-xl" />
                      <span className="text-xs sm:text-sm font-medium">{post.comments.length}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4">
                      <div className="space-y-3">
                        {post.comments.slice(0, 3).map((comment) => (
                          <div
                            key={comment._id}
                            className="flex gap-2 sm:gap-3 items-start"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm leading-relaxed text-gray-800">
                                <span className="font-semibold text-gray-900">{comment.username}</span>{" "}
                                {comment.content}
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {comment.user === userId && (
                              <button
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                onClick={() => handleDeleteComment(post._id, comment._id)}
                              >
                                <FaTrash className="text-xs sm:text-sm" />
                              </button>
                            )}
                          </div>
                        ))}
                        {post.comments.length > 3 && (
                          <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium">
                            View all {post.comments.length} comments
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-gray-100">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
                      <img
                        src={userData.profilePicture || "/default-avatar.png"}
                        alt="You"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex items-center gap-2 sm:gap-3">
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
                        className="flex-1 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        onClick={() => handleAddComment(post._id, commentText[post._id])}
                        className="text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-medium"
                      >
                        Post
                      </button>
                    </div>
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
