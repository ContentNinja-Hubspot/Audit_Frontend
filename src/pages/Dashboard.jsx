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
  triggerReportGeneration,
  checkSalesReportStatus,
  fetchAllScores,
  fetchSalesReportData,
  fetchSalesGraphData,
  addNewAccount,
  checkReportProgressViaReportId,
  fetchUserCredits,
} from "../api";
import Cookies from "js-cookie";

const Dashboard = () => {
  const { token } = useUser();
  const { success, warn } = useNotify();
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
    completeReportGenerated,
    setCompleteReportGenerated,
    setSalesInUse,
    firstReportId,
    reportProgress,
    setReportProgress,
  } = useAudit();

  const hasTriggeredReport = useRef(false);

  const [loading, setLoading] = useState(true);

  const [salesReportGenerated, setSalesReportGenerated] = useState(false);
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
        const creditData = await fetchUserCredits(token);
        if (!creditData?.success || creditData.credits_remaining <= 10) {
          warn("You do not have enough credits to generate a report.");
          return;
        }
        console.log(
          "Enough credits to generate report:",
          creditData.credits_remaining
        );
        setReportProgress(2);
        if (!hasTriggeredReport.current) {
          hasTriggeredReport.current = true;
          triggerReportGeneration(token, hubID);
        }
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
      const salesData = await checkSalesReportStatus(token, reportId);
      if (salesData?.completed_objects?.includes("no_sales_seat")) {
        console.log("No sales seat assigned to any rep.");
        setSalesInUse(false);
        setCompleteReportGenerated(true);
        setSalesReportProgress(100);
        setSalesReportData({
          message:
            "We could not conduct a Sales Audit as you do not have a paid sales seat assigned to any rep.",
        });
        setSalesGraphData(null);
        const allScores = await fetchAllScores(token, reportId);
        setScores(allScores);
        return;
      }

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
        setCompleteReportGenerated(true);
      } else {
        console.warn("Unexpected sales report status:", salesData);
      }
    } catch (err) {
      console.error("Error polling sales report:", err);
    }

    isPollingSales.current = false;
  };

  const pollReportGenerationViaReportId = async ({
    token,
    reportId,
    hubId,
    checkFn,
    onProgressUpdate = () => {},
    interval = 60000,
  }) => {
    while (true) {
      try {
        const response = await checkFn(token, reportId, hubId);
        const success = response?.status === "success";
        const progress = response?.data?.progress || 0;

        if (success) {
          onProgressUpdate(progress);
          if (progress >= 100) {
            // setLoading(false);
            return true;
          }
        } else {
          console.warn("Failed to get progress, retrying...");
        }
        setLoading(false);
      } catch (err) {
        console.error("Polling error:", err);
      }

      // setLoading(false);

      await new Promise((res) => setTimeout(res, interval)); // wait 1 minute
    }
  };

  useEffect(() => {
    const fetchSalesReportStatus = async () => {
      try {
        setSalesInUse(true);
        const response = await checkSalesReportStatus(token, firstReportId);
        if (response?.completed_objects?.includes("no_sales_seat")) {
          console.log("No sales seat assigned to any rep in dashboard.");
          setSalesInUse(false);
          setCompleteReportGenerated(true);
        }
      } catch (e) {
        error("Error while fetching sales report status");
        console.error("Failed to fetch sales report status:", e);
      }
    };

    if (token) {
      fetchSalesReportStatus();
    }
  }, [token, hubID]);

  useEffect(() => {
    if (!token || !hubID) return;

    const triggerCheck = async () => {
      try {
        const data = await triggerCheckReport(token, hubID);

        setLatestReportId(firstReportId);

        if (checkTriggerReportGeneration) {
          const creditData = await fetchUserCredits(token);
          if (!creditData?.success || creditData.credits_remaining <= 10) {
            warn("You do not have enough credits to generate a report.");
            return;
          }
          console.log(
            "Enough credits to generate report:",
            creditData.credits_remaining
          );
          setReportProgress(2);
          if (!hasTriggeredReport.current) {
            hasTriggeredReport.current = true;
            triggerReportGeneration(token, hubID);
          }
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
            checkSalesReportStatus(token, reportId),
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
            setCompleteReportGenerated(true);
          } else {
            pollSalesReportGeneration(reportId);
          }

          setLoading(false);
        } else {
          const isComplete = await pollReportGenerationViaReportId({
            token,
            reportId: firstReportId,
            hubId: selectedHub.hub_id,
            checkFn: checkReportProgressViaReportId,
            onProgressUpdate: (progress) => setReportProgress(progress || 2),
          });

          if (!isComplete) {
            console.log("Report progress polling timed out");
            return;
          }

          const [report, graph, allScores, salesStatus] = await Promise.all([
            fetchAuditDataByID(token, firstReportId),
            fetchGraphData(token, firstReportId),
            fetchAllScores(token, firstReportId),
            checkSalesReportStatus(token, firstReportId),
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
              fetchSalesReportData(token, firstReportId),
              fetchSalesGraphData(token, firstReportId),
            ]);
            setSalesReportData(salesData);
            setSalesGraphData(salesGraph.data);
            setSalesReportProgress(100);
            setSalesReportGenerated(true);
            setCompleteReportGenerated(true);
          } else {
            pollSalesReportGeneration(firstReportId);
          }

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
        <Header completeReportGenerated={completeReportGenerated} />

        {!user?.hub_details?.data?.hs_user ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
            <div className="bg-inherit border bg-white border-black text-black px-6 py-4 rounded shadow-md max-w-lg mx-auto">
              <p className="text-lg font-medium">
                Looks like you haven’t added any hub yet.
              </p>
              <p className="mt-2 text-sm">
                Please add a new hub using the button below.
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
            scores={scores}
            salesGraphData={salesGraphData}
            completeReportGenerated={completeReportGenerated}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
