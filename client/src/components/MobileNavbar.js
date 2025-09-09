import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserCircle,
  FaPlusCircle,
  FaEdit,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

const MobileNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome className="text-lg" /> },
    { path: "/user-profile", label: "Profile", icon: <FaUserCircle className="text-lg" /> },
    { path: "/create-post", label: "Create", icon: <FaPlusCircle className="text-lg" /> },
    { path: "/update-profile", label: "Edit", icon: <FaEdit className="text-lg" /> },
    { path: "/search", label: "Search", icon: <FaSearch className="text-lg" /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <ul className="flex justify-around items-center py-2 sm:py-3 px-2 sm:px-4">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex flex-col items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl transition-all duration-200 ${
                pathname === item.path
                  ? "text-purple-600 font-semibold bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm"
                  : "text-gray-600 hover:text-purple-500 hover:bg-gray-50"
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                pathname === item.path 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : ""
              }`}>
                {item.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group border border-red-200 hover:border-red-300 hover:shadow-sm bg-red-50/50"
          >
            <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-200">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavbar;
