import React from "react";
import "../styles/modal.css";
import { FaTimes } from "react-icons/fa"; // Font Awesome close icon

const FollowersModal = ({ followers, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Followers</h3>
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          <FaTimes size={20} />
        </button>
        {followers.length > 0 ? (
          <ul className="follower-list">
            {followers.map((follower) => (
              <li key={follower._id} className="follower-item">
                <img
                  src={follower.profilePicture || "https://via.placeholder.com/50"}
                  alt="Profile"
                />
                <span>@{follower.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No followers yet.</p>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;
