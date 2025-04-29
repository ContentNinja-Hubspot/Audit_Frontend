import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchAuditDataByID,
  fetchGraphData,
  fetchSalesReportData,
  fetchAllScores,
  fetchSalesGraphData,
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

  // Fetch report when selectedHub is ready
  useEffect(() => {
    const fetchReportAndGraph = async () => {
      if (selectedHub?.latest_report_id && token) {
        try {
          const report = await fetchAuditDataByID(
            token,
            selectedHub.latest_report_id
          );
          const salesData = await fetchSalesReportData(token);
          setLatestReportData(report);
          setSalesReportData(salesData);

          const graph = await fetchGraphData(
            token,
            selectedHub.latest_report_id
          );
          const salesGraph = await fetchSalesGraphData(
            token,
            selectedHub.latest_report_id
          );
          setSalesGraphData(salesGraph.data);
          const scores = await fetchAllScores(token);
          setScores(scores);
          setGraphData(graph);
        } catch (error) {
          console.error("Failed to fetch report or graph data:", error);
        }
      }
    };

    fetchReportAndGraph();
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
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useAudit = () => useContext(ReportContext);
