import React from "react";
import { Navigate } from "react-router-dom";

const ProtectRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectRoute;