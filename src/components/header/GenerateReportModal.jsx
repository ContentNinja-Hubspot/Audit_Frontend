import React, { useEffect, useState } from "react";
import { generateNewReport, checkValidToken, addNewAccount } from "../../api";
import { useUser } from "../../context/UserContext";
import Cookies from "js-cookie";
import { useNotify } from "../../context/NotificationContext";

const GenerateReportModal = ({ show, onClose, selectedHub }) => {
  if (!show) return null;

  const { token } = useUser();
  const { success } = useNotify();

  const [isTokenValid, setIsTokenValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await checkValidToken(token, selectedHub.hub_id);
        setIsTokenValid(res.success);
      } catch (error) {
        setIsTokenValid(false);
      }
    };

    if (show && selectedHub?.hub_id) {
      validateToken();
    }
  }, [show, selectedHub?.hub_id]);

  const triggerNewReportGeneration = async () => {
    try {
      const result = await generateNewReport(token, selectedHub.hub_id);

      if (!result.token) throw new Error("Failed to retrieve new token");

      Cookies.set("state", result?.token, {
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
        expires: 1,
      });

      success("New report generation triggered!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleReconnect = async () => {
    try {
      const result = await addNewAccount(token);

      if (!result?.redirect_url) {
        throw new Error("No redirect URL returned");
      }

      Cookies.set("state", result?.state, {
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
        expires: 1,
      });

      success("Redirecting to reconnect portal...");
      setTimeout(() => {
        window.location.href = result?.redirect_url;
      }, 1500);
    } catch (error) {
      console.error("Error reconnecting portal:", error);
      warn("Failed to reconnect. Please try again.");
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
          You are about to generate a report for Hub: {selectedHub?.hub_id}
        </p>
        <div className="flex justify-center mb-4">
          <p className="text-base">({selectedHub?.hub_domain})</p>
        </div>

        {isTokenValid === null && (
          <p className="text-sm text-gray-500">Checking portal connection...</p>
        )}

        {isTokenValid === false && (
          <>
            <p className="text-sm text-red-600 font-semibold mb-3">
              Connection has expired. Please reconnect your portal.
            </p>
            <div className="flex justify-center">
              <button onClick={handleReconnect}>Reconnect Portal</button>
            </div>
          </>
        )}

        {isTokenValid && (
          <div className="flex justify-center">
            <button
              onClick={triggerNewReportGeneration}
              className="px-4 py-2 bg-green-600 text-white mx-2 rounded hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportModal;
