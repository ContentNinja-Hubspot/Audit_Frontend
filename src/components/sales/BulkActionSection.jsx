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

const BulkActionTable = ({ page, completeReportGenerated }) => {
  const [data, setData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReps, setSelectedReps] = useState([]); // selected rep_emails
  const [showModal, setShowModal] = useState(false);
  const { token } = useUser();
  const { error, success } = useNotify();
  const { latestReportId, selectedHub } = useAudit();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchSalesActionData(token, latestReportId);
        const apiData = response.data || [];

        // Deduplicate by rep_email
        const uniqueDataMap = {};
        apiData.forEach((item) => {
          if (!uniqueDataMap[item.rep_email]) {
            uniqueDataMap[item.rep_email] = item;
          }
        });
        const uniqueApiData = Object.values(uniqueDataMap);

        setActionData(uniqueApiData); // Store the deduplicated raw API data
        const formatted = uniqueApiData.map(mapApiToMetrics);
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
      const sanitizedActionData = actionData.map(
        ({ session_id, usage_scorecard_action_data_id, ...rest }) => rest
      );

      const payload = {
        object_type: "usage_scorecard",
        action_data: sanitizedActionData,
        reps_email: selectedReps,
        hub_id: selectedHub.hub_id,
      };

      success("Sending emails to selected reps...");
      await sendBulkEmailToReps(token, payload);
      success("Emails sent successfully!");
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
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-start text-lg font-semibold">Take Bulk Action</h4>
        <button
          onClick={() =>
            document
              .getElementById("overall_audit_section")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Move to Top ↑
        </button>
      </div>

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
                    {rep.metrics[key] ? "❌" : "✅"}
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
          <div className="relative group">
            <button
              className="shadow-none bg-blue-600 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendEmail}
              disabled={
                page === "past" ||
                selectedReps.length === 0 ||
                !completeReportGenerated
              }
            >
              Send Email to Selected Reps
            </button>

            {page === "past" && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                Action can't be taken on past report
              </div>
            )}
          </div>
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
