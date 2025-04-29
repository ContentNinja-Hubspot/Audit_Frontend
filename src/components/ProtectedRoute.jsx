import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>; // Show a loader until auth state is determined

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
