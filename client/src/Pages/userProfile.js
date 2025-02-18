import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, PlusCircle } from "lucide-react";
import axios from "axios";
import "../styles/userProfile.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (!storedUser || !storedUser.username) {
        navigate("/login"); // Redirect to login if no user data
        return;
      }

      try {
        // Fetch user profile using username
        const response = await axios.get(`http://localhost:5000/api/user/profile/${storedUser.username}`);
        setUserData(response.data);

        // Fetch user's posts using the fetched user ID
        const postsResponse = await axios.get(`http://localhost:5000/api/posts/user/${response.data.id}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-box">
          <div className="profile-picture">
            <img
              src={userData.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <div className="full-name">{userData.fullName}</div>
            <div className="username">@{userData.username}</div>
            <div className="bio">{userData.bio || "No bio available."}</div>
          </div>
        </div>

        {/* Stats Box */}
        <div className="stats-box">
          <div className="stats">
            <div className="stat">
              <strong>{posts.length}</strong> posts
            </div>
            <div className="stat">
              <strong>{userData.followers?.length || 0}</strong> followers
            </div>
            <div className="stat">
              <strong>{userData.following?.length || 0}</strong> following
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="edit-profile-button" onClick={() => navigate("/update-profile")}>
          <Edit size={18} /> Edit
        </button>
        <button className="create-post-button" onClick={() => navigate("/create-post")}>
          <PlusCircle size={18} /> Post
        </button>
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Floating Create Post Button */}
      <button className="floating-create-post" onClick={() => navigate("/create-post")}>
        <PlusCircle size={28} />
      </button>

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <img src={post.image || "https://via.placeholder.com/300"} alt="User Post" />
            </div>
          ))
        ) : (
          <div className="no-posts">No posts yet.</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
