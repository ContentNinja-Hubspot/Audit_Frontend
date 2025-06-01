import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const UserDropdown = ({ onLogout }) => {
  const { userType, loading } = useUser();

  if (loading) return null;

  return (
    <div className="absolute right-0 text-start mt-4 w-40 rounded-lg bg-white shadow-lg z-10">
      <Link
        to="/profile"
        className="block px-4 py-2 mb-1 text-sm text-gray-700 hover:bg-purple-50 transition border-b border-gray-100"
      >
        Profile
      </Link>
      <Link
        to="/account"
        className="block px-4 py-2 mb-1 text-sm text-gray-700 hover:bg-purple-50 transition border-b border-gray-100"
      >
        Manage Account
      </Link>
      <button
        onClick={onLogout}
        className="w-full text-start bg-inherit px-4 py-2 text-sm text-red-500 hover:bg-red-200 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;
