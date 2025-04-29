import React, { useState, useEffect } from "react";
import { SampleUsageEmailModal } from "./SampleEmailModal";
import { fetchSalesActionData } from "../../api/";
import { sendBulkEmailToReps } from "../../api/";
import { useUser } from "../../context/UserContext";
import { useNotify } from "../../context/NotificationContext";
import { useAudit } from "../../context/ReportContext";

const mapApiToMetrics = (apiItem) => {
  const nameFromEmail = (email) => {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return {
    name: nameFromEmail(apiItem.rep_email),
    rep_email: apiItem.rep_email,
    metrics: {
      loggedIn: !apiItem.inactive_days,
      createdDeals: !apiItem.deals_not_created,
      loggedCalls: !apiItem.calls_not_logged,
      loggedEmails: !apiItem.email_not_logged,
      loggedMeetings: !apiItem.meetings_not_logged,
      usingSequences: true, // not in API, assumed
      completedTasks: !apiItem.overdue_tasks,
      ownedDeals: !apiItem.deals_not_owned,
      loggedContacts: !apiItem.contacts_not_added,
    },
  };
};

const BulkActionTable = () => {
  const [data, setData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReps, setSelectedReps] = useState([]); // selected rep_emails
  const [showModal, setShowModal] = useState(false);
  const { token } = useUser();
  const { error, success } = useNotify();
  const { latestReportId } = useAudit();

  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN; // ideally from env

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchSalesActionData(token, latestReportId);
        const apiData = response.data || [];
        setActionData(apiData); // Store the raw API data if needed
        const formatted = apiData.map(mapApiToMetrics);
        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch sales data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const allRepEmails = data.map((rep) => rep.rep_email);
  const allSelected = selectedReps.length === data.length;
  const someSelected = selectedReps.length > 0 && !allSelected;

  const handleRepSelection = (repEmail) => {
    setSelectedReps((prev) =>
      prev.includes(repEmail)
        ? prev.filter((email) => email !== repEmail)
        : [...prev, repEmail]
    );
  };

  const toggleSelectAll = () => {
    setSelectedReps(allSelected ? [] : allRepEmails);
  };

  const handleSendEmail = async () => {
    if (selectedReps.length === 0) {
      error("Please select at least one rep.");
      return;
    }

    try {
      // const selectedActionData = data
      //   .filter((rep) => selectedReps.includes(rep.rep_email))
      //   .map((rep) => ({
      //     rep_email: rep.rep_email,
      //     ...rep.metrics,
      //   }));

      const payload = {
        access_token: ACCESS_TOKEN, // ideally from env
        session_id: "36", // should dynamically set if possible
        object_type: "usage_scorecard",
        action_data: actionData,
        reps_email: selectedReps,
      };

      await sendBulkEmailToReps(token, payload);

      success("Emails are being sent successfully!");
      setSelectedReps([]);
    } catch (err) {
      console.error("Failed to send bulk email", err);
      error("Failed to send emails. Please try again later.");
    }
  };

  const metricKeys = [
    { key: "loggedIn", label: "Logged into HubSpot in last 30 days" },
    { key: "ownedDeals", label: "Owned Deals in last 30 days" },
    { key: "loggedCalls", label: "Logged Calls in last 30 days" },
    { key: "loggedEmails", label: "Logged Emails in last 30 days" },
    { key: "loggedContacts", label: "Logged Contacts in last 30 days" },
    { key: "completedTasks", label: "Completed more than 80% Tasks" },
    { key: "loggedMeetings", label: "Logged Meetings in last 30 days" },
    { key: "createdDeals", label: "Created Deals in last 30 days" },
  ];

  if (loading) return <p className="p-4 text-center">Loading sales data...</p>;

  return (
    <div className="mt-8 p-6 px-10" id="take_action">
      <h4 className="text-start text-lg font-semibold">Take Bulk Action</h4>
      <p className="text-start text-sm text-gray-500 mb-4">
        Reps will receive an email notification with all the metrics they are
        failing at. This email acts as a soft reminder for them to use the most
        of the platform you are paying for.
      </p>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 cursor-pointer"
                />
              </th>
              <th className="p-3 text-start">Name</th>
              {metricKeys.map((metric) => (
                <th
                  key={metric.key}
                  className="p-3 text-start border border-gray-300"
                >
                  {metric.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((rep) => (
              <tr
                key={rep.rep_email}
                className={`border-t ${
                  selectedReps.includes(rep.rep_email) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedReps.includes(rep.rep_email)}
                    onChange={() => handleRepSelection(rep.rep_email)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </td>
                <td className="p-3 text-start font-medium">{rep.name}</td>
                {metricKeys.map(({ key }) => (
                  <td
                    key={key}
                    className="p-3 text-center border border-gray-300"
                  >
                    {rep.metrics[key] ? "✅" : "❌"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bulk Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-10 min-w-60">
          <button
            onClick={() => setShowModal(true)}
            className="shadow-none min-w-60 bg-white text-gray-800 border border-gray-800"
          >
            See Sample Email
          </button>
          <button
            className="shadow-none bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
            onClick={handleSendEmail}
            disabled={selectedReps.length === 0}
          >
            Send Email to Selected Reps
          </button>
        </div>
      </div>

      <SampleUsageEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default BulkActionTable;
