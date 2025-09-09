import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FollowersModal from "../components/FollowersModal";

const ViewUserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        if (!storedUser) return;

        setCurrentUser(storedUser);

        const userResponse = await axios.get(`http://localhost:5000/api/user/profile/${username}`);
        setUserData(userResponse.data);

        setIsFollowing(
          userResponse.data.followers.some(
            (follower) => follower._id === storedUser.id
          )
        );

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
      const token = localStorage.getItem("token");
      const url = isFollowing
        ? `http://localhost:5000/api/user/unfollow/${username}`
        : `http://localhost:5000/api/user/follow/${username}`;

      const response = await axios.put(
        url,
        { authenticatedUsername: currentUser.username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!userData) return <div className="text-center py-8 text-red-500">User not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-8 border-b pb-6">
        <img
          src={
            userData.profilePicture ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border border-gray-300"
        />

        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-2xl font-semibold">{userData.fullName}</h2>
          <p className="text-gray-600">@{userData.username}</p>
          <p className="text-sm mt-2">{userData.bio || "No bio available."}</p>

          <div className="flex justify-center sm:justify-start gap-6 mt-4 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <span
              onClick={() => setShowFollowersModal(true)}
              className="cursor-pointer hover:text-gray-600"
            >
              <strong>{userData.followers?.length || 0}</strong> followers
            </span>
            <span
              onClick={() => setShowFollowingModal(true)}
              className="cursor-pointer hover:text-gray-600"
            >
              <strong>{userData.following?.length || 0}</strong> following
            </span>
          </div>

          {currentUser && currentUser.username !== userData.username && (
            <button
              className={`mt-4 px-4 py-2 rounded text-white transition-colors duration-300 ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="aspect-square cursor-pointer overflow-hidden"
            >
              <img
                src={post.image || "https://via.placeholder.com/300"}
                alt="User Post"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No posts yet.
          </div>
        )}
      </div>

      {showFollowersModal && (
        <FollowersModal
          followers={userData.followers}
          onClose={() => setShowFollowersModal(false)}
          title="Followers"
        />
      )}

      {showFollowingModal && (
        <FollowersModal
          followers={userData.following}
          onClose={() => setShowFollowingModal(false)}
          title="Following"
        />
      )}
    </div>
  );
};

export default ViewUserProfile;
