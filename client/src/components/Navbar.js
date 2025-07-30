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

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    { path: "/user-profile", label: "Profile", icon: <FaUserCircle className="text-xl" /> },
    { path: "/create-post", label: "Create", icon: <FaPlusCircle className="text-xl" /> },
    { path: "/update-profile", label: "Edit", icon: <FaEdit className="text-xl" /> },
    { path: "/search", label: "Search", icon: <FaSearch className="text-xl" /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  const activeStyle =
    "text-pink-600 font-semibold bg-pink-50 px-3 py-2 rounded-md shadow-sm";

  return (
    <>
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex fixed top-16 left-0 h-screen w-64 bg-white border-r border-gray-200 px-6 py-10 z-50 shadow-lg">
        <ul className="flex flex-col gap-6 w-full">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 text-gray-700 hover:text-pink-600 transition-all duration-200 ${
                  pathname === item.path ? activeStyle : ""
                }`}
              >
                {item.icon}
                <span className="text-base">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-gray-700 hover:text-red-600 transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="text-base">Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Bottom navbar for mobile and tablets */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-md z-50">
        <ul className="flex justify-around items-center py-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex flex-col items-center gap-1 text-sm px-2 py-1 rounded-md transition-all duration-200 ${
                  pathname === item.path
                    ? "text-pink-600 font-semibold bg-pink-50 shadow"
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
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 text-sm px-2 py-1 rounded-md transition-all duration-200"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="text-[11px]">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
