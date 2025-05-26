import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext"; 

const UserDropdown = ({ onLogout }) => {
  const { userType, loading } = useUser();

  if (loading) return null;

  return (
    <div className="absolute right-0 mt-4 w-40 rounded-lg bg-white shadow-lg z-10">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition"
      >
        Profile
      </Link>
      {userType === "partner" && (
        <Link
          to="/users"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition"
        >
          Users
        </Link>
      )}
      <button
        onClick={onLogout}
        className="w-full bg-red-100 text-center px-4 py-2 text-sm text-red-500 hover:bg-red-200 border-t border-gray-100 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;
