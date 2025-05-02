import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAuditDataByID,
  fetchGraphData,
  fetchSalesReportData,
  fetchAllScores,
  fetchSalesGraphData,
  triggerCheckReport,
  checkSalesReportStatus,
  checkReportGeneration,
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
  const [checkTriggerReportGeneration, setCheckTriggerReportGeneration] =
    useState(false);
  const [latestReportId, setLatestReportId] = useState(null);
  const [salesReportProgress, setSalesReportProgress] = useState(2);

  // Set the default hub when user is ready
  useEffect(() => {
    if (user?.unique_hub_ids?.length > 0) {
      const hubDetails = user.hub_details?.data;
      const defaultHub =
        user.unique_hub_ids.find(
          (hub) => hub.hub_domain === hubDetails?.hub_domain
        ) || user.unique_hub_ids[0];
      setSelectedHub(defaultHub);
      setLatestReportId(defaultHub?.latest_report_id || null);
    }
  }, [user]);

  useEffect(() => {
    const checkReportGenerationForSession = async (token) => {
      try {
        const response = await checkReportGeneration(token);
        if (response?.generate_report) {
          setCheckTriggerReportGeneration(true);
        }
      } catch (error) {
        console.error("Error checking report generation:", error);
        return null;
      }
    };

    checkReportGenerationForSession(token);
  }, [token]);

  // New logic: check both audit and sales reports are complete before fetching data
  useEffect(() => {
    const fetchAuditReport = async () => {
      if (!selectedHub?.hub_id || !token) return;

      try {
        if (checkTriggerReportGeneration) {
          console.log(
            "Triggering report generation...",
            checkTriggerReportGeneration
          );
          const auditStatus = await triggerCheckReport(
            token,
            selectedHub.hub_id
          );
          console.log("Audit Status:", auditStatus);
          const auditComplete =
            auditStatus?.report_details?.status === "Completed";
          const reportId = auditStatus?.report_details?.report_id;

          if (!auditComplete || !reportId) {
            console.log("Audit report not ready");
            return;
          }

          setLatestReportId(reportId);
          setReportGenerated(true);

          // Fetch audit-related data
          const [auditData, graph, scoreData] = await Promise.all([
            fetchAuditDataByID(token, reportId),
            fetchGraphData(token, reportId),
            fetchAllScores(token, reportId),
          ]);

          setLatestReportData(auditData);
          setGraphData(graph);
          setScores(scoreData);

          // Trigger sales report check in parallel (don't block audit data)
          fetchSalesReport(reportId);
        } else {
          const [auditData, graph, scoreData] = await Promise.all([
            fetchAuditDataByID(token, latestReportId),
            fetchGraphData(token, latestReportId),
            fetchAllScores(token, latestReportId),
          ]);

          setLatestReportData(auditData);
          setGraphData(graph);
          setScores(scoreData);

          fetchSalesReport(latestReportId);
          setReportGenerated(true);
        }
      } catch (err) {
        console.error("Error during audit report fetch:", err);
      }
    };

    const fetchSalesReport = async (reportId) => {
      try {
        const salesStatus = await checkSalesReportStatus(
          token,
          selectedHub.hub_id,
          reportId
        );
        const salesComplete = salesStatus?.status === "Completed";

        if (!salesComplete) {
          console.log("Sales report not ready");
          return;
        }

        const [salesData, salesGraph] = await Promise.all([
          fetchSalesReportData(token, reportId),
          fetchSalesGraphData(token, reportId),
        ]);

        setSalesReportData(salesData);
        setSalesGraphData(salesGraph.data);
        setSalesReportProgress(100);
      } catch (err) {
        console.error("Error during sales report fetch:", err);
      }
    };

    fetchAuditReport();
  }, [selectedHub, token, checkTriggerReportGeneration]);

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
        setLatestReportId,
        checkTriggerReportGeneration,
        salesReportProgress,
        setSalesReportProgress,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useAudit = () => useContext(ReportContext);
