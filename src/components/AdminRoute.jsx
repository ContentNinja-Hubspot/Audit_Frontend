import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAdminStatus } from "../api";
import Cookies from "js-cookie";

const AdminRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = Cookies.get("state");

      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        const data = await checkAdminStatus(token);
        if (data?.is_admin) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Admin check failed", err);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isChecking) return <div>Loading...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/not-found" replace />;
};

export default AdminRoute;
