import React, { useState } from "react";
import BarChart from "../utils/BarChart";
import RequestModal from "../utils/RequestModal";
import { findRiskImage, getBorderColor } from "../../utils";
import { Tooltip } from "../utils/Tooltip";
import ToggleSection from "../utils/ToggleSection";
import { CheckboxGroup, ActionButton } from "../utils/TakeAction";
import { useNotify } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";

const Ticket = ({
  token,
  scoreData,
  graphData,
  hubId,
  page,
  completeReportGenerated,
}) => {
  const { success, error } = useNotify();
  const { themeId } = useTheme();
  const { missing_data, junk_data, total_tickets } = scoreData;
  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [isDeletingDataExpanded, setIsDeletingDataExpanded] = useState(true);
  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("without_name");
  const [secondRowSelectedItem, setSecondRowSelectedItem] =
    useState("without_priority");
  const [firstDatapoint, setFirstDatapoint] = useState("subject");
  const [secondDataPoint, setSecondDataPoint] = useState("hs_ticket_priority");
  const [lastDataPoint, setLastDataPoint] = useState(
    "no_activity_in_last_180_days"
  );
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestModalData, setRequestModalData] = useState({
    selectedItems: [],
    actionType: "",
  });

  const [activeListSelections, setActiveListSelections] = useState({
    group1: {
      tickets_without_name: false,
      tickets_without_owner: false,
      tickets_without_num_associated_company: false,
    },
    group2: {
      tickets_without_priority: false,
      tickets_without_description: false,
      tickets_without_pipeline_name: false,
      tickets_without_status: false,
    },
    group3: {
      tickets_without_name_and_owner: false,
    },
    group4: {
      tickets_with_no_activity_in_last_180_days: false,
      tickets_without_name_and_owner: false,
    },
  });

  const handleTicketCheckboxChange = (group, key, checked) => {
    setActiveListSelections((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: checked,
      },
    }));
  };

  const handleCreateActiveList = (group) => {
    const selectedKeys = Object.entries(activeListSelections[group])
      .filter(([key, value]) => value)
      .map(([key]) => key);

    if (!selectedKeys.length) {
      error("Please select at least one property.");
      return;
    }

    setRequestModalData({ selectedItems: selectedKeys, actionType: "create" });
    setIsRequestModalOpen(true);
  };

  const handleDeleteActiveList = (group) => {
    const selectedKeys = Object.entries(activeListSelections[group])
      .filter(([key, value]) => value)
      .map(([key]) => key);

    if (!selectedKeys.length) {
      error("Please select at least one property.");
      return;
    }

    setRequestModalData({ selectedItems: selectedKeys, actionType: "delete" });
    setIsRequestModalOpen(true);
  };

  const handleDataPointChange = (count, dataPoint) => {
    switch (count) {
      case 1:
        setFirstDatapoint(dataPoint);
        break;
      case 2:
        setSecondDataPoint(dataPoint);
        break;
      case 3:
        setLastDataPoint(dataPoint);
        break;
      default:
        break;
    }
  };
  const toggleSection = (section) => {
    if (section === "missingData")
      setIsMissingDataExpanded(!isMissingDataExpanded);
    if (section === "deletingData")
      setIsDeletingDataExpanded(!isDeletingDataExpanded);
  };

  if (!scoreData) {
    return <div className="p-4">No data available for Tickets.</div>;
  }

  if (scoreData.total_tickets === 0)
    return <div className="p-4">No data available for Tickets.</div>;

  return (
    <div className="text-gray-700 rounded-lg border-gray-300">
      {/* Missing Data Section */}
      <section className="bg-white rounded-md mb-6">
        <div className="flex justify-between items-center px-5 py-4">
          <h3 className="text-lg font-bold">Missing Data - Tickets</h3>
          <ToggleSection
            isSectionExpanded={isMissingDataExpanded}
            setIsSectionExpanded={() => toggleSection("missingData")}
          />
        </div>
        {isMissingDataExpanded && (
          <div>
            {/* Fix This First */}
            <div>
              <h4 className="flex mb-4 mx-10 font-semibold text-lg text-black">
                Fix this first - fast!
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_name",
                    label: "Tickets without Name",
                    dataPoint: "subject",
                    info: "These tickets do not have a subject or title, which is typically used to identify the issue being reported.",
                  },
                  {
                    key: "without_owner",
                    label: "Tickets without Owner",
                    dataPoint: "hubspot_owner_id",
                    info: "These tickets do not have an assigned owner, meaning no specific user is responsible for handling them.",
                  },
                  {
                    key: "without_associated_contacts_email_phone",
                    label: "Tickets without Associated Contact",
                    dataPoint: "tickets_associated_contacts",
                    info: "These tickets are not linked to any contact, this also contains those contains which neither have name nor email.",
                  },
                  {
                    key: "without_num_associated_company",
                    label: "Tickets without Associated Company",
                    dataPoint: "hs_num_associated_companies",
                    info: "These tickets are not linked to any company, meaning they do not have an associated business entity recorded.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      firstRowSelectedItem === item.key
                        ? `bg-partner-gradient-${themeId}`
                        : "bg-white"
                    } ${getBorderColor(missing_data[item.key]?.risk)}`}
                    onClick={() => {
                      setfirstRowSelectedItem(item.key);
                      handleDataPointChange(1, item.dataPoint);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                        {item.label}
                      </p>
                      <Tooltip tooltipText={item.info}>
                        <img
                          className="h-4 min-w-4"
                          src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                          alt="Info"
                        />
                      </Tooltip>
                    </div>

                    <div className="flex flex-col items-start gap-2 justify-start mt-2">
                      <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_tickets.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-3 xl:h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pb-8">
                <BarChart
                  dataPoint={firstDatapoint}
                  graphData={graphData}
                  missingData={missing_data}
                  inferenceKey={firstRowSelectedItem}
                />
              </div>
            </div>

            {/* Must Fix */}
            <div>
              <h4 className="flex my-4 mx-10 font-semibold text-lg text-black">
                Must Fix
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_priority",
                    label: "Tickets without Priority",
                    dataPoint: "hs_ticket_priority",
                    info: "These tickets do not have a priority level assigned, which is used to indicate their level of urgency.",
                  },
                  {
                    key: "without_description",
                    label: "Tickets without Description",
                    dataPoint: "content",
                    info: "These tickets do not contain a description, which is typically used to provide details about the issue or request.",
                  },
                  {
                    key: "without_pipeline_name",
                    label: "Tickets without Pipeline Name",
                    dataPoint: "hs_pipeline",
                    info: "These tickets are not assigned to a specific pipeline, which is used to track the stage or progress of a ticket.",
                  },
                  {
                    key: "without_status",
                    label: "Tickets without Status",
                    dataPoint: "hs_pipeline_stage",
                    info: "These tickets do not have a status assigned, which is typically used to indicate whether they are open, in progress, or resolved.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      secondRowSelectedItem === item.key
                        ? `bg-partner-gradient-${themeId}`
                        : "bg-white"
                    } ${getBorderColor(missing_data[item.key]?.risk)}`}
                    onClick={() => {
                      setSecondRowSelectedItem(item.key);
                      handleDataPointChange(2, item.dataPoint);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                        {item.label}
                      </p>
                      <Tooltip tooltipText={item.info}>
                        <img
                          className="h-4 min-w-4"
                          src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                          alt="Info"
                        />
                      </Tooltip>
                    </div>

                    <div className="flex flex-col items-start gap-2 justify-start mt-2">
                      <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_tickets.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-3 xl:h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pb-8">
                <BarChart
                  dataPoint={secondDataPoint}
                  graphData={graphData}
                  missingData={missing_data}
                  inferenceKey={secondRowSelectedItem}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Consider Deleting Section */}
      <section className="bg-white rounded-md mb-6">
        <div className="flex justify-between items-center px-6 py-4">
          <h3 className="text-xl font-bold">Consider Deleting</h3>
          <ToggleSection
            isSectionExpanded={isDeletingDataExpanded}
            setIsSectionExpanded={() => toggleSection("deletingData")}
          />
        </div>
        {isDeletingDataExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-10">
              {[
                {
                  key: "no_activity_in_last_180_days",
                  label: "Tickets Without Activity in Last 180 Days",
                  dataPoint: "no_activity_in_last_180_days",
                  info: "These tickets have been inactive for the last 180 days, with no recorded updates, communications, or engagement.",
                },
                {
                  key: "without_name_and_owner",
                  label: "Tickets without Name and Owner",
                  dataPoint: "without_name_and_owner",
                  info: "These tickets are missing both a subject/title and an assigned owner, making them incomplete in terms of identification and responsibility.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                    lastDataPoint === item.key
                      ? `bg-partner-gradient-${themeId}`
                      : "bg-white"
                  } ${getBorderColor(junk_data[item.key]?.risk)}`}
                  onClick={() => {
                    setLastDataPoint(item.key);
                    handleDataPointChange(3, item.dataPoint);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                      {item.label}
                    </p>
                    <Tooltip tooltipText={item.info}>
                      <img
                        className="h-4 min-w-4"
                        src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                        alt="Info"
                      />
                    </Tooltip>
                  </div>

                  <div className="flex flex-col items-start gap-2 justify-start mt-2">
                    <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                      {junk_data[item.key]?.percent}%
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {junk_data[item.key]?.count.toLocaleString()}{" "}
                      <span className="text-gray-400 text-xs lg:text-sm">
                        / {total_tickets.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <img
                    className="absolute bottom-4 right-4 h-3 xl:h-4"
                    src={findRiskImage(junk_data[item.key]?.risk)}
                    alt={junk_data[item.key]?.risk}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 pb-8">
              <BarChart
                graphData={graphData}
                dataPoint={lastDataPoint}
                missingData={junk_data}
                inferenceKey={lastDataPoint}
              />
            </div>
          </>
        )}
      </section>

      {/* Take Bulk Action */}
      <section
        className={`${
          page === "past"
            ? "backdrop-blur-3xl pointer-events-none relative"
            : ""
        }`}
      >
        {page === "past" && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-2xl font-semibold text-gray-800 z-10">
            Can't take action in past report
          </div>
        )}

        <div
          className="bg-white rounded-md my-5 px-6 py-5 max-w-full"
          id="take_action"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-black font-semibold text-lg mb-2">
              Take Bulk Action
            </h4>
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

          {/* Ticket Groups */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[95%] mx-auto">
              {/* Group 1 */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Fix this first - fast!
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleTicketCheckboxChange}
                  groupKey="group1"
                  options={[
                    {
                      label: "Tickets without Name",
                      value: "tickets_without_name",
                    },
                    {
                      label: "Tickets without Owner",
                      value: "tickets_without_owner",
                    },
                    {
                      label: "Tickets without Associated Company",
                      value: "tickets_without_num_associated_company",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group1")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Group 2 */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Must Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleTicketCheckboxChange}
                  groupKey="group2"
                  options={[
                    {
                      label: "Tickets without Priority",
                      value: "tickets_without_priority",
                    },
                    {
                      label: "Tickets without Description",
                      value: "tickets_without_description",
                    },
                    {
                      label: "Tickets without Pipeline Name",
                      value: "tickets_without_pipeline_name",
                    },
                    {
                      label: "Tickets without Status",
                      value: "tickets_without_status",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group2")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Group 3 */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Consider Deleting
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleTicketCheckboxChange}
                  groupKey="group3"
                  options={[
                    {
                      label: "Tickets without Name and Owner",
                      value: "tickets_without_name_and_owner",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group3")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>
              {/* Group 4 */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Delete Junk
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleTicketCheckboxChange}
                  groupKey="group4"
                  options={[
                    {
                      label: "Tickets without activity in last 180 days",
                      value: "tickets_with_no_activity_in_last_180_days",
                    },
                    {
                      label: "Tickets without Name and Owner",
                      value: "tickets_without_name_and_owner",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleDeleteActiveList("group4")}
                  disabled={!completeReportGenerated}
                  label="Delete Junk"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        selectedItems={requestModalData.selectedItems}
        actionType={requestModalData.actionType}
        token={token}
        hubId={hubId}
        objectname="tickets"
      />
    </div>
  );
};

export default Ticket;
