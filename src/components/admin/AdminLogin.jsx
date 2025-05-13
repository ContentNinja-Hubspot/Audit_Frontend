import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useNotify } from "../../context/NotificationContext";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { success, error } = useNotify();

  const handleLogin = () => {
    // Replace with env variable in real use
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === adminPassword) {
      Cookies.set("admin-auth", "true", {
        path: "/",
        secure: true,
        expires: 1,
      });
      success("Login successful");
      navigate("/admin-portal");
    } else {
      error("Incorrect password");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4 font-semibold">Admin Login</h1>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <button
        onClick={handleLogin}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
