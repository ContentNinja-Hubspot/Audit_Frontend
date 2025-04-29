import React, { useEffect, useRef } from "react";

export const SampleUsageEmailModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow-lg w-[90%] max-w-[50%] max-h-[90vh] overflow-y-scroll scrollbar-hide"
      >
        <h2 className="text-xl font-bold mb-4">Sample Email</h2>

        <div className="text-sm text-gray-800 space-y-4 leading-relaxed">
          <p className="text-start">Hi {"{Rep Name}"},</p>

          <p className="text-start">Hope you’re doing well!</p>

          <p className="text-start">
            Here’s your HubSpot activity summary from the past 30 days. This
            snapshot helps highlight where you're leveraging the platform well
            and where there's room to improve — so you can stay aligned with
            team goals and make the most of the tools available.
          </p>

          {/* Doing Well Section */}
          <p className="font-semibold text-start">✅ You’re Doing Well:</p>
          <ul className="list-disc list-inside ml-4 text-start">
            <li>Logged into HubSpot</li>
            <li>Created New Leads</li>
            <li>Created New Deals</li>
            <li>Owned New Deals</li>
            <li>Logged Emails</li>
            <li>Completed more than 80% tasks</li>
          </ul>

          {/* Needs Attention Section */}
          <p className="font-semibold text-start">❌ Needs Attention:</p>
          <ul className="list-disc list-inside ml-4 text-start">
            <li>Not logged into HubSpot</li>
            <li>Not created New Leads</li>
            <li>Not created New Deals</li>
            <li>Not owned New Deals</li>
            <li>Not logged Emails</li>
            <li>Not completed more than 80% tasks</li>
          </ul>

          <p className="text-start">
            Even small changes can make a big impact. If you need help on how to
            improve any of these, feel free to reach out to the below signed.
          </p>

          <p className="text-start">Let’s aim higher next week 💪</p>

          <p className="text-start">
            Best, <br />
            {"{App Admin Name}"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const SalesPerformanceEmailModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Close the modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow-lg w-[90%] max-w-[50%] max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">Sales Performance Summary</h2>

        <div className="text-sm text-gray-800 space-y-4 leading-relaxed">
          <p className="text-start">Hi {"{Rep Name}"},</p>

          <p className="text-start">Hope you’re doing well!</p>

          <p className="text-start">
            Here’s your Sales Performance summary from the past 30 days. This
            snapshot helps highlight how you're performing with respect to
            selling:
          </p>

          <p className="font-semibold text-start">💰 Impact Analytics:</p>
          <ul className="list-disc list-inside ml-4 text-start">
            <li>Deal Win Rate: [Value]</li>
            <li>Revenue Win Rate: [Value]</li>
            <li>Revenue Impact Rate: [Value]</li>
          </ul>

          <p className="font-semibold text-start">⚠️ Moderate Risk:</p>
          <ul className="list-disc list-inside ml-4 text-start">
            <li>
              Task completion Rate:{" "}
              <span className="text-yellow-600">[Value]</span>
            </li>
            <li>
              Connected call Rate:{" "}
              <span className="text-yellow-600">[Value]</span>
            </li>
            <li>
              Deal stagnation Rate:{" "}
              <span className="text-yellow-600">[Value]</span>
            </li>
            <li>
              Less meetings than the company average:{" "}
              <span className="text-yellow-600">[Value]</span>
            </li>
            <li>
              Less actions taken than the company average:{" "}
              <span className="text-yellow-600">[Value]</span>
            </li>
          </ul>

          <p className="font-semibold text-start">❌ High Risk:</p>
          <ul className="list-disc list-inside ml-4 text-start">
            <li>
              Task completion Rate:{" "}
              <span className="text-red-600">[Value]</span>
            </li>
            <li>
              Connected call Rate: <span className="text-red-600">[Value]</span>
            </li>
            <li>
              Deal stagnation Rate:{" "}
              <span className="text-red-600">[Value]</span>
            </li>
            <li>
              Less meetings than the company average:{" "}
              <span className="text-red-600">[Value]</span>
            </li>
            <li>
              Less actions taken than the company average:{" "}
              <span className="text-red-600">[Value]</span>
            </li>
          </ul>

          <p className="text-start">
            Even small changes can make a big impact. If you need help on how to
            improve any of these, feel free to reach out to the below signed.
          </p>

          <p className="text-start">Let’s aim higher next week 💪</p>

          <p className="text-start">
            Best, <br />
            {"{App Admin Name}"}
          </p>
        </div>
      </div>
    </div>
  );
};
