// src/components/Layout.jsx
import React from "react";
import SidebarNavbar from "./SidebarNavbar";
import MobileNavbar from "./MobileNavbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Sidebar for desktop */}
      <SidebarNavbar />

      {/* Main content */}
      <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 mb-20 mt-10 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom navbar for mobile */}
      <MobileNavbar />
    </div>
  );
};

export default Layout;
