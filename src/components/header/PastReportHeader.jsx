import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import UserDropdown from "./UserDropdown";
import { useUser } from "../../context/UserContext";
import { useAudit } from "../../context/ReportContext";
import { useNotify } from "../../context/NotificationContext";
import { DisabledTooltip } from "../utils/Tooltip";
import GenerateReportModal from "./GenerateReportModal";
import { fetchUserCredits } from "../../api";

const PastReportHeader = () => {
  const { user, logout, token } = useUser();
  const { selectedHub, completeReportGenerated } = useAudit();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pastReportDomain = searchParams.get("hub_domain");

  const { warn } = useNotify();

  const handleLogout = () => logout();
  const handleGenerateReport = async () => {
    try {
      if (!token) {
        warn("Authentication failed. Please log in again.");
        return;
      }

      const creditData = await fetchUserCredits(token);

      if (!creditData?.success || creditData.credits_remaining <= 10) {
        warn("You do not have enough credits to generate a report.");
        return;
      }
       console.log('Enough credits to generate report:', creditData.credits_remaining);

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching credits:", error);
      warn(
        "Something went wrong while checking your credits. Please try again."
      );
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[#f8fafd] px-4 py-4 md:py-5 flex items-center justify-between flex-wrap lg:flex-nowrap lg:left-72 lg:w-[calc(100%-18rem)]">
      {/* Left Section: Greeting + Domain */}
      <div className="flex items-center gap-4 flex-grow lg:flex-grow-0 min-w-0">
        <h2 className="text-xl md:text-2xl whitespace-nowrap hidden md:block">
          Hi {user?.hub_details?.data?.hs_user || "User"}
        </h2>

        {pastReportDomain && (
          <div className="bg-gray-200 text-gray-600 px-3 py-2 text-xs truncate max-w-[200px] md:max-w-full">
            {pastReportDomain}
          </div>
        )}
      </div>

      {/* Middle Section: Buttons */}
      <div className="flex flex-grow justify-center lg:justify-end gap-2 mt-3 lg:mt-0 md:w-auto mr-3">
        {completeReportGenerated ? (
          <>
            <button
              onClick={() =>
                document
                  .getElementById("take_action")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-xs md:text-sm h-10 w-44 truncate"
            >
              Take Bulk Action ↓
            </button>
            <button
              onClick={handleGenerateReport}
              className="text-xs md:text-sm h-10 w-44 truncate"
            >
              Generate New Report
            </button>
          </>
        ) : (
          <>
            <DisabledTooltip tooltipText="Please wait while your report is generated">
              <button
                disabled
                className="text-xs md:text-sm h-10 w-42 truncate cursor-not-allowed"
              >
                Take Bulk Action ↓
              </button>
            </DisabledTooltip>
            <DisabledTooltip tooltipText="Please wait while your report is generated">
              <button
                disabled
                className="text-xs md:text-sm h-10 w-42 truncate cursor-not-allowed"
              >
                Generate New Report
              </button>
            </DisabledTooltip>
          </>
        )}
      </div>

      {/* Right Section: User Icon */}
      <div className="relative">
        <FaUserCircle
          className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 cursor-pointer"
          onClick={() => setShowUserDropdown((prev) => !prev)}
        />
        {showUserDropdown && <UserDropdown onLogout={handleLogout} />}
      </div>
      <GenerateReportModal
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedHub={selectedHub}
      />
    </header>
  );
};

export default PastReportHeader;
