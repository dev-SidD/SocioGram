import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "../styles/UserList.css";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Get logged-in user ID from localStorage
                const storedUser = JSON.parse(localStorage.getItem("userData"));
                
                const response = await fetch("http://localhost:5000/api/user");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();

                // Filter out the logged-in user
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

    if (loading) return <p className="loading-text">Loading users...</p>;
    if (error) return <p className="error-text">Error: {error}</p>;

    // Function to handle user click
    const handleUserClick = (username) => {
        navigate(`/profile/${username}`); // Navigate to the profile page
    };

    return (
        <div className="user-list-container">
            <h2 className="user-list-title">Suggestions for you</h2>
            <ul className="user-list">
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map((user) => (
                        <li 
                            key={user._id} 
                            className="user-item" 
                            onClick={() => handleUserClick(user.username)} // Navigate on click
                            style={{ cursor: "pointer" }} // Make it clear it's clickable
                        >
                            <img 
                                src={user.profilePicture || "https://via.placeholder.com/50"} 
                                alt={user.fullName} 
                                className="user-profile-img"
                            />
                            <div className="user-info">
                                <p className="user-fullname">{user.fullName}</p>
                                <p className="user-username">@{user.username}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UserList;
