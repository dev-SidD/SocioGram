// src/components/Layout.jsx
import React from "react";
import SidebarNavbar from "./SidebarNavbar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />

      {/* Shell with sidebar and main area */}
      <div className="flex">
        {/* Sidebar for desktop (fixed inside component) */}
        <SidebarNavbar />

        {/* Main content area */}
        <main className="flex-1 md:ml-64 lg:ml-72 px-4 sm:px-6 lg:px-8 pb-20 md:pb-24 pt-16 max-w-4xl mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom navbar for mobile */}
      <MobileNavbar />
    </div>
  );
};

export default Layout;
