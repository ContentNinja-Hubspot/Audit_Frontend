import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/header/Header";
import MainContent from "../components/MainContent";
import { useUser } from "../context/UserContext";
import { useAudit } from "../context/ReportContext";
import ReportGenerate from "../components/utils/GenerateReport";
import {
  triggerCheckReport,
  fetchAuditDataByID,
  fetchGraphData,
  checkReportGeneration,
  triggerReportGeneration,
  checkSalesReportStatus,
  fetchAllScores,
  fetchSalesReportData,
  fetchSalesGraphData,
} from "../api";

const Dashboard = () => {
  const { token } = useUser();
  const {
    selectedHub,
    latestReportData,
    graphData,
    setLatestReportData,
    setGraphData,
    reportGenerated,
    setReportGenerated,
    salesReportData,
    setSalesReportData,
    scores,
    setScores,
    salesGraphData,
    setSalesGraphData,
  } = useAudit();

  const [loading, setLoading] = useState(true);
  const [reportProgress, setReportProgress] = useState(0);
  const [salesReportProgress, setSalesReportProgress] = useState(0);
  const [salesReportGenerated, setSalesReportGenerated] = useState(false);
  const [salesScores, setSalesScores] = useState(0);

  const isPollingReport = useRef(false);
  const isPollingSales = useRef(false);

  const hubID = selectedHub?.hub_id;

  const pollReportGeneration = async () => {
    if (isPollingReport.current || !token || !hubID) return;
    isPollingReport.current = true;

    try {
      const data = await triggerCheckReport(token, hubID);

      if (
        !data.generate_report &&
        (data?.report_details?.status === "Pending" ||
          data?.report_details?.status === "In Progress")
      ) {
        setReportProgress(data?.report_details?.progress);
        setTimeout(pollReportGeneration, 60000);
      } else if (
        !data.generate_report &&
        data?.report_details?.status === "Completed"
      ) {
        const response = await fetchAuditDataByID(
          token,
          data.report_details.report_id
        );
        let graphResult = await fetchGraphData(
          token,
          data.report_details.report_id
        );
        setReportProgress(100);
        setGraphData(graphResult);
        const allScores = await fetchAllScores(token, hubID);
        setScores(allScores);
        setLatestReportData(response);
        setReportGenerated(true);
        // Start polling for sales report
        pollSalesReportGeneration(data.report_details.report_id);
      } else if (data.generate_report) {
        setReportProgress(2);
        triggerReportGeneration(token, hubID);
        setTimeout(pollReportGeneration, 60000);
      }
    } catch (err) {
      console.error("Error in polling:", err);
    }

    setLoading(false);
    isPollingReport.current = false;
  };

  const pollSalesReportGeneration = async (reportId) => {
    if (isPollingSales.current || !token || !hubID) return;
    isPollingSales.current = true;
    try {
      const salesData = await checkSalesReportStatus(token, hubID);

      if (salesData?.progress < 100 && salesData?.status !== "Completed") {
        setSalesReportProgress(salesData?.progress || 0);
        setTimeout(pollSalesReportGeneration, 60000);
      } else if (
        salesData?.progress == 100 &&
        salesData?.status === "Completed"
      ) {
        const salesData = await fetchSalesReportData(token);
        setSalesReportData(salesData);
        const allScores = await fetchAllScores(token, hubID);
        setScores(allScores);
        const salesGraphResult = await fetchSalesGraphData(token, reportId);
        setSalesGraphData(salesGraphResult.data);
        setSalesReportProgress(100);
        setSalesReportGenerated(true);
      } else {
        console.warn("Unexpected sales report status:", salesData);
      }
    } catch (err) {
      console.error("Error polling sales report:", err);
    }

    isPollingSales.current = false;
  };

  useEffect(() => {
    if (!token || !hubID) return;

    const triggerCheck = async () => {
      try {
        const response = await checkReportGeneration(token);
        if (response?.success && response?.generate_report) {
          pollReportGeneration();
        } else {
          setReportGenerated(true);
          setReportProgress(100);
          setSalesReportProgress(100);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking report generation:", error);
      }
    };

    triggerCheck();
  }, [token, hubID]);

  if (!token || !hubID) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Initializing...
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <Header />

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            Loading...
          </div>
        ) : !reportGenerated ? (
          <ReportGenerate progress={reportProgress} />
        ) : (
          <MainContent
            reportData={latestReportData}
            salesReportData={salesReportData}
            graphData={graphData}
            token={token}
            hubId={hubID}
            salesReportProgress={salesReportProgress}
            salesScores={salesScores}
            scores={scores}
            salesGraphData={salesGraphData}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
