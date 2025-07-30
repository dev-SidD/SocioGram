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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-md z-50">
      <ul className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-xs px-2 py-1 rounded-md transition-all duration-200 ${
                pathname === item.path
                  ? "text-pink-600 font-semibold bg-pink-100 shadow-sm"
                  : "text-gray-600 hover:text-pink-500"
              }`}
            >
              {item.icon}
              <span className="text-[11px]">{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 text-gray-600 hover:text-red-600 rounded-md transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-[11px]">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavbar;
