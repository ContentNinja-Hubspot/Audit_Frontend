import React, { useState, useEffect } from "react";
import { Tooltip } from "../utils/Tooltip";
import SalesPerformanceBarChart from "../utils/SalesPerformanceBarChart";
import ToggleSection from "../utils/ToggleSection";
import { SalesPerformanceEmailModal } from "./SampleEmailModal";
import { findRiskImage, getBorderColor } from "../../utils";
import { fetchLastActivityDate, sendBulkEmailToReps } from "../../api";
import { useUser } from "../../context/UserContext";
import { useAudit } from "../../context/ReportContext";
import { useNotify } from "../../context/NotificationContext";

const SalesPerformance = ({
  sales_performance_metrics = [],
  isGeneratingGraph,
  companyAverages,
  graphData,
  total_reps,
  page,
}) => {
  const timeRanges = [7, 30];
  const { token } = useUser();
  const { success } = useNotify();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [userDataMap, setUserDataMap] = useState({});
  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [lastActivityDate, setLastActivityDate] = useState("N/A");

  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("dealClosure");
  const [secondRowSelectedItem, setSecondRowSelectedItem] =
    useState("dealstagnationrate");
  const [thirdRowSelectedItem, setThirdRowSelectedItem] =
    useState("meetingRate");

  const toggleSection = () => setIsMissingDataExpanded((prev) => !prev);

  const { latestReportId } = useAudit();

  const getInferenceText = (metricKey) => {
    if (!sales_performance_metrics || !Array.isArray(sales_performance_metrics))
      return "";

    const userMetrics = sales_performance_metrics.find(
      (item) => item.rep_email === selectedUser
    );
    if (!userMetrics) return "";

    const metrics = userMetrics.metrics || {};

    switch (metricKey) {
      case "dealClosure":
        return metrics.deal_closure_rate?.inference || "";
      case "revenueImpact":
        return metrics.revenue_impact?.inference || "";
      case "revenueWinRate":
        return metrics.revenue_win_rate?.inference || "";
      case "dealstagnationrate":
        return metrics.deal_stagnation_rate?.inference || "";
      case "callRate":
        return metrics.connected_call_rate?.inference || "";
      case "taskCompletion":
        return metrics.task_completion_rate?.inference || "";
      case "meetingRate":
        return selectedDays === 30
          ? metrics.meetings_than_company_average?.inference_30_days || ""
          : metrics.meetings_than_company_average?.inference_7_days || "";
      case "actionstaken":
        return selectedDays === 30
          ? metrics.actions_than_company_average?.inference_30_days || ""
          : metrics.actions_than_company_average?.inference_7_days || "";
      case "contactsowned":
        return selectedDays === 30
          ? metrics.contacts_than_company_average?.inference_30_days || ""
          : metrics.contacts_than_company_average?.inference_7_days || "";
      case "dealsowned":
        return selectedDays === 30
          ? metrics.deals_than_company_average?.inference_30_days || ""
          : metrics.deals_than_company_average?.inference_7_days || "";
      default:
        return "";
    }
  };

  const getRiskLevel = (metricKey) => {
    if (!sales_performance_metrics || !Array.isArray(sales_performance_metrics))
      return "";

    const userMetrics = sales_performance_metrics.find(
      (item) => item.rep_email === selectedUser
    );
    if (!userMetrics) return "";

    const metrics = userMetrics.metrics || {};

    switch (metricKey) {
      case "dealClosure":
        return metrics.deal_closure_rate?.risk || "";
      case "revenueImpact":
        return metrics.revenue_impact?.risk || "";
      case "revenueWinRate":
        return metrics.revenue_win_rate?.risk || "";
      case "dealstagnationrate":
        return metrics.deal_stagnation_rate?.risk || "";
      case "callRate":
        return metrics.connected_call_rate?.risk || "";
      case "taskCompletion":
        return metrics.task_completion_rate?.risk || "";
      case "meetingRate":
        return selectedDays === 30
          ? metrics.meetings_than_company_average?.risk_30_days || ""
          : metrics.meetings_than_company_average?.risk_7_days || "";
      case "actionstaken":
        return selectedDays === 30
          ? metrics.actions_than_company_average?.risk_30_days || ""
          : metrics.actions_than_company_average?.risk_7_days || "";
      case "contactsowned":
        return selectedDays === 30
          ? metrics.contacts_than_company_average?.risk_30_days || ""
          : metrics.contacts_than_company_average?.risk_7_days || "";
      case "dealsowned":
        return selectedDays === 30
          ? metrics.deals_than_company_average?.risk_30_days || ""
          : metrics.deals_than_company_average?.risk_7_days || "";
      default:
        return "";
    }
  };

  // Transform API data into the required shape
  const transformApiData = (metricsArray) => {
    const transformed = {};

    metricsArray.forEach(({ rep_email, metrics }) => {
      transformed[rep_email] = {
        impactAnalysis: {
          dealClosure: {
            rate: (metrics.deal_closure_rate?.percent || 0).toFixed(1),
            userShare: metrics.deal_closure_rate?.user_share || 0,
            total: metrics.deal_closure_rate?.total || 0,
            count: metrics.deal_closure_rate?.count ?? "-", // <-- ADD count here
          },
          revenueImpact: {
            rate: (metrics.revenue_impact?.percent || 0).toFixed(1),
            userShare: metrics.revenue_impact?.user_share || 0,
            total: metrics.revenue_impact?.total || 0,
            count: metrics.revenue_impact?.count ?? "-", // <-- ADD
          },
          revenueWinRate: {
            rate: (metrics.revenue_win_rate?.percent || 0).toFixed(1),
            userShare: metrics.revenue_win_rate?.user_share || 0,
            total: metrics.revenue_win_rate?.total || 0,
            count: metrics.revenue_win_rate?.count ?? "-", // <-- ADD
          },
        },
        efficiencyAnalysis: {
          lastLogin: lastActivityDate,
          dealstagnationrate: {
            rate: (metrics.deal_stagnation_rate?.percent || 0).toFixed(1),
            userShare: metrics.deal_stagnation_rate?.user_share || 0,
            total: metrics.deal_stagnation_rate?.total || 0,
            count: metrics.deal_stagnation_rate?.count ?? "-", // <-- ADD
          },
          callRate: {
            rate: (metrics.connected_call_rate?.percent || 0).toFixed(1),
            userShare: metrics.connected_call_rate?.user_share || 0,
            total: metrics.connected_call_rate?.total || 0,
            count: metrics.connected_call_rate?.count ?? "-", // <-- ADD
          },
          taskCompletion: {
            rate: (metrics.task_completion_rate?.percent || 0).toFixed(1),
            userShare: metrics.task_completion_rate?.user_share || 0,
            total: metrics.task_completion_rate?.total || 0,
            count: metrics.task_completion_rate?.count ?? "-", // <-- ADD
          },
        },
        usageAnalysis: {
          meetingRate: {
            rate:
              (selectedDays === 30
                ? metrics.meetings_than_company_average?.percent_30_days
                : metrics.meetings_than_company_average?.percent_7_days
              )?.toFixed(1) || 0,
            count:
              (selectedDays === 30
                ? metrics.meetings_than_company_average?.user_metric_30_days
                : metrics.meetings_than_company_average?.user_metric_7_days) ??
              "-", // <-- ADD
          },
          actionstaken: {
            rate:
              (selectedDays === 30
                ? metrics.actions_than_company_average?.percent_30_days
                : metrics.actions_than_company_average?.percent_7_days
              )?.toFixed(1) || 0,
            count:
              (selectedDays === 30
                ? metrics.actions_than_company_average?.user_metric_30_days
                : metrics.actions_than_company_average?.user_metric_7_days) ??
              "-", // <-- ADD
          },
          contactsowned: {
            rate:
              (selectedDays === 30
                ? metrics.contacts_than_company_average?.percent_30_days
                : metrics.contacts_than_company_average?.percent_7_days
              )?.toFixed(1) || 0,
            count:
              (selectedDays === 30
                ? metrics.contacts_than_company_average?.user_metric_30_days
                : metrics.contacts_than_company_average?.user_metric_7_days) ??
              "-", // <-- ADD
          },
          dealsowned: {
            rate:
              (selectedDays === 30
                ? metrics.deals_than_company_average?.percent_30_days
                : metrics.deals_than_company_average?.percent_7_days
              )?.toFixed(1) || 0,
            count:
              (selectedDays === 30
                ? metrics.deals_than_company_average?.user_metric_30_days
                : metrics.deals_than_company_average?.user_metric_7_days) ??
              "-", // <-- ADD
          },
        },
      };
    });

    return transformed;
  };

  useEffect(() => {
    const mappedData = transformApiData(sales_performance_metrics);
    setUserDataMap(mappedData);

    // Default to first user in the API response
    if (sales_performance_metrics.length && !selectedUser) {
      setSelectedUser(sales_performance_metrics[0].rep_email);
    }
  }, [sales_performance_metrics, selectedDays]);

  useEffect(() => {
    if (selectedUser) {
      fetchLastActivityDate(token, selectedUser, latestReportId).then((res) => {
        const rawDate = res?.data;
        if (rawDate) {
          const formatted = new Date(rawDate).toLocaleDateString("en-GB"); // 28/04/2025
          setLastActivityDate(formatted);
        }
      });
    }
  }, [selectedUser]);

  const users = Object.keys(userDataMap);
  const userData = userDataMap[selectedUser] || {
    impactAnalysis: {},
    efficiencyAnalysis: {},
    usageAnalysis: {},
  };

  const impactMetrics = [
    {
      key: "dealClosure",
      label: "Deal Won",
      info: "Deal Win Rate: Close Won/All Closed Deals",
      text: "of all won deals",
      risk: "High Risk",
      suffix: "%",
    },
    {
      key: "revenueImpact",
      label: "Revenue Won",
      info: "Revenue Impact: Reps Closed Won Amount/Overall Closed Won Amount",
      text: "of the all won revenue",
      suffix: "%",
    },
    // {
    //   key: "revenueWinRate",
    //   label: "Revenue Win Rate",
    //   info: "Deal Win Rate: Close Won/All Closed Deals",
    //   text: "less than the company average",
    //   suffix: "%",
    // },
  ];

  const efficiencyMetrics = [
    {
      key: "lastLogin",
      label: "Last Login",
      info: "Last Activity Date",
      suffix: "",
    },
    {
      key: "dealstagnationrate",
      label: "Deal Stagnation Rate",
      info: "Deals stagnation rate: Rep’s Deals with no activity in the last 30 days/Rep’s All open dealse",
      suffix: "%",
    },
    {
      key: "taskCompletion",
      label: "Task Completion Rate",
      info: "Task Completion Rate: Rep’s Completed Tasks/Rep’s Total Tasks",
      suffix: "%",
    },
    {
      key: "callRate",
      label: "Connected Call Rate",
      info: "Connected Call Rate: Rep’s Connected Calls /Rep’s Total Calls",
      suffix: "%",
    },
  ];

  const getUsageMetrics = () => {
    const usage = userData.usageAnalysis;

    return [
      {
        key: "meetingRate",
        label: `${
          parseFloat(usage.meetingRate?.rate) > 0 ? "More" : "Less"
        } Meetings than the company average`,
        info: `${
          parseFloat(usage.meetingRate?.rate) > 0 ? "More" : "Less"
        } Meetings than the company average: (No of meeting Company wide - Rep’s Meetings)/ No of meeting Company wide`,
        suffix: "%",
        countLabel: "meetings taken",
      },
      {
        key: "actionstaken",
        label: `${
          parseFloat(usage.actionstaken?.rate) > 0 ? "More" : "Less"
        } Actions taken than the company average`,
        info: `${
          parseFloat(usage.actionstaken?.rate) > 0 ? "More" : "Less"
        } Actions taken than the company average: (Company-wide Actions - Rep’s Actions)/ Company-wide Actions (includes tasks, meetings, calls, emails)`,
        suffix: "%",
        countLabel: "actions taken",
      },
      {
        key: "contactsowned",
        label: `${
          parseFloat(usage.contactsowned?.rate) > 0 ? "More" : "Less"
        } Contacts owned than the company average`,
        info: `${
          parseFloat(usage.contactsowned?.rate) > 0 ? "More" : "Less"
        } Contacts owned than the company average: (Company Contacts - Rep Contacts)/ Company Contacts`,
        suffix: "%",
        countLabel: "contacts owned",
      },
      {
        key: "dealsowned",
        label: `${
          parseFloat(usage.dealsowned?.rate) > 0 ? "More" : "Less"
        } Deals owned than the company average`,
        info: `${
          parseFloat(usage.dealsowned?.rate) > 0 ? "More" : "Less"
        } Deals owned than the company average: (Company Deals - Rep Deals)/ Company Deals`,
        suffix: "%",
        countLabel: "deals owned",
      },
    ];
  };

  const getAreasOfImprovement = () => {
    if (!sales_performance_metrics || !Array.isArray(sales_performance_metrics))
      return [];

    const userMetrics = sales_performance_metrics.find(
      (item) => item.rep_email === selectedUser
    );
    if (!userMetrics) return [];

    const metrics = userMetrics.metrics || {};

    const improvements = [];

    // Impact Metrics
    if (metrics.deal_closure_rate?.risk === "High Risk") {
      improvements.push({
        label: "Deal Won Rate",
        inference: metrics.deal_closure_rate?.inference || "",
      });
    }
    if (metrics.revenue_impact?.risk === "High Risk") {
      improvements.push({
        label: "Revenue Impact Rate",
        inference: metrics.revenue_impact?.inference || "",
      });
    }
    if (metrics.revenue_win_rate?.risk === "High Risk") {
      improvements.push({
        label: "Revenue Win Rate",
        inference: metrics.revenue_win_rate?.inference || "",
      });
    }

    // Efficiency Metrics
    if (metrics.deal_stagnation_rate?.risk === "High Risk") {
      improvements.push({
        label: "Deal Stagnation Rate",
        inference: metrics.deal_stagnation_rate?.inference || "",
      });
    }
    if (metrics.connected_call_rate?.risk === "High Risk") {
      improvements.push({
        label: "Connected Call Rate",
        inference: metrics.connected_call_rate?.inference || "",
      });
    }
    if (metrics.task_completion_rate?.risk === "High Risk") {
      improvements.push({
        label: "Task Completion Rate",
        inference: metrics.task_completion_rate?.inference || "",
      });
    }

    // Usage Metrics (depends on selectedDays: 7 or 30)
    const usage = metrics;

    if (selectedDays === 30) {
      if (usage.meetings_than_company_average?.risk_30_days === "High Risk") {
        improvements.push({
          label: "Meeting Rate (30 Days)",
          inference:
            usage.meetings_than_company_average?.inference_30_days || "",
        });
      }
      if (usage.actions_than_company_average?.risk_30_days === "High Risk") {
        improvements.push({
          label: "Actions Taken (30 Days)",
          inference:
            usage.actions_than_company_average?.inference_30_days || "",
        });
      }
      if (usage.contacts_than_company_average?.risk_30_days === "High Risk") {
        improvements.push({
          label: "Contacts Owned (30 Days)",
          inference:
            usage.contacts_than_company_average?.inference_30_days || "",
        });
      }
      if (usage.deals_than_company_average?.risk_30_days === "High Risk") {
        improvements.push({
          label: "Deals Owned (30 Days)",
          inference: usage.deals_than_company_average?.inference_30_days || "",
        });
      }
    } else {
      if (usage.meetings_than_company_average?.risk_7_days === "High Risk") {
        improvements.push({
          label: "Meeting Rate (7 Days)",
          inference:
            usage.meetings_than_company_average?.inference_7_days || "",
        });
      }
      if (usage.actions_than_company_average?.risk_7_days === "High Risk") {
        improvements.push({
          label: "Actions Taken (7 Days)",
          inference: usage.actions_than_company_average?.inference_7_days || "",
        });
      }
      if (usage.contacts_than_company_average?.risk_7_days === "High Risk") {
        improvements.push({
          label: "Contacts Owned (7 Days)",
          inference:
            usage.contacts_than_company_average?.inference_7_days || "",
        });
      }
      if (usage.deals_than_company_average?.risk_7_days === "High Risk") {
        improvements.push({
          label: "Deals Owned (7 Days)",
          inference: usage.deals_than_company_average?.inference_7_days || "",
        });
      }
    }

    return improvements;
  };

  const getCompanyAverage = (metricKey) => {
    if (!companyAverages) return "";

    const avgMap = {
      dealClosure: companyAverages.deal_win_rate_avg,
      dealstagnationrate: companyAverages.deal_stagnation_avg,
      taskCompletion: companyAverages.task_completion_rate_avg,
      callRate: companyAverages.connected_call_rate_avg,
      meetingRate:
        selectedDays === 30
          ? companyAverages.meetings_avg_last_30_days
          : companyAverages.meetings_avg_last_7_days,
      actionstaken:
        selectedDays === 30
          ? companyAverages.actions_avg_last_30_days
          : companyAverages.actions_avg_last_7_days,
      contactsowned:
        selectedDays === 30
          ? companyAverages.contacts_avg_last_30_days
          : companyAverages.contacts_avg_last_7_days,
      dealsowned:
        selectedDays === 30
          ? companyAverages.deals_avg_last_30_days
          : companyAverages.deals_avg_last_7_days,
    };

    const avgValue = avgMap[metricKey];
    return avgValue !== undefined ? `company avg: ${avgValue}` : "";
  };

  const buildUsageActionDataPayload = () => {
    const userMetrics = sales_performance_metrics.find(
      (item) => item.rep_email === selectedUser
    );

    if (!userMetrics) {
      return null;
    }

    const m = userMetrics.metrics;

    const safePercent = (val) =>
      typeof val === "number" ? `${val.toFixed(0)}%` : "N/A";

    const payload = {
      impact_analytics: {
        deal_win_rate: safePercent(m.deal_closure_rate?.percent),
        revenue_win_rate: safePercent(m.revenue_win_rate?.percent),
        revenue_impact_rate: safePercent(m.revenue_impact?.percent),
      },
      moderate_risk: {
        task_completion_rate: {
          is_moderate_risk: m.task_completion_rate?.risk === "Moderate Risk",
          value: safePercent(m.task_completion_rate?.percent),
        },
        connected_call_rate: {
          is_moderate_risk: m.connected_call_rate?.risk === "Moderate Risk",
          value: safePercent(m.connected_call_rate?.percent),
        },
        deal_stagnation_rate: {
          is_moderate_risk: m.deal_stagnation_rate?.risk === "Moderate Risk",
          value: safePercent(m.deal_stagnation_rate?.percent),
        },
      },
      high_risk: {
        task_completion_rate: {
          is_high_risk: m.task_completion_rate?.risk === "High Risk",
          value: safePercent(m.task_completion_rate?.percent),
        },
        connected_call_rate: {
          is_high_risk: m.connected_call_rate?.risk === "High Risk",
          value: safePercent(m.connected_call_rate?.percent),
        },
        deal_stagnation_rate: {
          is_high_risk: m.deal_stagnation_rate?.risk === "High Risk",
          value: safePercent(m.deal_stagnation_rate?.percent),
        },
      },
    };

    return payload;
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <h3 className="text-xl font-bold">Sales Performance</h3>
        <ToggleSection
          isSectionExpanded={isMissingDataExpanded}
          setIsSectionExpanded={toggleSection}
        />
      </div>

      {/* User and Time Selection */}
      <div className="flex justify-between items-center mt-4 rounded-lg mx-10">
        <span></span>
        <select
          className="border rounded px-3 py-1"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-1"
          value={selectedDays}
          onChange={(e) => setSelectedDays(parseInt(e.target.value))}
        >
          {timeRanges.map((day) => (
            <option key={day} value={day}>
              {day} Days
            </option>
          ))}
        </select>
      </div>

      {/* Impact Analysis */}
      <div className="text-start mx-10 mt-6 font-semibold text-lg text-black">
        Impact Analysis
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 mx-10">
        {impactMetrics.map(({ key, label, info, text, suffix }) => (
          <div
            key={key}
            className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
              firstRowSelectedItem === key
                ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                : "bg-white"
            } ${getBorderColor(getRiskLevel(key))}`}
            onClick={() => {
              setfirstRowSelectedItem(key);
            }}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-center text-gray-600">
                {label}
              </p>
              <Tooltip tooltipText={info}>
                <img
                  className="h-4 min-w-4"
                  src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                  alt="Info"
                />
              </Tooltip>
            </div>
            <div className="flex flex-col items-start gap-2 justify-start mt-2">
              <p className="text-3xl font-bold text-gray-900">
                {userData.impactAnalysis[key]?.rate}
                {suffix}
              </p>
              <p className="text-sm text-gray-500">{text}</p>
              <p className="text-sm text-gray-500">
                {userData?.impactAnalysis[key]?.userShare?.toLocaleString()}
                <span className="text-gray-400">
                  / {userData.impactAnalysis[key]?.total?.toLocaleString()}
                </span>
              </p>
              {/* <p className="text-xs text-gray-500">{getCompanyAverage(key)}</p> */}
            </div>
            <img
              className="absolute bottom-4 right-4 h-4"
              src={findRiskImage(getRiskLevel(key))}
              alt={"High Risk"}
            />
          </div>
        ))}
      </div>

      <div className="mx-10 text-gray-600 text-sm my-8">
        <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
          {getInferenceText(firstRowSelectedItem)}
        </p>
      </div>
      <div className="mt-6">
        <SalesPerformanceBarChart
          salesPerformanceData={graphData}
          selectedMetric={firstRowSelectedItem}
        />
      </div>

      {/* Efficiency Analysis */}
      <div className="text-start mt-6 mx-10 font-semibold text-lg text-black">
        Efficiency Analysis
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mx-10">
        {efficiencyMetrics.map(({ key, label, info, suffix }) => (
          <div
            key={key}
            className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
              secondRowSelectedItem === key
                ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                : "bg-white"
            } ${getBorderColor(getRiskLevel(key))}`}
            onClick={() => {
              setSecondRowSelectedItem(key);
            }}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-600 pr-6 text-start min-h-12 max-w-60 max-h-12">
                {label}
              </p>
              <Tooltip tooltipText={info}>
                <img
                  className="h-4 min-w-4"
                  src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                  alt="Info"
                />
              </Tooltip>
            </div>
            <div className="flex flex-col items-start gap-2 justify-start mt-2">
              {key !== "lastLogin" ? (
                <p className="text-3xl font-bold text-gray-900">
                  {userData.efficiencyAnalysis[key]?.rate}
                  {suffix}
                </p>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {lastActivityDate}
                  {suffix}
                </p>
              )}

              {key !== "lastLogin" ? (
                <p className="text-sm text-gray-500">
                  {userData?.efficiencyAnalysis[
                    key
                  ]?.userShare?.toLocaleString()}
                  <span className="text-gray-400">
                    /{" "}
                    {userData.efficiencyAnalysis[key]?.total?.toLocaleString()}
                  </span>
                </p>
              ) : (
                <></>
              )}
            </div>
            <img
              className="absolute bottom-4 right-4 h-4"
              src={findRiskImage(getRiskLevel(key))}
              alt={"High Risk"}
            />
          </div>
        ))}
      </div>

      <div className="mx-10 text-gray-600 text-sm my-8">
        <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
          {getInferenceText(secondRowSelectedItem)}
        </p>
      </div>
      <div className="mt-6">
        <SalesPerformanceBarChart
          salesPerformanceData={graphData}
          selectedMetric={secondRowSelectedItem}
        />
      </div>

      {/* Usage Analysis */}
      <div className="text-start mt-10 mx-10 font-semibold text-lg text-black">
        Usage Analysis
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mx-10">
        {getUsageMetrics().map(({ key, label, info, suffix, countLabel }) => (
          <div
            key={key}
            className={`relative px-3 pt-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
              thirdRowSelectedItem === key
                ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                : "bg-white"
            } ${getBorderColor(getRiskLevel(key))}`}
            onClick={() => {
              setThirdRowSelectedItem(key);
            }}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-gray-600 pr-6 text-start min-h-12 max-w-60 max-h-12">
                {label}
              </p>
              <Tooltip tooltipText={info}>
                <img
                  className="h-4 min-w-4"
                  src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                  alt="Info"
                />
              </Tooltip>
            </div>
            <div className="flex flex-col items-start gap-2 justify-start mt-2">
              <p className="text-3xl font-bold text-gray-900">
                {userData.usageAnalysis[key]?.rate}
                {suffix}
              </p>

              <div className="text-xs text-left text-gray-500">
                <p>
                  {" "}
                  {countLabel} : {userData.usageAnalysis[key]?.count}{" "}
                </p>
                <p> {getCompanyAverage(key)}</p>
              </div>

              {/* <p className="text-sm text-gray-500">
                {item?.count.toLocaleString()}{" "}
                <span className="text-gray-400">
                  / {total_contacts.toLocaleString()}
                </span>
              </p> */}
              <p></p>
            </div>
            <img
              className="absolute bottom-4 right-4 h-4"
              src={findRiskImage(getRiskLevel(key))}
              alt={"High Risk"}
            />
          </div>
        ))}
      </div>

      <div className="mx-10 text-gray-600 text-sm my-8">
        <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
          {getInferenceText(thirdRowSelectedItem)}
        </p>
      </div>
      <div className="mt-6">
        <SalesPerformanceBarChart
          salesPerformanceData={graphData}
          selectedMetric={thirdRowSelectedItem}
        />
      </div>

      {/* Areas of Improvement */}
      <div className="text-start mt-14 mx-10 p-4" id="take_action">
        <h4 className="text-lg font-semibold">Areas of Improvement</h4>
        <ul className="list-none pl-6 mt-2 text-gray-600">
          {getAreasOfImprovement().length > 0 ? (
            getAreasOfImprovement().map((item, index) => (
              <li key={index} className="mb-2">
                <strong>✅ {item.label}</strong> - {item.inference}
              </li>
            ))
          ) : (
            <li>🎯 No high-risk areas detected for this user!</li>
          )}
        </ul>
      </div>

      <div className="mt-6 pb-4 flex flex-col sm:flex-row items-center justify-center gap-10 min-w-60">
        <button
          onClick={() => setShowModal(true)}
          className="shadow-none min-w-60 bg-white text-gray-800 border border-gray-800"
        >
          See Sample Email
        </button>
        <div className="relative group">
          <button
            className="shadow-none disabled:cursor-not-allowed"
            disabled={page === "past"}
            onClick={async () => {
              const payload = buildUsageActionDataPayload();
              console.log("payload:::", payload);

              if (!payload) {
                console.error("User metrics not found.");
                return;
              }

              try {
                await sendBulkEmailToReps(token, {
                  usage_action_data: payload,
                  objectTOSendEmail: "sales_performance_scorecard",
                  rep_email: selectedUser,
                  session_id: latestReportId,
                });
                success("Sending Email to Rep");
              } catch (err) {
                console.error("Failed to send email", err);
              }
            }}
          >
            Send Emails with the above points
          </button>

          {page === "past" && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Action can't be taken on past report
            </div>
          )}
        </div>
      </div>

      <div className="text-center"></div>
      <SalesPerformanceEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default SalesPerformance;
