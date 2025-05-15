import React, { useState } from "react";
import { Tooltip } from "../utils/Tooltip";
import UsageScorecardChart from "../utils/UsageScorecardChart";
import ToggleSection from "../utils/ToggleSection";
import { findRiskImage, getBorderColor } from "../../utils";
import BulkActionTable from "./BulkActionSection";

const UsageScoreCard = ({
  graphData,
  usage_metrics,
  total_reps,
  page,
  completeReportGenerated,
}) => {
  const [days, setDays] = useState(7);
  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [isDeletingDataExpanded, setIsDeletingDataExpanded] = useState(true);
  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("users_not_loggedin");
  const [secondRowSelectedItem, setSecondRowSelectedItem] =
    useState("contacts_not_added");
  const [firstDatapoint, setFirstDatapoint] = useState("users_not_loggedin");
  const [secondDataPoint, setSecondDataPoint] = useState("contacts_not_added");

  const total_contacts = total_reps || 0;
  const selectedUsage = usage_metrics;

  const getMetricData = (key) => {
    return {
      percent: selectedUsage[key][`percent_${days}_days`],
      count: selectedUsage[key][`count_${days}_days`],
      risk: selectedUsage[key][`risk_${days}_days`],
    };
  };

  const getInferenceText = (key) => {
    if (!usage_metrics || !usage_metrics[key]) return "";
    if (days === 30) {
      return usage_metrics[key]?.inference_30_days || "";
    } else {
      return usage_metrics[key]?.inference_7_days || "";
    }
  };

  const salesAdoptionDataFirst = [
    {
      label: "Reps not logged in",
      key: "users_not_loggedin",
      value: selectedUsage.users_not_loggedin,
      info: `Reps have not logged in ${days} days: No of Reps who did not login in the last ${days} days / Total Number of Reps`,
      ...getMetricData("users_not_loggedin"),
    },
    {
      label: "Reps not owned any Deals",
      key: "deals_not_owned",
      value: selectedUsage.deals_not_owned,
      info: `Reps have not owned any Deals in last ${days} days`,
      ...getMetricData("deals_not_owned"),
    },
    {
      label: "Reps not logged any calls",
      key: "calls_not_logged",
      value: selectedUsage.calls_not_logged,
      info: `Reps have not logged any calls in the last ${days} days`,
      ...getMetricData("calls_not_logged"),
    },
    {
      label: "Reps not logged any emails",
      key: "email_not_logged",
      value: selectedUsage.email_not_logged,
      info: `Reps have not logged any emails in the last ${days} days`,
      ...getMetricData("email_not_logged"),
    },
  ];

  const salesAdoptionDataSecond = [
    {
      label: "Reps not added new contacts",
      key: "contacts_not_added",
      value: selectedUsage.contacts_not_added,
      info: `Reps did not add new contacts in the last ${days} days`,
      ...getMetricData("contacts_not_added"),
    },
    {
      label: "Reps have more than 20% tasks overdue",
      key: "overdue_tasks",
      value: selectedUsage.overdue_tasks,
      info: "Reps have more than 20% overdue tasks",
      ...getMetricData("overdue_tasks"),
    },
    {
      label: "Reps have not logged any meetings",
      key: "meetings_not_logged",
      value: selectedUsage.meetings_not_logged,
      info: `Reps have no meetings logged in the last ${days} days`,
      ...getMetricData("meetings_not_logged"),
    },
    {
      label: "Reps have not created any deals",
      key: "deals_not_created",
      value: selectedUsage.deals_not_created,
      info: `Reps have no deals logged in the last ${days} days`,
      ...getMetricData("deals_not_created"),
    },
  ];

  const toggleSection = (section) => {
    if (section === "missingData")
      setIsMissingDataExpanded(!isMissingDataExpanded);
    if (section === "deletingData")
      setIsDeletingDataExpanded(!isDeletingDataExpanded);
  };

  const handleDataPointChange = (count, dataPoint) => {
    switch (count) {
      case 1:
        setFirstDatapoint(dataPoint);
        break;
      case 2:
        setSecondDataPoint(dataPoint);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center px-6 py-4">
        <h3 className="text-xl font-bold">Usage Scorecard</h3>
        <ToggleSection
          isSectionExpanded={isMissingDataExpanded}
          setIsSectionExpanded={() => toggleSection("missingData")}
        />
      </div>

      {isMissingDataExpanded && (
        <>
          <div>
            <div className="flex justify-between items-center mr-10">
              <div className="flex mx-10 font-semibold text-lg text-black truncate">
                <p>Sales Adoption (Reps with paid sales seats)</p>
              </div>
            </div>
            <div className="sticky top-20 right-0 z-10 mx-10 flex justify-end">
              <select
                className="border rounded px-3 py-1 "
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              >
                {[7, 30].map((day) => (
                  <option key={day} value={day}>
                    {day} Days
                  </option>
                ))}
              </select>
            </div>

            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10 my-4">
              {salesAdoptionDataFirst.map((item) => (
                <div
                  key={item.key}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                    firstRowSelectedItem === item.key
                      ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                      : "bg-white"
                  } ${getBorderColor(item?.risk)}`}
                  onClick={() => {
                    setfirstRowSelectedItem(item.key);
                    handleDataPointChange(1, item.key);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                      {item.label}
                    </p>
                    <Tooltip tooltipText={item?.info}>
                      <img
                        className="h-4 min-w-4"
                        src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                        alt="Info"
                      />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-start gap-2 justify-start mt-2">
                    <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                      {item?.percent}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {item?.count.toLocaleString()}{" "}
                      <span className="text-gray-400">
                        / {total_contacts.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <img
                    className="absolute bottom-4 right-4 h-3 xl:h-4"
                    src={findRiskImage(item?.risk)}
                    alt={item?.risk}
                  />
                </div>
              ))}
            </div>
            <div className="mx-10 text-gray-600 text-sm my-8">
              <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
                {getInferenceText(firstRowSelectedItem)}
              </p>
            </div>

            <div className="mt-8 pb-8">
              <UsageScorecardChart
                usageScorecardData={graphData}
                selectedMetric={firstRowSelectedItem}
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10 my-4">
              {salesAdoptionDataSecond.map((item) => (
                <div
                  key={item.key}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                    secondRowSelectedItem === item.key
                      ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                      : "bg-white"
                  } ${getBorderColor(item?.risk)}`}
                  onClick={() => {
                    setSecondRowSelectedItem(item.key);
                    handleDataPointChange(2, item.key);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                      {item.label}
                    </p>
                    <Tooltip tooltipText={item?.info}>
                      <img
                        className="h-4 min-w-4"
                        src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                        alt="Info"
                      />
                    </Tooltip>
                  </div>
                  <div className="flex flex-col items-start gap-2 justify-start mt-2">
                    <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                      {item?.percent}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {item?.count.toLocaleString()}{" "}
                      <span className="text-gray-400">
                        / {total_contacts.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <img
                    className="absolute bottom-4 right-4 h-3 xl:h-4"
                    src={findRiskImage(item?.risk)}
                    alt={item?.risk}
                  />
                </div>
              ))}
            </div>
            <div className="mx-10 text-gray-600 text-sm my-4">
              <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
                {getInferenceText(secondRowSelectedItem)}
              </p>
            </div>

            <div className="mt-8 pb-8">
              <UsageScorecardChart
                usageScorecardData={graphData}
                selectedMetric={secondRowSelectedItem}
              />
            </div>
          </div>
        </>
      )}

      <div className="mt-12">
        <BulkActionTable
          page={page}
          completeReportGenerated={completeReportGenerated}
        />
      </div>
    </div>
  );
};

export default UsageScoreCard;
