import React from "react";
import { addNewAccount } from "../../api";

export const Tooltip = ({ tooltipText, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-3/4 mb-2 hidden group-hover:block rounded bg-white text-black py-1 px-2 text-xs shadow-lg z-10 w-48 text-start">
        {tooltipText}
      </div>
    </div>
  );
};

export const DropdownTooltip = ({
  hubs,
  children,
  generateButton,
  handleHubSelection,
  token,
}) => {
  const handleAddNewAccount = async () => {
    const result = await addNewAccount(token);
    document.cookie = `state=${
      result?.state
    }; path=/; SameSite=Lax; Secure; max-age=${60 * 60 * 24}`;
    window.location.href = result?.redirect_url;
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute left-0 mt-2 hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-md rounded-lg py-2 min-w-[220px] z-20">
        {hubs?.map((hub) => (
          <div
            key={hub?.hub_id}
            className={`px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
              generateButton
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            onClick={
              !generateButton ? () => handleHubSelection(hub) : undefined
            }
          >
            Hub ID: {hub?.hub_id} ({hub?.hub_domain})
          </div>
        ))}
        <button
          onClick={() => handleAddNewAccount(token)}
          className={`mt-1 mx-4 px-2 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200 ${
            generateButton ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          disabled={generateButton}
        >
          + Add New Portal
        </button>
      </div>
    </div>
  );
};
