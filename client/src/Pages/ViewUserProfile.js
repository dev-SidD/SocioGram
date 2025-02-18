import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/userProfile.css";

const ViewUserProfile = () => {
  const { username } = useParams(); // Get username from URL params
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        if (!storedUser) return;

        setCurrentUser(storedUser);

        // Fetch user profile data
        const userResponse = await axios.get(`http://localhost:5000/api/user/profile/${username}`);
        setUserData(userResponse.data);

        // Check if the current user is following this user
        setIsFollowing(userResponse.data.followers.includes(storedUser.id));

        // Fetch user's posts
        const postsResponse = await axios.get(`http://localhost:5000/api/posts/user/${userResponse.data.id}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const url = isFollowing
        ? `http://localhost:5000/api/user/unfollow/${username}`
        : `http://localhost:5000/api/user/follow/${username}`;

      const response = await axios.put(
        url,
        { authenticatedUsername: currentUser.username },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token only in follow/unfollow request
          },
        }
      );

      if (response.data.msg === "Successfully followed the user.") {
        
        setIsFollowing(true);
        setUserData((prevUser) => ({
          ...prevUser,
          followers: [...prevUser.followers, currentUser.id],
        }));
      } else if (response.data.msg === "Successfully unfollowed the user.") {
        setIsFollowing(false);
        setUserData((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers.filter((id) => id !== currentUser.id),
        }));
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!userData) return <div className="error">User not found.</div>;

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
              <strong>{userData.followers.length}</strong> followers
            </div>
            <div className="stat">
              <strong>{userData.following.length}</strong> following
            </div>
          </div>
        </div>

        {/* Follow/Unfollow Button */}
        {currentUser && currentUser.username !== userData.username && (
         <button
         className={`follow-button ${isFollowing ? "unfollow-button" : "follow-button"}`}
         onClick={handleFollowToggle}
       >
         {isFollowing ? "Unfollow" : "Follow"}
       </button>
       
        )}
      </div>

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

export default ViewUserProfile;
