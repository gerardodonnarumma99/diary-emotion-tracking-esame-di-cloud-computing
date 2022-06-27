import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      <Route
        {...restOfProps}
        render={(props) =>
          isAuthenticated ? <Component {...props} /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default ProtectedRoute;