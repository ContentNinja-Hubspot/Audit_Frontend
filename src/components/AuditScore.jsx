import React from "react";

const AuditScore = ({
  overall_audit_score,
  overallScore,
  salesReportProgress,
}) => {
  const finalScore = overallScore ? Number(overallScore.toFixed(1)) : 0;
  const rawDifference =
    73 - (overallScore ? Number(overallScore.toFixed(1)) : 0);
  const difference = Math.abs(rawDifference);
  const status = rawDifference < 0 ? "ahead" : "behind";

  const progressPercent = `${Math.min(finalScore, 100)}%`;
  const reportGenerated = salesReportProgress === 100;

  const getProgressColor = (score) => {
    if (score < 30) return "bg-red-500";
    if (score < 60) return "bg-orange-400";
    return "bg-green-500";
  };

  const progressColorClass = getProgressColor(finalScore);

  return (
    <div className="mb-6 px-4 md:pr-10 md:px-0 lg:px-10">
      <div
        className="relative bg-white p-3 md:p-4 rounded-lg 
                   w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 
                   mx-auto md:mx-0 lg:mx-auto mt-2 flex flex-col"
        id="overall_audit_section"
      >
        {/* Heading - Always visible */}
        <h2 className="text-lg sm:text-base md:text-lg font-semibold text-left mb-3">
          Overall Audit Score
        </h2>

        {/* Score Bar Section */}
        <div className="relative pt-2 w-[95%] mx-auto">
          {/* Content with optional blur */}
          <div
            className={`${
              !reportGenerated
                ? "blur-[1px] opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm sm:text-base">0</p>
              <p className="text-sm sm:text-base md:text-xl font-bold mb-1">
                {Number(finalScore.toFixed(1))} / 100
              </p>
              <p className="text-sm sm:text-base">100</p>
            </div>

            <div className="h-2 bg-gray-200 rounded-full w-full mb-2">
              <div
                className={`h-2 ${progressColorClass} rounded-full transition-all duration-300 ease-in-out`}
                style={{ width: progressPercent }}
              ></div>
            </div>

            <p className="text-sm sm:text-md text-gray-700 my-3 text-center">
              You are{" "}
              <span className="font-bold">{Number(difference.toFixed(1))}</span>{" "}
              points {status} the Global Average.
            </p>
          </div>

          {/* Overlay Message */}
          {!reportGenerated && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <p className="text-gray-500 text-center md:text-lg text-base font-medium">
                Overall Score will be displayed after Sales Report is generated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditScore;
