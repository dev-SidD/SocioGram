import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Timeline from '../components/TimeLine';
import UserList from '../components/UserList';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExpired = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    };

    isTokenExpired();
  }, [navigate]); // Run once on component mount

  return (
    <div className="app-container">
      <div className="main-content">
        <Timeline />
      </div>
      <div className="sidebar">
        <UserList />
      </div>
    </div>
  );
};

export default Dashboard;
