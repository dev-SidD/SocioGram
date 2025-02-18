import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/updateProfile.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dncaefs5d/image/upload";
const CLOUDINARY_PRESET = "userProfile_pictures"; // Cloudinary upload preset

const ProfileUpdate = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    bio: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    username: "",
  });

  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      navigate("/login");
      return;
    }

    if (data) {
      setUserData((prevState) => ({
        ...prevState,
        fullName: data.fullName || "",
        email: data.email || "",
        bio: data.bio || "",
        profilePicture: data.profilePicture || "",
        username: data.username || "",
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setImageError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      setUserData((prevState) => ({
        ...prevState,
        profilePicture: response.data.secure_url, // Save uploaded image URL
      }));
      setUploading(false);
    } catch (err) {
      console.error("Error uploading image", err);
      setImageError("Failed to upload image. Try again.");
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const { fullName, email, bio, profilePicture, currentPassword, newPassword, username } = userData;
      
      if (!username) {
        setError("Username is missing. Please refresh and try again.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/profile_u/${username}`,
        { currUsername: username, fullName, email, bio, profilePicture, currentPassword, newPassword},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.msg);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="profile-update-container">
      <h2 className="text-center text-2xl font-semibold">Update Your Profile</h2>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      {imageError && <p className="error-msg">{imageError}</p>}

      <form onSubmit={handleSubmit} className="profile-update-form">
        <div className="input-group">
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" value={userData.fullName} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" name="bio" value={userData.bio} onChange={handleChange} rows="4" />
        </div>

        <div className="input-group">
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input type="file" id="profilePicture" accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="loading-msg">Uploading image...</p>}
        </div>

        {userData.profilePicture && (
          <div className="profile-pic-preview">
            <img src={userData.profilePicture} alt="Profile" width="100" />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input type="password" id="currentPassword" name="currentPassword" value={userData.currentPassword} onChange={handleChange} placeholder="Enter current password" />
        </div>

        <div className="input-group">
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" name="newPassword" value={userData.newPassword} onChange={handleChange} placeholder="Enter new password" />
        </div>

        <button type="submit" className="submit-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
