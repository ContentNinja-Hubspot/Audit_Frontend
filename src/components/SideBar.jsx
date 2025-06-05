import React, { useState, useEffect } from "react";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import boundaryLogo from "../images/boundary.png";
import Logo1 from "../images/image1.png";
import { useUser } from "../context/UserContext";
import {
  ChartBarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Open by default on large screens
  const { token, userCredits } = useUser();

  const { themeId, logoPath, loading } = useTheme();

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

  const credits = userCredits?.remaining ?? 0;
  const totalCredits = userCredits?.total ?? 0;

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
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-start space-x-2 p-3 mt-6 lg:mt-3 mx-auto"
          >
            {!loading && logoPath ? (
              <img
                src={logoPath}
                alt="Agency Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
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
              </>
            )}
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col space-y-4 p-4 mt-5">
            <Link
              to="/dashboard"
              className={`px-4 py-2 bg-inherit rounded-md flex gap-2 items-center transition text-start ${
                location.pathname === "/dashboard"
                  ? `bg-partner-tertiary-${themeId} text-black font-semibold`
                  : `hover:bg-partner-tertiary-hover-${themeId} hover:text-black`
              }`}
              onClick={() => setIsOpen(false)}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>Your Report</span>
            </Link>

            <Link
              to="/past-reports"
              className={`px-4 py-2 rounded-md transition text-start flex gap-2 items-center ${
                location.pathname === "/past-reports"
                  ? `bg-partner-tertiary-${themeId} text-black font-semibold`
                  : `hover:bg-partner-tertiary-hover-${themeId} hover:text-black`
              }`}
              onClick={() => setIsOpen(false)}
            >
              <ClockIcon className="w-5 h-5" />
              <span>Past Reports</span>
            </Link>
            {/* Clean Up Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-inherit text-black w-full text-start flex justify-between gap-2"
              >
                <span className="flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  <span>Clean Up Tools</span>
                </span>

                <span>{dropdownOpen ? "-" : "+"}</span>
              </button>
              {dropdownOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2">
                  <Link
                    to="https://app.hubspot.com/oauth/authorize?client_id=eb2da63c-63b4-4d48-9959-5759609297c9&redirect_uri=https://hsdissociate.boundaryhq.com/hubspot/oauth/callback&scope=crm.schemas.deals.read%20oauth%20tickets%20crm.objects.contacts.write%20crm.schemas.custom.read%20crm.objects.custom.read%20crm.objects.custom.write%20crm.objects.companies.write%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.deals.write%20crm.objects.contacts.read"
                    target="_blank"
                    className="px-4 py-2 text-start rounded-md transition hover:bg-[#f0f0f0] text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Remove Association
                  </Link>
                  <div
                    className="relative text-start px-4 py-2 rounded-md text-sm text-gray-500 cursor-not-allowed bg-white/10 backdrop-blur-sm border border-white/20"
                    onClick={(e) => e.preventDefault()}
                  >
                    Deduplication
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full text-gray-500 backdrop-blur-md">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Credits Section */}
          <div className="mt-auto pb-4 text-center rounded-lg items-center justify-center mx-auto flex flex-col">
            <p className="text-lg font-md">Available Credits</p>
            <p className="text-lg font-semibold tracking-wide mb-3">
              {credits}/{totalCredits}
            </p>
            <button>
              <Link
                to="/plans"
                className="flex items-center justify-center transition"
              >
                <FiPlus className="mr-2" size={16} /> Add Credits
              </Link>
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
