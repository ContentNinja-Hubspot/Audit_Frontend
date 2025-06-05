import React, { useState, useRef, useEffect } from "react";
import { useNotify } from "../context/NotificationContext";
import { FiPlus, FiX } from "react-icons/fi";

const ShareReportModal = ({ visible, onClose, onShare }) => {
  const [emailFields, setEmailFields] = useState([
    { value: "", touched: false },
  ]);
  const modalRef = useRef();
  const { success, error } = useNotify();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  const handleInputChange = (index, value) => {
    const updatedFields = [...emailFields];
    updatedFields[index].value = value;
    setEmailFields(updatedFields);
  };

  const handleAddField = () => {
    setEmailFields([...emailFields, { value: "", touched: false }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = emailFields.filter((_, i) => i !== index);
    setEmailFields(updatedFields);
  };

  const handleShare = async () => {
    const updatedFields = emailFields.map((field) => ({
      ...field,
      touched: true,
    }));
    setEmailFields(updatedFields);

    const validEmails = updatedFields
      .map((f) => f.value.trim())
      .filter((val) => validateEmail(val));

    if (validEmails.length === 0) {
      error("Please enter at least one valid email.");
      return;
    }

    let allSuccessful = true;
    success("Sharing report with provided emails.");

    for (const email of validEmails) {
      try {
        const result = await onShare(email);
        if (result?.status !== "success") {
          allSuccessful = false;
          error(result?.message || `Failed to share with ${email}`);
        }
      } catch (e) {
        console.error("Error sharing with", email, e);
        allSuccessful = false;
        error(`Failed to share with ${email}`);
      }
    }

    if (allSuccessful) success("Report shared with provided emails.");

    onClose();
    setEmailFields([{ value: "", touched: false }]);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        ref={modalRef}
        className="bg-white rounded shadow-lg p-6 w-96 max-w-full"
      >
        <h3 className="text-lg font-semibold mb-4">Share Report</h3>

        {emailFields.map((field, index) => {
          const isInvalid =
            field.touched && field.value && !validateEmail(field.value);
          return (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="email"
                className={`flex-1 border p-2 rounded ${
                  isInvalid ? "border-red-500" : ""
                }`}
                placeholder="Enter email"
                value={field.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onBlur={() => {
                  const updated = [...emailFields];
                  updated[index].touched = true;
                  setEmailFields(updated);
                }}
              />
              {emailFields.length > 1 && (
                <button
                  onClick={() => handleRemoveField(index)}
                  className="text-red-500 bg-inherit hover:bg-gray-200 rounded-full p-1"
                >
                  <FiX />
                </button>
              )}
            </div>
          );
        })}

        {emailFields.some(
          (f) => f.touched && f.value && !validateEmail(f.value.trim())
        ) && (
          <div className="text-xs text-red-500 mb-2">
            Please fix invalid email(s) before sharing.
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={handleAddField}
            className="flex items-center gap-1 bg-gray-200 text-black px-3 py-2 rounded"
          >
            <FiPlus /> Add
          </button>
          <button onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default ShareReportModal;
