import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, PlusCircle } from "lucide-react";
import axios from "axios";
import FollowersModal from "../components/FollowersModal";
import PostCardModal from "../components/PostCardModal";
import Layout from "../components/Layout";
const UserProfile = () => {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (!storedUser || !storedUser.username) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/profile/${storedUser.username}`
        );
        setUserData(response.data);

        const postsResponse = await axios.get(
          `http://localhost:5000/api/posts/user/${response.data.id}`
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }

  };

  if (!userData) return <div className="text-center py-8">Loading...</div>;

  return (
    <Layout>
    <div className="max-w-5xl mx-auto mt-16 p-4">
      {/* Profile Header */}
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

          {/* Stats */}
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
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/update-profile")}
        >
          <Edit size={18} /> Edit
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/create-post")}
        >
          <PlusCircle size={18} /> Post
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Posts Grid */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="aspect-square cursor-pointer overflow-hidden"
              onClick={() => setSelectedPostId(post._id)}
            >
              <img
                src={post.image || "https://via.placeholder.com/300"}
                alt="Post"
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

      {/* Floating Button */}

      {/* Modals */}
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

      {selectedPostId && (
        <PostCardModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          userId={userData.id}
          username={userData.username}
        />
      )}
    </div>
    </Layout>
  );
};

export default UserProfile;
