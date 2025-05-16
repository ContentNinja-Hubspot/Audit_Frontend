import React, { useState } from "react";
import BarChart from "../utils/BarChart";
import RequestModal from "../utils/RequestModal";
import { findRiskImage, getBorderColor } from "../../utils";
import { Tooltip } from "../utils/Tooltip";
import ToggleSection from "../utils/ToggleSection";
import { CheckboxGroup, ActionButton } from "../utils/TakeAction";
import { useNotify } from "../../context/NotificationContext";

const Deal = ({
  token,
  scoreData,
  graphData,
  hubId,
  page,
  completeReportGenerated,
}) => {
  const { success, error } = useNotify();
  const { missing_data, junk_data, total_deals } = scoreData;
  const [firstDatapoint, setFirstDatapoint] = useState("dealname");
  const [secondDataPoint, setSecondDataPoint] = useState("closedate");
  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [isDeletingDataExpanded, setIsDeletingDataExpanded] = useState(true);
  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("without_name");
  const [secondRowSelectedItem, setSecondRowSelectedItem] = useState(
    "without_closing_date"
  );
  const [lastDataPoint, setLastDataPoint] = useState(
    "no_activity_in_last_180_days"
  );

  const [activeListSelections, setActiveListSelections] = useState({
    group1: {
      deals_without_name: false,
      deals_without_owner: false,
      deals_without_num_associated_con: false,
      deals_without_num_associated_comp: false,
    },
    group2: {
      deals_without_closing_date: false,
      deals_without_amount: false,
      deals_lost_without_lost_reason: false,
      deals_without_deal_type: false,
    },
    group3: {
      deals_without_name_and_owner: false,
      deals_with_no_activity_in_last_180_days: false,
    },
    group4: {
      deals_without_name_and_owner: false,
      deals_with_no_activity_in_last_180_days: false,
    },
  });
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestModalData, setRequestModalData] = useState({
    selectedItems: [],
    actionType: "",
  });

  const handleDealCheckboxChange = (group, key, checked) => {
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
    return <div className="p-4">No data available for Deals.</div>;
  }

  if (scoreData.total_deals === 0)
    return <div className="p-4">No data available for Deals.</div>;

  return (
    <div className="text-gray-700 rounded-lg border-gray-300">
      {/* Missing Data Section ....*/}

      <section className="bg-white rounded-md mb-6">
        <div className="flex justify-between items-center px-5 py-4">
          <h3 className="text-lg font-bold">Missing Data - Deals</h3>
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
                    label: "Deals without Name",
                    dataPoint: "dealname",
                    info: "These deals are missing a deal name, which is typically used to identify and reference them within the CRM",
                  },
                  {
                    key: "without_owner",
                    label: "Deals without Owner",
                    dataPoint: "hubspot_owner_id",
                    info: "These deals do not have an assigned owner, meaning no specific user is responsible for managing or progressing them",
                  },
                  {
                    key: "without_associated_contacts",
                    label: "Deals without Associated Contact",
                    dataPoint: "num_associated_contacts",
                    info: "These deals are not linked to any contacts, meaning there is no individual associated with the deal for communication or follow-ups",
                  },
                  {
                    key: "without_associated_company",
                    label: "Deals without Associated Company",
                    dataPoint: "associations.company",
                    info: "These deals do not have an associated company, making it unclear which organization the deal is connected to",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      firstRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
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
                          / {total_deals.toLocaleString()}
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
                    key: "without_closing_date",
                    label: "Deals without Close Date",
                    dataPoint: "closedate",
                    info: "These deals lack a closing date, which is used to track when the deal is expected to be finalized",
                  },
                  {
                    key: "without_amount",
                    label: "Deals without Amount",
                    dataPoint: "amount",
                    info: "These deals do not have a specified monetary value, which is typically used to estimate revenue potential",
                  },
                  {
                    key: "lost_without_reason",
                    label: "Lost Deals without Lost Reason",
                    dataPoint: "without_lost_reason",
                    info: "These deals are marked as lost but do not include a reason for the loss, which is often recorded to analyze deal performance",
                  },
                  {
                    key: "without_deal_type",
                    label: "Deals without Deal Type",
                    dataPoint: "dealtype",
                    info: "These deals do not have a deal type assigned, which is used to categorize them based on their nature or purpose",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      secondRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
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
                          / {total_deals.toLocaleString()}
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
                  label: "Deals Without Activity in Last 180 Days",
                  dataPoint: "no_activity_in_last_180_days",
                  info: "These deals have been inactive for the last 180 days, with no recorded updates, communications, or engagement",
                },
                {
                  key: "without_name_and_owner",
                  label: "Deals without Name and Owner",
                  dataPoint: "without_name_and_owner",
                  info: "These deals are missing both a name and an assigned owner, making them incomplete in terms of basic identification and responsibility assignment",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                    lastDataPoint === item.key
                      ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
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
                        / {total_deals.toLocaleString()}
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

      {/* Take Action for Deals */}
      <section
        className={`${
          page === "past" ? "blur-sm pointer-events-none relative" : ""
        }`}
      >
        {page === "past" && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-lg font-semibold text-gray-800 z-10">
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

          {/* Deal Groups */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[95%] mx-auto">
              {/* Group 1: Fix First */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Fix this first - fast!
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleDealCheckboxChange}
                  groupKey="group1"
                  options={[
                    {
                      label: "Deals without Name",
                      value: "deals_without_name",
                    },
                    {
                      label: "Deals without Stage",
                      value: "deals_without_pipeline_stage",
                    },
                    {
                      label: "Deals without Amount",
                      value: "deals_without_amount",
                    },
                    {
                      label: "Deals without Close Date",
                      value: "deals_without_close_date",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group1")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Group 2: Must Fix */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Must Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleDealCheckboxChange}
                  groupKey="group2"
                  options={[
                    {
                      label: "Deals without Associated Company",
                      value: "deals_without_associated_company",
                    },
                    {
                      label: "Deals without Owner",
                      value: "deals_without_owner",
                    },
                    {
                      label: "Deals without Create Date",
                      value: "deals_without_created_date",
                    },
                    {
                      label: "Deals without Stage Probability",
                      value: "deals_without_stage_probability",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group2")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Group 3: Consider Deleting */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Consider Deleting
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleDealCheckboxChange}
                  groupKey="group3"
                  options={[
                    {
                      label: "Deals without Name and Owner",
                      value: "deals_without_name_and_owner",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group3")}
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Group 4: Delete Junk */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Delete Junk
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleDealCheckboxChange}
                  groupKey="group4"
                  options={[
                    {
                      label: "Deals with no activity in last 180 days",
                      value: "deals_with_no_activity_in_last_180_days",
                    },
                    {
                      label: "Deals without Name and Owner",
                      value: "deals_without_name_and_owner",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group4")}
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
        objectname="deals"
      />
    </div>
  );
};

export default Deal;
