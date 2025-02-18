import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            <button className="navbar-button">Home</button>
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/user-profile" className="navbar-link">
            <button className="navbar-button"> Profile</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
