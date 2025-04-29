import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdminRoute = () => {
  const { user, token } = useUser();

  if (!user) {
    return null;
  }

  //   if (user?.role !== "admin") {
  //     return <Navigate to="/dashboard" />;
  //   }

  return <Outlet />;
};

export default AdminRoute;
