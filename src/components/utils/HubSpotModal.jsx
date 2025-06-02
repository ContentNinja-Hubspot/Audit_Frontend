import React, { useEffect, useRef } from "react";

export const HubSpotModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const existing = document.querySelector(
      "script[src*='js-na2.hsforms.net']"
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "//js-na2.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.onload = renderForm;
      document.body.appendChild(script);
    } else {
      renderForm();
    }

    function renderForm() {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "4955374",
          formId: "26a077b5-ccf5-45e4-8593-7c0bba6a7dfc",
          region: "na2",
          target: "#hubspotForm",
        });
      }
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-xl"
      >
        <div id="hubspotForm"></div>
      </div>
    </div>
  );
};
