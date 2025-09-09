import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const authenticatedUsername = userData?.username;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (!query.trim()) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/user/search?query=${query}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const filtered = res.data.users.filter(
            (user) => user.username !== authenticatedUsername
          );

          setResults(filtered);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, authenticatedUsername]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">Search</h2>

      <input
        type="text"
        placeholder="Search users..."
        className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p className="mt-6 text-center text-gray-500">Searching...</p>}

      <ul className="mt-4 divide-y divide-gray-200">
        {results.map((user) => (
          <li key={user._id}>
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-4 py-3 hover:bg-gray-50 px-2 rounded transition"
            >
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-black">{user.username}</span>
                <span className="text-gray-500 text-sm">{user.fullName}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {!loading && query && results.length === 0 && (
        <p className="mt-6 text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default SearchPage;
