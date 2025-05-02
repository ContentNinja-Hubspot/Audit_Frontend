import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Header from "../components/header/Header";
import MainContent from "../components/MainContent";
import { useUser } from "../context/UserContext";
import { useAudit } from "../context/ReportContext";
import { useNotify } from "../context/NotificationContext";
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
  addNewAccount,
} from "../api";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { token } = useUser();
  const { success } = useNotify();
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
    setLatestReportId,
    checkTriggerReportGeneration,
    salesReportProgress,
    setSalesReportProgress,
  } = useAudit();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("state")) {
      params.delete("state");
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const [loading, setLoading] = useState(true);
  const [reportProgress, setReportProgress] = useState(0);

  const [salesReportGenerated, setSalesReportGenerated] = useState(false);
  const [salesScores, setSalesScores] = useState(0);
  const { user } = useUser();

  const isPollingReport = useRef(false);
  const isPollingSales = useRef(false);

  const hubID = selectedHub?.hub_id;

  const handleAddNewAccount = async () => {
    const result = await addNewAccount(token);
    Cookies.set("state", result?.state, {
      path: "/",
      sameSite: "Lax",
      secure: true,
      expires: 1,
    });

    success("Adding new account...");
    setTimeout(() => {
      window.location.href = result?.redirect_url;
    }, 2000);
  };

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
        setLatestReportId(data.report_details.report_id);
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
        const allScores = await fetchAllScores(
          token,
          data.report_details.report_id
        );
        setScores(allScores);
        setLatestReportData(response);
        setReportGenerated(true);
        // Start polling for sales report
        pollSalesReportGeneration(data.report_details.report_id);
      } else if (data.generate_report && checkTriggerReportGeneration) {
        setReportProgress(2);
        triggerReportGeneration(token, hubID);
        setTimeout(pollReportGeneration, 60000);
      }
      if (data?.report_details?.report_id) {
        setLatestReportId(data.report_details.report_id);
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
      const salesData = await checkSalesReportStatus(token, hubID, reportId);

      if (salesData?.progress < 100 && salesData?.status !== "Completed") {
        setSalesReportProgress(salesData?.progress || 0);
        setTimeout(() => pollSalesReportGeneration(reportId), 60000);
      } else if (
        salesData?.progress == 100 &&
        salesData?.status === "Completed"
      ) {
        const salesData = await fetchSalesReportData(token, reportId);
        setSalesReportData(salesData);
        const allScores = await fetchAllScores(token, reportId);
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
        const data = await triggerCheckReport(token, hubID);

        if (data?.generate_report && checkTriggerReportGeneration) {
          // Report generation is needed — initiate it
          setReportProgress(2);
          triggerReportGeneration(token, hubID);
          pollReportGeneration();
        } else if (
          data?.report_details?.status === "Pending" ||
          data?.report_details?.status === "In Progress"
        ) {
          // Report exists but is still being generated
          setReportProgress(data?.report_details?.progress || 2);
          pollReportGeneration(); // will continue polling
        } else if (data?.report_details?.status === "Completed") {
          // Already done — fetch immediately
          const reportId = data?.report_details?.report_id;
          const [report, graph, allScores, salesStatus] = await Promise.all([
            fetchAuditDataByID(token, reportId),
            fetchGraphData(token, reportId),
            fetchAllScores(token, reportId),
            checkSalesReportStatus(token, hubID, reportId),
          ]);

          setLatestReportData(report);
          setGraphData(graph);
          setScores(allScores);
          setReportProgress(100);
          setReportGenerated(true);

          if (
            salesStatus?.status === "Completed" &&
            salesStatus?.progress === 100
          ) {
            const [salesData, salesGraph] = await Promise.all([
              fetchSalesReportData(token, reportId),
              fetchSalesGraphData(token, reportId),
            ]);
            setSalesReportData(salesData);
            setSalesGraphData(salesGraph.data);
            setSalesReportProgress(100);
            setSalesReportGenerated(true);
          } else {
            pollSalesReportGeneration(reportId);
          }

          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking report generation:", error);
        setLoading(false);
      }
    };

    triggerCheck();
  }, [token, hubID]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <Header />

        {!user?.hub_details?.data?.hs_user ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
            <div className="bg-inherit border bg-white border-black text-black px-6 py-4 rounded shadow-md max-w-lg mx-auto">
              <p className="text-lg font-medium">
                Looks like you haven’t added any Hub yet.
              </p>
              <p className="mt-2 text-sm">
                Please select a Hub using the dropdown at the top to view your
                audit report.
              </p>
              <button onClick={handleAddNewAccount} className="my-4 p-2">
                + Add New Portal
              </button>
            </div>
          </div>
        ) : loading ? (
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
