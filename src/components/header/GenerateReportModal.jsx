import React from "react";
import { generateNewReport } from "../../api";
import { useUser } from "../../context/UserContext";
import Cookies from "js-cookie";

const GenerateReportModal = ({ show, onClose, selectedHub }) => {
  if (!show) return null;
  const { token } = useUser();

  const triggerNewReportGeneration = async () => {
    try {
      const result = await generateNewReport(token, selectedHub.hub_id);

      if (!result.token) {
        throw new Error("Failed to retrieve new token");
      }

      document.cookie = `state=${result.token}; path=/; secure; SameSite=Strict`;
      Cookies.set("state", result?.token, {
        path: "/",
        sameSite: "Lax",
        secure: true,
        expires: 1,
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center ml-0 lg:ml-72"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded h-1/3 text-center flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base mb-4">
          You are about to Generate a New Report for Hub: {selectedHub?.hub_id}
        </p>
        <div className="flex justify-center mb-4">
          <p className="text-base">({selectedHub?.hub_domain})</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={triggerNewReportGeneration}
            className="px-4 py-2 bg-green-600 text-white mx-2 rounded hover:bg-green-700"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white mx-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;
