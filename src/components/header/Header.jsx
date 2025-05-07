import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { useAudit } from "../../context/ReportContext";
import HubSelector from "./HubSelector";
import UserDropdown from "./UserDropdown";
import GenerateReportModal from "./GenerateReportModal";
import { DisabledTooltip } from "../utils/Tooltip";

const Header = ({ completeReportGenerated }) => {
  const { user, logout } = useUser();
  const { selectedHub } = useAudit();
  const [showModal, setShowModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const userDropdownRef = useRef(null);

  const handleLogout = () => logout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerateReport = () => {
    setShowModal(true);
  };

  return (
    <header className="text-black p-5 bg-[#f8fafd] fixed top-0 left-0 w-full lg:left-72 lg:w-[calc(100%-18rem)] z-50 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-6">
      <div className="hidden lg:flex sm:flex-row items-center sm:gap-4 w-full sm:w-auto mx-14 lg:mx-0  justify-between sm:justify-start">
        <h2 className="text-xl md:text-2xl text-center sm:text-left">
          Hi{" "}
          {user?.hub_details?.data?.hs_user
            ? user.hub_details.data.hs_user
            : "User"}
        </h2>
        {user?.hub_details?.data?.hs_user ? (
          <HubSelector completeReportGenerated={completeReportGenerated} />
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-row items-center gap-2 lg:gap-4 w-full lg:w-auto sm:ml-0 md:ml-80 lg:ml-0">
        <div className="flex md:flex-row gap-2 w-[80%] md:w-full sm:w-auto ml-12 md:ml-0">
          <DisabledTooltip tooltipText="Please wait while your report is being generated">
            <button
              onClick={() =>
                document
                  .getElementById("take_action")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className={`w-[50%] text-xs md:min-w-min md:text-sm h-10 md:h-10 truncate ${
                !completeReportGenerated ? "cursor-not-allowed" : ""
              }`}
              disabled={!completeReportGenerated}
            >
              Take Bulk Action ↓
            </button>
          </DisabledTooltip>

          <DisabledTooltip tooltipText="Please wait while your report is being generated">
            <button
              onClick={handleGenerateReport}
              className={`w-[50%] text-xs md:min-w-min md:text-sm h-10 md:h-10 truncate ${
                !completeReportGenerated ? "cursor-not-allowed" : ""
              }`}
              disabled={!completeReportGenerated}
            >
              Generate New Report
            </button>
          </DisabledTooltip>
        </div>

        <div ref={userDropdownRef} className="relative">
          <FaUserCircle
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 cursor-pointer"
            onClick={() => setShowUserDropdown((prev) => !prev)}
          />
          {showUserDropdown && <UserDropdown onLogout={handleLogout} />}
        </div>
      </div>

      <GenerateReportModal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedHub={selectedHub}
      />
    </header>
  );
};

export default Header;
