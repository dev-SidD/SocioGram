import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;
  if (!user.verified) return <Navigate to="/verify-email" />;

  return element;
};

export default ProtectedRoute;
