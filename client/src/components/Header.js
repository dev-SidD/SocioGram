import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;
