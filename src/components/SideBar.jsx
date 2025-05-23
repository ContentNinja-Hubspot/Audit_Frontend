import React, { useState, useEffect } from "react";
import { FiMenu, FiPlus, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import boundaryLogo from "../images/boundary.png";
import Logo1 from "../images/image1.png";
import { fetchReportList } from "../api";
import { useUser } from "../context/UserContext";

const Sidebar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Open by default on large screens
  const { token } = useUser(); // Assuming you have a user context to get the token
  const [credits, setCredits] = useState(100); // assuming max is 100

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchReportList(token);
        const reports = response.data || [];

        const usedCredits = reports.length * 10;
        const availableCredits = 100 - usedCredits; // Prevent negative credits
        setCredits(availableCredits);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [token]);

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
          </Link>

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
            {/* Clean Up Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-inherit text-black w-full text-start flex justify-between"
              >
                Clean Up Tools
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
              {credits}/100
            </p>
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
