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
      <p className={`text-sm text-gray-500 text-center ${isDropdown ? "" : "customLg:block hidden"}`}>
        Loading users...
      </p>
    );
  if (error)
    return (
      <p className={`text-sm text-red-500 text-center ${isDropdown ? "" : "customLg:block hidden"}`}>
        Error: {error}
      </p>
    );

  return (
    <aside
      className={`${
        isDropdown
          ? "block w-full bg-white border  p-4 h-screen"
          : "hidden customLg:block w-[350px] self-start fixed top-16 right-0 bg-white border  p-4  h-screen"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Suggestions for you</h2>

      </div>
      <ul className="space-y-4">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No users found.</p>
        ) : (
          users.map((user) => (
            <li
              key={user._id}
              onClick={() => navigate(`/profile/${user.username}`)}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <img
                src={user.profilePicture || "https://via.placeholder.com/50"}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default UserList;
