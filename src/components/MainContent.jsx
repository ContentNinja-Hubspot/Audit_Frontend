import React, { useState } from "react";

import AuditScore from "../components/AuditScore";
import ScoreBreakdown from "../components/ScoreBreakdown";
import DataAudit from "../components/DataAudit";
import SalesAudit from "../components/SalesAudit";
import { useUser } from "../context/UserContext";
import HubSelector from "./header/HubSelector";
import { useAudit } from "../context/ReportContext";

const MainContent = ({
  reportData,
  salesReportData,
  graphData,
  page,
  token,
  hubId,
  salesReportProgress,
  scores,
  salesGraphData,
  completeReportGenerated,
}) => {
  const [selectedBreakdown, setSelectedBreakdown] = useState("Data Quality");
  const { user } = useUser();

  if (!reportData) return <div>Loading report...</div>;
  const { salesInUse } = useAudit();

  const { result, updated_at } = reportData;
  const { data_audit, object_scores, overall_audit_score, score_breakdown } =
    result;
  const {
    overall_score,
    data_audit_score,
    sales_score,
    sales_performance_score,
    usage_score,
  } = scores || {};

  return (
    <div
      className={`${
        page === "past" ? "my-20 sm:my-20" : "my-16 sm:my-20"
      } max-w-7xl mx-auto min-h-screen`}
    >
      <div className="flex lg:hidden justify-start gap-2 items-center p-2 pr-6 ml-3">
        <h2 className="text-lg md:text-2xl text-left">
          Hi {user?.hub_details?.data?.hs_user}
        </h2>
        <div className={`${page === "past" ? "hidden" : "block"} `}>
          <HubSelector completeReportGenerated={completeReportGenerated} />
        </div>
      </div>
      <div>
        <p className="text-start lg:text-end ml-5 md:mr-10 text-xs">
          Last Updated: {updated_at}
        </p>
      </div>

      <AuditScore
        overall_audit_score={overall_audit_score}
        overallScore={overall_score}
        salesReportProgress={salesReportProgress}
      />
      <ScoreBreakdown
        selectedBreakdown={selectedBreakdown}
        setSelectedBreakdown={setSelectedBreakdown}
        scoreBreakdown={score_breakdown}
        salesReportProgress={salesReportProgress}
        salesScore={sales_score}
        dataAuditScore={data_audit_score}
        salesInUse={salesInUse}
      />

      {selectedBreakdown === "Data Quality" ? (
        <DataAudit
          auditObjectScore={object_scores}
          dataAudit={data_audit}
          graphData={graphData}
          page={page}
          token={token}
          hubId={hubId}
          completeReportGenerated={completeReportGenerated}
        />
      ) : (
        <SalesAudit
          salesReportData={salesReportData}
          salesPerformancescore={sales_performance_score}
          salesUsageScore={usage_score}
          salesGraphData={salesGraphData}
          page={page}
          completeReportGenerated={completeReportGenerated}
          salesInUse={salesInUse}
        />
      )}
    </div>
  );
};

export default MainContent;
