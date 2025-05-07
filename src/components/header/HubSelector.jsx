import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useAudit } from "../../context/ReportContext";
import { useNotify } from "../../context/NotificationContext";
import { addNewAccount } from "../../api";
import Cookies from "js-cookie";

const HubSelector = ({ completeReportGenerated }) => {
  const { user, token } = useUser();
  const { selectedHub, setSelectedHub } = useAudit();
  const [showDropdown, setShowDropdown] = useState(false);
  const { success } = useNotify();
  const dropdownRef = useRef(null);

  const mainHubDomain = user?.hub_details?.data?.hub_domain;
  const mainHub =
    selectedHub ||
    user?.unique_hub_ids?.find((hub) => hub.hub_domain === mainHubDomain);
  const remainingHubs = user?.unique_hub_ids?.filter(
    (hub) => hub.hub_id !== mainHub?.hub_id
  );

  const handleHubChange = (hub) => {
    setSelectedHub(hub);
    setShowDropdown(false);
  };

  const handleAddNewAccount = async () => {
    const result = await addNewAccount(token);
    Cookies.set("state", result?.state, {
      path: "/",
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
      expires: 1,
    });

    success("Adding new account...");
    setTimeout(() => {
      window.location.href = result?.redirect_url;
    }, 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative bg-gray-200 text-gray-600 p-4 md:p-3 text-xs mt-1 sm:mt-0 cursor-pointer h-10 min-w-60"
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      Hub ID: {mainHub?.hub_id}{" "}
      <span className="hidden md:inline-block">({mainHub?.hub_domain})</span> ▼
      {showDropdown && (
        <div className="absolute left-0 mt-2 w-52 md:w-[30vw] border border-gray-200 rounded-md bg-gray-100 z-50">
          {remainingHubs.map((hub) => (
            <button
              key={hub.hub_id}
              onClick={() => handleHubChange(hub)}
              className="block w-full text-left p-4 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-none"
              disabled={!completeReportGenerated}
              style={{
                opacity: completeReportGenerated ? 1 : 0.6,
                cursor: completeReportGenerated ? "pointer" : "not-allowed",
              }}
            >
              Hub ID: {hub.hub_id} ({hub.hub_domain})
            </button>
          ))}
          <button
            onClick={handleAddNewAccount}
            disabled={!completeReportGenerated}
            className="mb-2 p-2"
            style={{
              opacity: completeReportGenerated ? 1 : 0.6,
              cursor: completeReportGenerated ? "pointer" : "not-allowed",
            }}
          >
            + Add New Portal
          </button>
        </div>
      )}
    </div>
  );
};

export default HubSelector;
