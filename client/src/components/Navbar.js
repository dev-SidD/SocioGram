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
      <aside className="hidden lg:flex fixed top-20 left-0 h-screen w-72 bg-white/90 backdrop-blur-md border-r border-gray-200 px-8 py-10 z-50 shadow-xl">
        <ul className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 text-gray-700 hover:text-purple-600 transition-all duration-200 px-4 py-3 rounded-2xl group ${
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
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-gray-700 hover:text-red-600 transition-all duration-200 px-4 py-3 rounded-2xl hover:bg-red-50 group w-full"
            >
              <div className="p-2 rounded-xl group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-200">
                <FaSignOutAlt className="text-xl" />
              </div>
              <span className="text-base font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Bottom navbar for mobile and tablets */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
        <ul className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex flex-col items-center gap-1 text-sm px-3 py-2 rounded-2xl transition-all duration-200 ${
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
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 text-sm px-3 py-2 rounded-2xl transition-all duration-200 hover:bg-red-50"
            >
              <div className="p-1.5 rounded-lg">
                <FaSignOutAlt className="text-xl" />
              </div>
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
