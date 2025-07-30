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

const SidebarNavbar = () => {
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

  const activeClasses =
    "bg-pink-100 text-pink-600 font-semibold shadow-sm";
  const baseClasses =
    "flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:text-pink-600 hover:bg-pink-50";

  return (
    <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 px-6 py-8 z-50 shadow-xl ">
      <ul className="flex flex-col gap-4 w-full">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`${baseClasses} ${
                pathname === item.path ? activeClasses : ""
              }`}
            >
              {item.icon}
              <span className="text-base">{item.label}</span>
            </Link>
          </li>
        ))}
        <li className="mt-6 border-t pt-4 border-gray-300">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 hover:text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-base">Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarNavbar;
