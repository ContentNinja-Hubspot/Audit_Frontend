import React, { useState } from "react";
import MissingData from "../components/MissingData";
import { getBorderColor, findRiskImage } from "../utils";
import UsageScoreCard from "./sales/UsageScorecard";
import SalesPerformance from "./sales/SalesPerformance";
import ToggleSection from "./utils/ToggleSection";
import { useTheme } from "../context/ThemeContext";

const SalesAudit = ({
  salesReportData,
  salesPerformancescore,
  salesUsageScore,
  salesGraphData,
  page,
  completeReportGenerated,
  salesInUse,
}) => {
  const [selectedItem, setSelectedItem] = useState("usage_scorecard");
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  const { themeId } = useTheme();

  if (!salesInUse) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg">
          We could not conduct a Sales Audit as you do not have a paid sales
          seat assigned to any rep.
        </p>
      </div>
    );
  }

  const {
    inference_sales_usage,
    inference_sales_performance,
    company_averages,
  } = salesReportData;

  const total_reps = inference_sales_performance?.length || 0;

  const auditData = [
    {
      label: "usage_scorecard",
      title: "Usage Scorecard",
      score: Math.round(salesUsageScore),
      risk: "Moderate Risk",
    },
    {
      label: "sales_performance",
      title: "Sales Performance Scorecard",
      score: Math.round(salesPerformancescore),
      risk: "High Risk",
    },
  ];

  const { graph_usage_scorecard, graph_sales_performance } =
    salesGraphData || {};
  const inactiveDaysGraph = graph_usage_scorecard?.inactive_days;

  return (
    <div className="mb-6 px-4 md:pr-10 md:px-0 lg:px-10">
      {/* Section Heading */}
      <div className="w-full bg-white rounded-xl pb-6">
        <div className="flex items-center justify-between pr-5">
          <h3 className="text-lg font-bold text-start p-4">Sales</h3>
          <ToggleSection
            isSectionExpanded={isSectionExpanded}
            setIsSectionExpanded={setIsSectionExpanded}
          />
        </div>

        {/* Audit Score Section */}
        {isSectionExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-10">
            {auditData.map((item, index) => {
              const isSelected = selectedItem === item.label;
              const borderColor = getBorderColor(item.risk);
              const riskImage = findRiskImage(item.risk);
              const bgColor = isSelected
                ? `bg-partner-gradient-${themeId}`
                : "bg-white";

              return (
                <div
                  key={index}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 h-24 lg:h-32 ${bgColor} ${borderColor}`}
                  onClick={() => setSelectedItem(item.label)}
                >
                  <p className="text-lg text-start font-medium text-gray-800 truncate">
                    {item.title}
                  </p>
                  <div className="flex justify-between items-center mt-6 lg:mt-10">
                    <p className="text-lg lg:text-2xl font-semibold text-black">
                      {item.score} / 100
                    </p>
                    <img src={riskImage} alt="Risk" className="h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing Data Section */}
      <div className="mt-6 w-full">
        {selectedItem === "usage_scorecard" ? (
          <UsageScoreCard
            usage_metrics={inference_sales_usage}
            total_reps={total_reps}
            graphData={graph_usage_scorecard}
            page={page}
            completeReportGenerated={completeReportGenerated}
          />
        ) : (
          <SalesPerformance
            sales_performance_metrics={inference_sales_performance}
            total_reps={total_reps}
            graphData={graph_sales_performance}
            companyAverages={company_averages}
            inactiveDaysGraph={inactiveDaysGraph}
            page={page}
            completeReportGenerated={completeReportGenerated}
          />
        )}
      </div>
    </div>
  );
};

export default SalesAudit;
