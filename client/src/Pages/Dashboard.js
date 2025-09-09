// No changes to imports — just ensuring clarity.
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Timeline from "../components/TimeLine";
// Layout now provided by routed layout in App.js
import { useSocket } from "../context/SocketContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!token) return navigate("/login");

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        return navigate("/login");
      }
    } catch {
      localStorage.clear();
      return navigate("/login");
    }
  }, [navigate, token]);

  // Socket notifications handled by Header

  // Clear all moved to Header

  return (
    <div className="min-h-screen bg-gray-50">
      <Timeline />
    </div>
  );
};

export default Dashboard;
