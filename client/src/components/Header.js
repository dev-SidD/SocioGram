import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";

const Header = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState(() => {
    const cached = localStorage.getItem("notifications");
    return cached ? JSON.parse(cached) : [];
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
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
  }, [token]);

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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/60 backdrop-blur-md border-b border-gray-200 ">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-4xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md hover:scale-105 transition-transform duration-300"
          style={{ fontFamily: "'Lobster', cursive" }}
        >
          Sociogram
        </Link>

        {/* Notifications */}
        <div className="relative">
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
                  <button onClick={handleClearAll} className="text-xs text-blue-600 hover:underline">
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
                      <Link to={link} key={n._id} onClick={() => setShowNotifDropdown(false)}>
                        <div className="px-4 py-3 border-b hover:bg-pink-50 transition text-sm">
                          <p className="text-gray-800">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
