// No changes to imports — just ensuring clarity.
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserFriends,
  FaChevronDown,
  FaChevronUp,
  FaBell,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Timeline from "../components/TimeLine";
import Layout from "../components/Layout";
import UserList from "../components/UserList";
import { useSocket } from "../context/SocketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const cached = localStorage.getItem("notifications");
    return cached ? JSON.parse(cached) : [];
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!token) return navigate("/login");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        return navigate("/login");
      }
    } catch {
      localStorage.clear();
      return navigate("/login");
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const cached = JSON.parse(localStorage.getItem("notifications")) || [];

        const merged = [...data, ...cached.filter(c => !data.find(n => n._id === c._id))]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(merged);
        localStorage.setItem("notifications", JSON.stringify(merged));
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
      }
    };

    fetchNotifications();
  }, [navigate, token]);

  useEffect(() => {
    if (socket && userData) {
      const handleNotification = (notification) => {
        setNotifications(prev => {
          const exists = prev.some(n => n._id === notification._id);
          const updated = exists ? prev : [notification, ...prev];
          localStorage.setItem("notifications", JSON.stringify(updated));
          return updated;
        });
      };

      socket.on("new-notification", handleNotification);
      return () => socket.off("new-notification", handleNotification);
    }
  }, [socket, userData]);

  const handleClearAll = async () => {
    try {
      await fetch("http://localhost:5000/api/user/notifications/mark-all", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error clearing notifications:", err.message);
    }

    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  return (
    <div className="mt-16 relative">
      <Layout>
        <Timeline />
      </Layout>

      {/* 🔔 Notifications */}
      <div className="fixed top-5 right-10 z-[1001]">
        <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative">
          <FaBell className="text-2xl text-gray-700 hover:text-pink-600 transition duration-200" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
              {notifications.length}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-3 w-80 max-h-[300px] overflow-y-auto bg-white shadow-xl rounded-xl border border-gray-200 z-50 backdrop-blur-md"
            >
              <div className="px-4 py-2 border-b flex justify-end bg-gray-50 rounded-t-xl">
                <button
                  onClick={handleClearAll}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
              ) : (
                notifications.map(n => {
                  const link = n.type === "follow"
                    ? `/profile/${n.fromUser?.username}`
                    : `/post/${n.post}`;
                  return (
                    <Link to={link} key={n._id}>
                      <div className="px-4 py-3 border-b hover:bg-pink-50 transition text-sm">
                        <p className="text-gray-800">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 👥 Suggestions Button (Mobile) */}
      <div className="fixed top-4 right-24 customLg:hidden z-[1001]">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-md border hover:text-pink-600 transition"
        >
          <FaUserFriends className="text-lg" />
          <span className="font-medium">Suggestions</span>
          {showSuggestions ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* 📱 Suggestions Dropdown (Mobile) */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="customLg:hidden fixed top-16 right-0 w-[350px] z-50 bg-white border rounded-xl shadow-lg overflow-hidden"
          >
            <UserList isDropdown={true} onClose={() => setShowSuggestions(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👥 Always-visible Suggestions on ≥1238px */}
      <UserList />
    </div>
  );
};

export default Dashboard;
