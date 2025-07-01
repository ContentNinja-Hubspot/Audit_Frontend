import React, { useState } from "react";
import AuditScore from "../components/AuditScore";
import ScoreBreakdown from "../components/ScoreBreakdown";
import DataAudit from "../components/DataAudit";
import SalesAudit from "../components/SalesAudit";
import { useUser } from "../context/UserContext";
import HubSelector from "./header/HubSelector";
import { useAudit } from "../context/ReportContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faDownload } from "@fortawesome/free-solid-svg-icons";
import ShareReportModal from "../components/ShareReportModal";
import { shareReport, downloadPdfReport } from "../api";
import CryptoJS from "crypto-js";
import { useNotify } from "../context/NotificationContext";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useUser();
  const { salesInUse, latestReportId } = useAudit();
  const { warn } = useNotify();

  if (!reportData) return <div>Loading report...</div>;

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

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const pdfUrl = await downloadPdfReport(token, latestReportId);

      const fileResponse = await fetch(pdfUrl);
      if (!fileResponse.ok) {
        throw new Error("Failed to fetch PDF file.");
      }

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename = url.split("/").pop();
      a.href = url;
      a.download = `hubspot-audit-report-${
        filename || `hubspot-audit-report.pdf`
      }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      warn("Failed to download PDF. Please try again later.");
    } finally {
      setDownloading(false);
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
          <>
            <button
              onClick={() => setShowShareModal(true)}
              disabled={!completeReportGenerated}
              className="bg-inherit text-black disabled:cursor-not-allowed disabled:opacity-50 text-xs"
              title="Share Report"
            >
              Share <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownload}
              disabled={!completeReportGenerated || downloading}
              className="bg-inherit text-black disabled:cursor-not-allowed disabled:opacity-50 text-xs"
              title="Download Report PDF"
            >
              {downloading ? (
                "Downloading..."
              ) : (
                <>
                  Download{" "}
                  <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
                </>
              )}
            </button>
          </>
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
