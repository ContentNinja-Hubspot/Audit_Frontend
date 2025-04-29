import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const PastReportHeader = () => {
  const { user, logout } = useUser();
  const [searchParams] = useSearchParams();
  const pastReportDomain = searchParams.get("hub_domain");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="text-black p-4 md:p-5 bg-[#f8fafd] fixed top-0 left-0 w-full lg:left-72 lg:w-[calc(100%-18rem)] z-10 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6">
      <div className="flex sm:flex-row items-center w-full sm:w-auto ml-14 lg:mx-0 gap-2 justify-between">
        <h2 className="hidden md:block text-xl md:text-2xl text-center sm:text-left">
          Hi {user?.hub_details?.data?.hs_user}
        </h2>

        <div className="relative bg-gray-200 text-gray-600 p-3  text-xs  sm:mt-0 cursor-pointer truncate max-w-60 md:max-w-full">
          {pastReportDomain}
        </div>
        <div ref={userDropdownRef} className="relative block md:hidden">
          <FaUserCircle
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 cursor-pointer"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          />

          {showUserDropdown && (
            <div className="absolute right-0 mt-4 rounded-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-white text-sm shadow-none text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div ref={userDropdownRef} className="relative">
          <FaUserCircle
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 cursor-pointer"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          />

          {showUserDropdown && (
            <div className="absolute right-0 mt-4 rounded-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-white text-sm shadow-none text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PastReportHeader;
