import React, { useState, useEffect } from "react";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import boundaryLogo from "../images/boundary.png";
import Logo1 from "../images/image1.png";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Open by default on large screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Keep sidebar open on larger screens
      } else {
        setIsOpen(false); // Close sidebar on smaller screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="h-10 mt-2 z-50 text-black bg-[#f8fafd] 
             absolute top-2 left-2 sm:relative shadow-none sm:top-auto sm:left-auto"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-[#f8fafd] transition-transform duration-300 w-72 h-full border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <aside className="h-full flex flex-col relative ">
          {/* Close Button (Only for Mobile) */}
          <button
            className="absolute top-4 right-4 p-0 bg-[#f8fafd] text-black lg:hidden shadow-none"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>

          {/* Sidebar Header */}
          <div className="flex items-center justify-start space-x-2 p-3 mt-6 lg:mt-3 mx-auto">
            <img
              src={Logo1}
              alt="New Logo"
              className="h-8 w-8 object-contain"
            />
            <img
              src={boundaryLogo}
              alt="Boundary Logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-4 p-4 mt-5">
            <Link
              to="/dashboard"
              className={`px-4 py-2 bg-inherit rounded-md transition text-start ${
                location.pathname === "/dashboard"
                  ? "bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] text-black font-semibold"
                  : "hover:bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] hover:text-black"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Your Report
            </Link>

            <Link
              to="/past-reports"
              className={`px-4 py-2 rounded-md transition text-start ${
                location.pathname === "/past-reports"
                  ? "bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] text-black font-semibold"
                  : "hover:bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] hover:text-black"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Past Reports
            </Link>
            {/* <Link
              className={`px-4 py-2 rounded-md transition text-start ${
                location.pathname === "/past-reports"
                  ? "bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] text-black font-semibold"
                  : "hover:bg-gradient-to-r from-[#9b87f51a] to-[#7e69ab1a] hover:text-black"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Clean Up Tools
            </Link> */}
          </nav>

          {/* Credits Section */}
          <div className="mt-auto pb-4 text-center rounded-lg items-center justify-center mx-auto flex flex-col">
            <p className="text-lg font-md">Available Credits</p>
            <p className="text-lg font-semibold tracking-wide mb-3">100/100</p>
            <button
              className="flex items-center justify-center disabled:cursor-not-allowed bg-gray-600"
              disabled
            >
              <FiPlus className="mr-2" size={16} /> Add Credits
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Wrapper (Ensuring Sidebar Doesn’t Overlap) */}
      <div className={`transition-all duration-300 lg:ml-60 `}>
        {/* Overlay for Mobile */}
        {isOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 lg:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
