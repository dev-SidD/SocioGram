import React from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FollowersModal = ({ followers, onClose, title }) => {
  const navigate = useNavigate();

  const handleUserClick = (username) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto relative p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>

        {/* List */}
        {followers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {followers.map((follower) => (
              <li
                key={follower._id}
                onClick={() => handleUserClick(follower.username)}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 transition"
              >
                <img
                  src={
                    follower.profilePicture ||
                    "https://via.placeholder.com/50"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <span className="text-sm font-medium text-gray-700">
                  @{follower.username}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No {title.toLowerCase()} yet.</p>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;
