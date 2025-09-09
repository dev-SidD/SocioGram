import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, PlusCircle } from "lucide-react";
import axios from "axios";
import FollowersModal from "../components/FollowersModal";
import PostCardModal from "../components/PostCardModal";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1">
                <img
                  src={
                    userData.profilePicture ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover bg-white p-1"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 flex flex-col items-center md:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
                  <p className="text-gray-600 font-medium">@{userData.username}</p>
                </div>
                
                {/* Responsive Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:px-5 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                    onClick={() => navigate("/update-profile")}
                    title="Edit Profile"
                  >
                    <Edit size={18} />
                    <span className="hidden md:inline font-semibold">Edit Profile</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:px-5 md:py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                    onClick={() => navigate("/create-post")}
                    title="New Post"
                  >
                    <PlusCircle size={18} />
                    <span className="hidden md:inline font-semibold">New Post</span>
                  </button>
                   <button
                      className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:px-5 md:py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      onClick={handleLogout}
                      title="Logout"
                    >
                      <LogOut size={18} />
                      <span className="hidden md:inline font-semibold">Logout</span>
                    </button>
                </div>
              </div>

              {/* Bio */}
              <div className="max-w-full md:max-w-md mt-4 text-center md:text-left">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {userData.bio || "No bio available."}
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 pt-4 w-full">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{posts.length}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <button
                  onClick={() => setShowFollowersModal(true)}
                  className="text-center hover:opacity-75 transition-opacity"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {userData.followers?.length.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </button>
                <button
                  onClick={() => setShowFollowingModal(true)}
                  className="text-center hover:opacity-75 transition-opacity"
                >
                  <div className="text-xl font-bold text-gray-900">
                    {userData.following?.length.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts</h3>
            
            {/* --- CHANGE MADE HERE --- */}
            {/* This grid now has 3 columns on all screen sizes and a smaller gap. */}
            <div className="grid grid-cols-3 gap-2">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="group relative aspect-square cursor-pointer rounded-2xl overflow-hidden bg-gray-100"
                    onClick={() => setSelectedPostId(post._id)}
                  >
                    <img
                      src={post.image || "https://via.placeholder.com/300"}
                      alt="Post"
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-6 text-white font-medium">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span>{post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-6">Share your first photo or video to get started!</p>
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                    onClick={() => navigate("/create-post")}
                  >
                    Create First Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default UserProfile;