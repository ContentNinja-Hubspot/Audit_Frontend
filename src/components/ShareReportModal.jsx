import React, { useState } from "react";
import { useNotify } from "../context/NotificationContext";

const ShareReportModal = ({ visible, onClose, onShare, email, setEmail }) => {
  const [touched, setTouched] = useState(false);
  const { success, error } = useNotify();

  if (!visible) return null;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShare = () => {
    setTouched(true);
    if (validateEmail(email)) {
      success("Sharing report with given email!");
      onShare();
    } else {
      error("Please enter a valid email address");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 w-80">
        <h3 className="text-lg font-semibold mb-4">Share Report</h3>
        <input
          type="email"
          className={`w-full border p-2 rounded mb-2 ${
            touched && !validateEmail(email) && email ? "border-red-500" : ""
          }`}
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          onBlur={() => setTouched(true)}
        />
        {touched && email && !validateEmail(email) && (
          <div className="text-xs text-red-500 mb-2">
            Please enter a valid email address
          </div>
        )}
        <div className="flex justify-center gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Cancel
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={!email}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
