import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";

export const HubSpotModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [formId, setFormId] = useState(null);
  const { userType } = useUser();

  useEffect(() => {
    if (!isOpen) return;

    if (userType === "client") {
      setFormId("26a077b5-ccf5-45e4-8593-7c0bba6a7dfc");
    } else if (userType === "partner") {
      setFormId("24b3aae0-c112-4a35-a40f-9de98c2a5aea");
    }
  }, [isOpen, userType]);

  useEffect(() => {
    if (!isOpen || !formId) return;

    const existing = document.querySelector(
      "script[src*='js-na2.hsforms.net']"
    );

    const renderForm = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "4955374",
          formId: formId,
          region: "na2",
          target: "#hubspotForm",
        });
      }
    };

    if (!existing) {
      const script = document.createElement("script");
      script.src = "//js-na2.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.onload = renderForm;
      document.body.appendChild(script);
    } else {
      renderForm();
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, formId, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg relative w-full md:w-[50%] lg:w-[30%] max-w-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">Request Upgrade</h2>
        <div id="hubspotForm"></div>
      </div>
    </div>
  );
};
