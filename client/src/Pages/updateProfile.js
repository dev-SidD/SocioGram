import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dncaefs5d/image/upload";
const CLOUDINARY_PRESET = "userProfile_pictures";

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
      setUserData((prev) => ({
        ...prev,
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
    setUserData((prev) => ({ ...prev, [name]: value }));
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
      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.secure_url,
      }));
      setUploading(false);
    } catch (err) {
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
        setError("Username missing. Refresh and try again.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/profile_u/${username}`,
        { currUsername: username, fullName, email, bio, profilePicture, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.msg);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Update Your Profile</h2>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {imageError && <p className="text-red-500 text-center mb-4">{imageError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={userData.bio}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full"
          />
          {uploading && <p className="text-blue-500 text-sm mt-1">Uploading image...</p>}
        </div>

        {userData.profilePicture && (
          <div className="mt-4">
            <img
              src={userData.profilePicture}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={userData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
