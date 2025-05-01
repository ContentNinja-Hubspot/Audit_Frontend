import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { findBorderColor, getScoreColor } from "../utils";

const ScoreBreakdown = ({
  selectedBreakdown,
  setSelectedBreakdown,
  scoreBreakdown,
  salesReportProgress,
  salesScore,
  dataAuditScore,
}) => {
  const titleMap = {
    data_quality: "Data Quality",
    marketing: "Marketing",
    sales: "Sales",
    service: "Services",
  };

  const customOrder = ["Data Quality", "Sales", "Marketing", "Services"];

  const scores = Object.entries(scoreBreakdown).map(([key, value]) => {
    const isSales = key === "sales";
    const isDataQuality = key === "data_quality";
    const isComingSoon =
      (!isSales && (value.status === "Not in Use" || value.score === null)) ||
      (isSales && salesReportProgress < 100);

    let actualScore = value.score;
    if (isSales) {
      actualScore = salesScore;
    }
    if (isDataQuality) {
      actualScore = dataAuditScore;
    }

    // Set descriptions based on category
    let description = "";
    if (isComingSoon) {
      description = isSales
        ? `Complete your Sales report to unlock this score.`
        : "Coming soon.";
    } else if (isSales) {
      description =
        "Your Sales Score is a combination of two dimensions: Sales Usage and Sales Performance. It shows how consistently your team is using HubSpot and how that usage translates into performance outcomes.";
    } else if (isDataQuality) {
      description =
        "Your Data Quality Score reflects how complete and enriched your contact records are. Incomplete or inconsistent data leads to poor segmentation, inefficient workflows, and inaccurate reporting. This score helps identify the gaps in your database that may be hurting your marketing, sales, and service efforts.";
    } else {
      description = `Your ${titleMap[key]} score compared to the global benchmark of ${value.global_benchmark}.`;
    }

    return {
      title: titleMap[key] || key,
      score: isComingSoon ? "?" : Number(actualScore.toFixed(1)),
      description,
      comingSoon: isComingSoon,
    };
  });

  // Sort scores based on the custom order
  scores.sort(
    (a, b) => customOrder.indexOf(a.title) - customOrder.indexOf(b.title)
  );

  const [selectedScore, setSelectedScore] = useState(scores[0]);

  const pathColor = selectedScore.comingSoon
    ? "#d1d5db"
    : getScoreColor(selectedScore.score);

  return (
    <div className="mb-6 px-4 md:pr-10 md:px-0 lg:px-10">
      <div className="p-4 bg-white rounded-lg max-w-6xl mx-auto my-4">
        <h2 className="text-start font-semibold text-lg mb-3">
          Score Breakdown
        </h2>
        <div className="flex flex-col-reverse md:flex-row gap-4 w-[96%]">
          {/* Left Side - Scores */}
          <div className="flex-1 flex flex-col gap-3 rounded-xl">
            {scores.map((item) => {
              const isSales = item.title === "Sales";
              const isDataQuality = item.title === "Data Quality";
              const progressWidth = isSales ? `${salesReportProgress}%` : "0%";
              const isClickable = !item.comingSoon;

              return (
                <div
                  key={item.title}
                  onClick={() => {
                    if (isClickable) {
                      setSelectedScore(item);
                      setSelectedBreakdown(item.title);
                    }
                  }}
                  className={`relative p-4 rounded-lg text-black border ${findBorderColor(
                    item.score
                  )} transition duration-300 w-[85%] mx-auto
      ${
        (selectedScore.title === item.title && !item.comingSoon && !isSales) ||
        isDataQuality
          ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef] font-semibold"
          : "bg-white hover:bg-gray-100"
      }
      ${!isClickable ? "cursor-default pointer-events-none" : "cursor-pointer"}
      `}
                >
                  {/* Gradient progress bar for Sales */}
                  {isSales && (
                    <div
                      className="absolute top-0 left-0 h-full rounded-lg z-0 "
                      style={{
                        width: progressWidth,
                        background:
                          "linear-gradient(to right,  #06b6d4, #3b82f6)",
                        opacity: 0.1,
                      }}
                    />
                  )}

                  <div className="relative z-1">
                    <p
                      className={`${
                        item.comingSoon && !isSales
                          ? "text-gray-400 blur-[1px]"
                          : ""
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        item.comingSoon && !isSales
                          ? "text-gray-400 blur-[1px]"
                          : ""
                      }`}
                    >
                      {item.score}/100
                    </p>
                  </div>

                  {/* Coming Soon badge (for Sales if not ready or others) */}
                  {item.comingSoon && (
                    <span className="absolute top-2 right-2 text-xs font-semibold bg-gray-200 text-gray-700 py-1 px-2 rounded-full flex items-center gap-1">
                      {isSales
                        ? `Progress : ${salesReportProgress} %`
                        : "🕒 Coming Soon"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Side - Circular Progress Bar & Description */}
          <div className="flex-1 flex flex-col items-center py-6 rounded-xl border border-gray-200">
            <div className="w-36 h-36">
              <CircularProgressbar
                value={
                  selectedScore.comingSoon
                    ? 0
                    : selectedScore.score || dataAuditScore
                }
                text={`${
                  selectedScore.comingSoon
                    ? "?"
                    : selectedScore.score || dataAuditScore
                }%`}
                strokeWidth={10}
                styles={buildStyles({
                  textColor: "#374151",
                  pathColor,
                  trailColor: "#e5e7eb",
                  strokeLinecap: "round",
                  textSize: "20px",
                })}
              />
            </div>

            {/* Selected Score Title */}
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              {selectedScore.title}
            </h2>

            {/* Dynamic Description */}
            <p className="mt-3 text-gray-600 text-sm px-6 text-justify">
              {selectedScore.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;
