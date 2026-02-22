import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

// Prevents authenticated users from accessing login/signup pages
const AuthRoute = ({ children }) => {
  if (isAuthenticated()) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;
