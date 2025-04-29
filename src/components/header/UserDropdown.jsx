import React from "react";

const UserDropdown = ({ onLogout }) => {
  return (
    <div className="absolute right-0 mt-4 rounded-lg bg-white">
      <button
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;
