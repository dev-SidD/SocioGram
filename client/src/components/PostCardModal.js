import React, { useState } from "react";
import { FaHeart, FaComment, FaTrash, FaTimes } from "react-icons/fa";
import { usePostActions } from "../utils/postActions";

const PostCardModal = ({ postId, onClose, userId, username }) => {
  const [commentText, setCommentText] = useState("");
  const { posts, toggleLike, handleAddComment, handleDeleteComment } = usePostActions(userId, username);

  const localPost = posts.find((p) => p._id === postId);
  if (!localPost) return null;

  const isLiked = localPost.likes.includes(userId);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden w-full max-w-6xl h-[90vh] flex flex-col md:flex-row shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Left Side - Post Image */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[400px] md:min-h-[500px]">
          <img
            src={localPost.image || "/default-post.jpg"}
            alt="Post"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Post Info */}
        <div className="flex-1 flex flex-col bg-white">
          {/* User Info */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
              <img
                src={localPost.user?.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-white p-0.5"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">@{localPost.user?.username || "unknown"}</h3>
              <p className="text-sm text-gray-500">Posted recently</p>
            </div>
          </div>

          {/* Post Caption */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold text-gray-900">@{localPost.user?.username}</span> {localPost.content}
            </p>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {localPost.comments.length > 0 ? (
              localPost.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-gray-800">
                      <span className="font-semibold text-gray-900">{comment.username}</span> {comment.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {comment.user === userId && (
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      onClick={() => handleDeleteComment(localPost._id, comment._id)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaComment className="text-gray-400 text-xl" />
                </div>
                <p className="text-gray-500 font-medium">No comments yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-6 p-6 border-t border-gray-100">
            <button
              className={`flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
              onClick={() => toggleLike(localPost._id, isLiked)}
            >
              <FaHeart className={`text-xl ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{localPost.likes.length}</span>
            </button>
            <button className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-110 hover:text-blue-500 text-gray-500">
              <FaComment className="text-xl" />
              <span className="text-sm font-medium">{localPost.comments.length}</span>
            </button>
          </div>

          {/* Add Comment */}
          <div className="flex items-center gap-3 p-6 border-t border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0">
              <img
                src={localPost.user?.profilePicture || "/default-avatar.png"}
                alt="You"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-sm"
              />
              <button
                onClick={() => {
                  handleAddComment(localPost._id, commentText);
                  setCommentText("");
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-medium text-sm"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardModal;
