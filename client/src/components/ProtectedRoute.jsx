import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../api/auth";

const ProtectedRoute = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyToken();
      setIsValid(valid);
      setIsVerifying(false);
    };

    checkAuth();
  }, []);

  if (isVerifying) {
    // Show loading state while verifying
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Verifying...</p>
      </div>
    );
  }

  if (!isValid) {
    // Redirect to login if token is invalid
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
