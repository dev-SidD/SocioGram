// src/components/Layout.jsx
import React from "react";
import SidebarNavbar from "./SidebarNavbar";
import MobileNavbar from "./MobileNavbar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Shell with sidebar and main area */}
      <div className="flex">
        {/* Sidebar for desktop (fixed inside component) */}
        <SidebarNavbar />

        {/* Main content area */}
        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 pb-24 pt-24 max-w-2xl mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom navbar for mobile */}
      <MobileNavbar />
    </div>
  );
};

export default Layout;
