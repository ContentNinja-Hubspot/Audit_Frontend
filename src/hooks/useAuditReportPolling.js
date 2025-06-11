import React, { useRef } from "react";
import { triggerCheckReport } from "../api";
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

  const pollAuditReport = async () => {
    if (isPollingReport.current || !token || !selectedHubId) return;
    isPollingReport.current = true;

    try {
      const data = await triggerCheckReport(token, selectedHubId);
      console.log("check report data:", data);

      const reportStatus = data?.report_details?.status;

      if (reportStatus === "Completed") {
        const reportId = data.report_details.report_id;
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
        setAuditReportProgress(data?.report_details?.progress || 2);

        if (data?.report_details?.report_id) {
          setReportId(data.report_details.report_id);
        }

        setTimeout(pollAuditReport, 60000);
      }
    } catch (err) {
      console.error("Polling error:", err);
    } finally {
      isPollingReport.current = false;
    }
  };

  return { pollAuditReport };
};
