import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAuditDataByID,
  fetchGraphData,
  fetchSalesReportData,
  fetchAllScores,
  fetchSalesGraphData,
  triggerCheckReport,
  checkSalesReportStatus,
} from "../api";
import { useUser } from "./UserContext";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const { user, token } = useUser();
  const [selectedHub, setSelectedHub] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [latestReportData, setLatestReportData] = useState(null);
  const [salesReportData, setSalesReportData] = useState(null);
  const [salesGraphData, setSalesGraphData] = useState(null);
  const [scores, setScores] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [latestReportId, setLatestReportId] = useState(null);

  // Set the default hub when user is ready
  useEffect(() => {
    if (user?.unique_hub_ids?.length > 0) {
      const hubDetails = user.hub_details?.data;
      const defaultHub =
        user.unique_hub_ids.find(
          (hub) => hub.hub_domain === hubDetails?.hub_domain
        ) || user.unique_hub_ids[0];
      setSelectedHub(defaultHub);
    }
  }, [user]);

  // New logic: check both audit and sales reports are complete before fetching data
  useEffect(() => {
    const checkAndFetchReports = async () => {
      if (!selectedHub?.hub_id || !token) return;

      try {
        // Step 1: Check audit report status
        const auditStatus = await triggerCheckReport(token, selectedHub.hub_id);
        const auditComplete =
          !auditStatus.generate_report &&
          auditStatus?.report_details?.status === "Completed";
        const reportId = auditStatus?.report_details?.report_id;

        if (!auditComplete || !reportId) {
          console.log("Audit report not ready");
          return;
        }

        setLatestReportId(reportId);
        setReportGenerated(true);

        // Step 2: Check sales report status
        const salesStatus = await checkSalesReportStatus(
          token,
          selectedHub.hub_id
        );
        const salesComplete =
          salesStatus?.progress === 100 && salesStatus?.status === "Completed";

        if (!salesComplete) {
          console.log("Sales report not ready");
          return;
        }

        // Step 3: Fetch data
        const [auditData, salesData, graph, salesGraph, scoreData] =
          await Promise.all([
            fetchAuditDataByID(token, reportId),
            fetchSalesReportData(token, reportId),
            fetchGraphData(token, reportId),
            fetchSalesGraphData(token, reportId),
            fetchAllScores(token, reportId),
          ]);

        setLatestReportData(auditData);
        setSalesReportData(salesData);
        setGraphData(graph);
        setSalesGraphData(salesGraph.data);
        setScores(scoreData);
      } catch (err) {
        console.error("Error during report readiness check:", err);
      }
    };

    checkAndFetchReports();
  }, [selectedHub, token]);

  return (
    <ReportContext.Provider
      value={{
        selectedHub,
        setSelectedHub,
        reportGenerated,
        setReportGenerated,
        latestReportData,
        setLatestReportData,
        graphData,
        setGraphData,
        salesReportData,
        setSalesReportData,
        scores,
        setScores,
        salesGraphData,
        setSalesGraphData,
        latestReportId,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useAudit = () => useContext(ReportContext);
