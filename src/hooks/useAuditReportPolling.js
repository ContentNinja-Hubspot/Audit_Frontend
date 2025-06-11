import React, { useRef } from "react";
import { triggerCheckReport, checkReportProgressViaReportId } from "../api";
import { fetchAuditReportData } from "../utils/reportUtils";

export const useAuditReportPolling = ({
  token,
  selectedHubId,
  setLatestReportId,
  setAuditReportData,
  setAuditGraphData,
  setReportScores,
  setAuditReportProgress,
  setAuditReportGenerated,
  setLoading,
  setShowProgress,
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
          data = await checkReportProgressViaReportId(
            token,
            manualReportId,
            selectedHubId
          );
          reportId = manualReportId;
          reportStatus = data?.data?.status;
          reportProgress = data?.data?.progress;
        } else {
          // Use checkreport API when reportId is not known yet
          data = await triggerCheckReport(token, selectedHubId);
          reportId = data?.report_details?.report_id;
          reportStatus = data?.report_details?.status;
          reportProgress = data?.report_details?.progress;
        }

        if (!reportId || !reportStatus) {
          console.warn("No report available to poll.");
          setLoading(false);
          return;
        }

        if (reportStatus === "Completed") {
          setLatestReportId(reportId);
          const { auditData, graph, scoreData } = await fetchAuditReportData({
            token,
            reportId,
          });

          setAuditReportData(auditData);
          setAuditGraphData(graph);
          setReportScores(scoreData);
          setAuditReportProgress(100);
          setAuditReportGenerated(true);
          setShowProgress(false);
          setLoading(false);
          return;
        }

        if (reportStatus === "Pending" || reportStatus === "In Progress") {
          setAuditReportProgress(reportProgress || 2);
          setLatestReportId(reportId);
          setShowProgress(true);
          setLoading(false);

          setTimeout(() => pollAuditReport(reportId), 30000); // Continue polling
        }

        setLoading(false);
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
