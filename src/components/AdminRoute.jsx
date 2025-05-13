import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const AdminRoute = () => {
  const isAdmin = Cookies.get("admin-auth") === "true";

  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" />;
};

export default AdminRoute;
