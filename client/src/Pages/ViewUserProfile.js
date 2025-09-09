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
          followers: [...prevUser.followers, { _id: currentUser.id }], // Optimistic update
        }));
      } else if (response.data.msg === "Successfully unfollowed the user.") {
        setIsFollowing(false);
        // Correctly filter followers by their _id
        setUserData((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers.filter(
            (follower) => follower._id !== currentUser.id
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-600">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Profile Header -- Made responsive */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Profile Picture -- Responsive size */}
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

            {/* Profile Info -- Responsive alignment */}
            <div className="flex-1 flex flex-col items-center md:items-start w-full">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between w-full gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
                  <p className="text-gray-600 font-medium">@{userData.username}</p>
                </div>
                
                {currentUser && currentUser.username !== userData.username && (
                  <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                      isFollowing 
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    }`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>

              {/* Bio -- Responsive text alignment */}
              <div className="max-w-full md:max-w-md mt-4 text-center md:text-left">
                <p className="text-gray-700 leading-relaxed">
                  {userData.bio || "No bio available."}
                </p>
              </div>

              {/* Stats -- Responsive alignment */}
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts</h3>
          {posts.length > 0 ? (
            // --- CHANGE MADE HERE ---
            <div className="grid grid-cols-3 gap-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="group relative aspect-square cursor-pointer rounded-2xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={post.image || "https://via.placeholder.com/300"}
                    alt="User Post"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-6 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {/* Correctly display like count */}
                        <span>{post.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">This user hasn't shared any posts yet.</p>
            </div>
          )}
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
    </div>
  );
};

export default ViewUserProfile;