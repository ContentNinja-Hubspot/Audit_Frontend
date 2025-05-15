import React, { useState } from "react";
import MissingData from "../components/MissingData";
import ToggleSection from "./utils/ToggleSection";
import { getBorderColor, findRiskImage, getRiskLevel } from "../utils";

const DataAudit = ({
  auditObjectScore,
  dataAudit,
  graphData,
  page,
  token,
  hubId,
  completeReportGenerated,
}) => {
  const [selectedItem, setSelectedItem] = useState("Contacts");
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  const titleMap = {
    contacts: "Contacts",
    companies: "Companies",
    deals: "Deals",
    tickets: "Tickets",
  };

  const customOrder = ["Contacts", "Companies", "Deals", "Tickets"];

  const auditData = Object.entries(auditObjectScore)
    .map(([key, value]) => ({
      title: titleMap[key] || key,
      score: value.toString(),
      risk: getRiskLevel(value),
    }))
    .sort(
      (a, b) => customOrder.indexOf(a.title) - customOrder.indexOf(b.title)
    );

  return (
    <div className="mb-6 px-4 md:pr-10 md:px-0 lg:px-10">
      {/* Section Heading */}
      <div className="w-full bg-white rounded-xl pb-6">
        <div className="flex items-center justify-between pr-5">
          <h3 className="text-lg font-bold text-start p-4">
            Data Quality Score
          </h3>
          <ToggleSection
            isSectionExpanded={isSectionExpanded}
            setIsSectionExpanded={setIsSectionExpanded}
          />
        </div>

        {/* Audit Score Section */}
        {isSectionExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
            {auditData.map((item, index) => {
              const isSelected = selectedItem === item.title;
              const borderColor = getBorderColor(item.risk);
              const riskImage = findRiskImage(item.risk); // get the risk image based on the score
              const bgColor = isSelected
                ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                : "bg-white";

              return (
                <div
                  key={index}
                  className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 h-24 lg:h-32  ${bgColor} ${borderColor}`}
                  onClick={() => setSelectedItem(item.title)}
                >
                  <p className="text-sm xl:text-lg text-start font-medium text-gray-800">
                    {item.title}
                  </p>
                  <div className="flex justify-between items-center mt-6 lg:mt-10">
                    <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-black">
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
        <MissingData
          selectedItem={selectedItem}
          dataAudit={dataAudit}
          graphData={graphData}
          page={page}
          token={token}
          hubId={hubId}
          completeReportGenerated={completeReportGenerated}
        />
      </div>
    </div>
  );
};

export default DataAudit;
