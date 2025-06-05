import React, { useState } from "react";
import AuditScore from "../components/AuditScore";
import ScoreBreakdown from "../components/ScoreBreakdown";
import DataAudit from "../components/DataAudit";
import SalesAudit from "../components/SalesAudit";
import { useUser } from "../context/UserContext";
import HubSelector from "./header/HubSelector";
import { useAudit } from "../context/ReportContext";
import { ShareIcon } from "@heroicons/react/24/outline";
import ShareReportModal from "../components/ShareReportModal";
import { shareReport } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";

const CRYPTO_SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

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
  const [showShareModal, setShowShareModal] = useState(false);

  if (!reportData) return <div>Loading report...</div>;
  const { salesInUse, latestReportId } = useAudit();

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

  const handleShareReport = async (email) => {
    if (!email || !latestReportId) return;

    const encryptedId = CryptoJS.AES.encrypt(
      latestReportId.toString(),
      CRYPTO_SECRET_KEY
    ).toString();
    const encodedId = encodeURIComponent(encryptedId);

    const hubDomain = user?.hub_details?.data?.hub_domain || "unknown-hub";
    const reportLink = `${window.location.origin}/past-reports/${encodedId}?hub_domain=${hubDomain}`;

    const auditScore =
      overall_score && !isNaN(overall_score)
        ? Number(overall_score.toFixed(1))
        : "N/A";

    const auditDate = updated_at
      ? new Date(updated_at).toISOString().split("T")[0]
      : "N/A";

    try {
      const response = await shareReport(
        token,
        latestReportId,
        email,
        hubId,
        auditDate,
        auditScore,
        reportLink
      );

      return response;
    } catch (e) {
      console.error("Share report error:", e);
      return {
        status: "error",
        message: "Something went wrong while sharing the report.",
      };
    }
  };

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
      <div className="flex justify-end items-center gap-2 ml-5 md:mr-10 text-xs">
        <p>Last Updated: {updated_at}</p>
        {page !== "past" && (
          <button
            onClick={() => setShowShareModal(true)}
            disabled={!completeReportGenerated}
            className="bg-inherit text-black disabled:cursor-not-allowed disabled:opacity-50"
            title="Share Report"
          >
            Share <FontAwesomeIcon icon={faShare} className="h-5 w-5" />
          </button>
        )}
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
      <ShareReportModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareReport}
      />
    </div>
  );
};

export default MainContent;
