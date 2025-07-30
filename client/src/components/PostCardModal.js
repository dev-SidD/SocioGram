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
      className="fixed inset-0 z-[1000] bg-black bg-opacity-80 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden w-full max-w-5xl h-[90vh] flex flex-col md:flex-row shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="fixed top-4 right-4 text-white text-xl z-[1001]"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Left Side - Post Image */}
        <div className="flex-1 bg-black flex items-center justify-center  min-h-[600px] md:min-h-[500px]">
          <img
            src={localPost.image || "/default-post.jpg"}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Post Info */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 border-b pb-3">
            <img
              src={localPost.user?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <strong className="text-gray-800 text-sm">@{localPost.user?.username || "unknown"}</strong>
          </div>

          {/* Post Caption */}
          <div className="text-sm text-gray-800 mt-4">
            <strong>@{localPost.user?.username}</strong> {localPost.content}
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
            {localPost.comments.map((comment) => (
              <div key={comment._id} className="flex justify-between items-start bg-gray-50 px-3 py-2 rounded-md">
                <p className="text-sm">
                  <strong>{comment.username}</strong> {comment.content}
                </p>
                {comment.user === userId && (
                  <FaTrash
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => handleDeleteComment(localPost._id, comment._id)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 mt-4 text-xl">
            <FaHeart
              className={`cursor-pointer transition ${isLiked ? "text-red-500" : "text-gray-500"}`}
              onClick={() => toggleLike(localPost._id, isLiked)}
            />
            <FaComment className="text-gray-500" />
            <span className="ml-auto text-sm text-gray-600">{localPost.likes.length} likes</span>
          </div>

          {/* Add Comment */}
          <div className="flex items-center mt-4 gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              onClick={() => {
                handleAddComment(localPost._id, commentText);
                setCommentText("");
              }}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardModal;
