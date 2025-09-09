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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className=" mx-auto px-12 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 bg-clip-text text-transparent hover:scale-110 transition-all duration-300 drop-shadow-lg hover:drop-shadow-2xl animate-logo-glow"
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            letterSpacing: "-0.03em"
          }}
        >
          SocioGram
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)} 
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaBell className="text-lg sm:text-xl text-gray-700 hover:text-purple-600 transition duration-200" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg font-medium">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 sm:w-80 max-h-[400px] overflow-y-auto bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 backdrop-blur-md"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-purple-50 rounded-t-2xl">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button 
                    onClick={handleClearAll} 
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBell className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500 font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => {
                      const link = n.type === "follow"
                        ? `/profile/${n.fromUser?.username}`
                        : `/post/${n.post}`;
                      return (
                        <Link to={link} key={n._id} onClick={() => setShowNotifDropdown(false)}>
                          <div className="px-6 py-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group">
                            <p className="text-gray-800 font-medium group-hover:text-gray-900">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
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
