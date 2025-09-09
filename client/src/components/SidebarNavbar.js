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

  return (
    <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 lg:w-72 bg-white/90 backdrop-blur-md border-r border-gray-200 px-4 lg:px-8 py-6 lg:py-10 z-40 shadow-xl">
      <ul className="flex flex-col gap-2 w-full">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 lg:gap-4 text-gray-700 hover:text-purple-600 transition-all duration-200 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl group ${
                pathname === item.path 
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 font-semibold shadow-sm border border-purple-100" 
                  : "hover:bg-gray-50"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                pathname === item.path 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : "group-hover:bg-purple-100 group-hover:text-purple-600"
              }`}>
                {item.icon}
              </div>
              <span className="text-sm lg:text-base font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
        <li className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 lg:gap-4 text-red-600 hover:text-red-700 transition-all duration-200 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 group w-full border border-red-200 hover:border-red-300 hover:shadow-sm bg-red-50/50"
          >
            <div className="p-2 rounded-xl bg-red-100 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-200">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="text-sm lg:text-base font-semibold">Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarNavbar;
