import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = ({ isDropdown = false, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const response = await fetch("http://localhost:5000/api/user");

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        const filteredUsers = data.filter(user => user._id !== storedUser.id);
        setUsers(filteredUsers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className={`${isDropdown ? "block w-full" : "hidden customLg:block w-[350px]"} bg-white rounded-3xl shadow-sm border border-gray-100 p-6`}>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3 text-purple-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="font-medium">Loading users...</span>
          </div>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className={`${isDropdown ? "block w-full" : "hidden customLg:block w-[350px]"} bg-white rounded-3xl shadow-sm border border-gray-100 p-6`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <aside
      className={`${
        isDropdown
          ? "block w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-screen"
          : "hidden customLg:block w-[350px] self-start fixed top-20 right-4 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-[calc(100vh-5rem)]"
      }`}
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Suggestions for you</h2>
        <p className="text-sm text-gray-600 mt-1">People you might know</p>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions</h3>
            <p className="text-gray-600">We couldn't find any users to suggest right now.</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user.username}`)}
              className="flex items-center gap-4 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 p-3 rounded-2xl transition-all duration-200 group border border-transparent hover:border-purple-100"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
                  <img
                    src={user.profilePicture || "https://via.placeholder.com/50"}
                    alt={user.fullName}
                    className="w-full h-full rounded-full object-cover bg-white p-0.5"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                {user.bio && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default UserList;
