import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">SocioGram</div>
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            <FaHome className="navbar-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/user-profile" className="navbar-link">
            <FaUserCircle className="navbar-icon" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
