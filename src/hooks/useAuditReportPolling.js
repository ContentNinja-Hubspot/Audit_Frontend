import React, { useRef } from "react";
import { triggerCheckReport, checkReportProgressViaReportId } from "../api";
import { fetchAuditReportData } from "../utils/reportUtils";

export const useAuditReportPolling = ({
  token,
  selectedHubId,
  setReportId,
  setAuditReportData,
  setAuditGraphData,
  setReportScores,
  setAuditReportProgress,
  setAuditReportGenerated,
}) => {
  const isPollingReport = useRef(false);

  const pollAuditReport = (manualReportId = null) => {
    if (isPollingReport.current || !token || !selectedHubId) return;
    isPollingReport.current = true;

    const poll = async () => {
      try {
        let data;
        let reportId;
        let reportStatus;
        let reportProgress;

        if (manualReportId) {
          // Use new API when reportId is known
          data = await checkReportProgressViaReportId(
            token,
            manualReportId,
            selectedHubId
          );
          reportId = manualReportId;
          reportStatus = data?.data?.status;
          reportProgress = data?.data?.progress;
        } else {
          // Use default API when reportId is not known yet
          data = await triggerCheckReport(token, selectedHubId);
          reportId = data?.report_details?.report_id;
          reportStatus = data?.report_details?.status;
          reportProgress = data?.report_details?.progress;
        }

        if (!reportId || !reportStatus) {
          console.warn("No report available to poll.");
          return;
        }

        if (reportStatus === "Completed") {
          setReportId(reportId);
          const { auditData, graph, scoreData } = await fetchAuditReportData({
            token,
            reportId,
          });

          setAuditReportData(auditData);
          setAuditGraphData(graph);
          setReportScores(scoreData);
          setAuditReportProgress(100);
          setAuditReportGenerated(true);
          return;
        }

        if (reportStatus === "Pending" || reportStatus === "In Progress") {
          setAuditReportProgress(reportProgress || 2);
          setReportId(reportId);

          setTimeout(() => pollAuditReport(reportId), 60000); // Continue polling
        }
      } catch (err) {
        console.error("Polling error:", err);
      } finally {
        isPollingReport.current = false;
      }
    };

    poll();
  };

  return { pollAuditReport };
};
