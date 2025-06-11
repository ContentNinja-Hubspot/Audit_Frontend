import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/header/Header";
import MainContent from "../components/MainContent";
import ReportGenerate from "../components/utils/GenerateReport";

import { useUser } from "../context/UserContext";
import { useReport } from "../context/ReportContext_v2";
import { useReportProgress } from "../context/ReportProgressContext";

import { checkReportGeneration, triggerReportGeneration } from "../api";
import { useAuditReportPolling } from "../hooks/useAuditReportPolling";
import { useSalesReportPolling } from "../hooks/useSalesReportPolling";

const Dashboard_v2 = () => {
  const [loading, setLoading] = useState(false);

  const { user, token } = useUser();

  const {
    auditReportData,
    auditGraphData,
    salesReportData,
    salesGraphData,
    reportScores,
    setAuditReportData,
    setAuditGraphData,
    setSalesReportData,
    setSalesGraphData,
    setReportScores,
    latestReportId,
    setLatestReportId,
  } = useReport();

  const {
    auditReportProgress,
    salesReportProgress,
    salesInUse,
    auditReportGenerated,
    completeReportGenerated,
    setAuditReportProgress,
    setSalesReportProgress,
    setSalesInUse,
    setAuditReportGenerated,
    setCompleteReportGenerated,
  } = useReportProgress();

  const [selectedHubId, setSelectedHubId] = useState(null);
  const [reportId, setReportId] = useState(null);

  /************** Initialize custom hooks for polling **************/
  const { pollAuditReport } = useAuditReportPolling({
    token,
    selectedHubId,
    setAuditReportData,
    setAuditGraphData,
    setReportScores,
    setReportId,
    setAuditReportProgress,
    setAuditReportGenerated,
  });

  const { pollSalesReport } = useSalesReportPolling({
    token,
    selectedHubId,
    setSalesInUse,
    setSalesReportData,
    setSalesGraphData,
    setReportScores,
    setSalesReportProgress,
    setCompleteReportGenerated,
  });

  /************** Check if a new report needs to be generated **************/
  const handleCheckReportGeneration = async () => {
    const result = await checkReportGeneration(token);
    return result?.generate_report ?? false;
  };

  /************** Identify selected hub and set latest report ID **************/
  const handleSettingSelectedHub = async (user) => {
    const selectedHubId = user?.hub_details?.data?.hub_id || null;

    const matchedHub = user?.unique_hub_ids?.find(
      (hub) => hub.hub_id === selectedHubId
    );

    const userLatestReportId = matchedHub?.latest_report_id || null;

    setSelectedHubId(selectedHubId);
    setLatestReportId(userLatestReportId);

    // Return both values immediately for use in logic
    return { selectedHubId, userLatestReportId };
  };

  /************** Main init effect — triggered once on load **************/
  useEffect(() => {
    const init = async () => {
      const { selectedHubId, userLatestReportId } =
        await handleSettingSelectedHub(user);
      const resultCheckReportGeneration = await handleCheckReportGeneration();

      if (!loading && resultCheckReportGeneration === true && selectedHubId) {
        setAuditReportProgress(2);
        // await triggerReportGeneration(token, selectedHubId);
        setTimeout(() => {
          pollAuditReport();
        }, 30000);
      } else if (
        !loading &&
        resultCheckReportGeneration === false &&
        userLatestReportId &&
        selectedHubId
      ) {
        setAuditReportProgress(2);
        pollAuditReport(userLatestReportId);
      }

      setLoading(false);
    };

    init();
  }, [token, selectedHubId, loading]);

  /************** When audit report is generated, trigger sales report polling **************/
  useEffect(() => {
    if (auditReportGenerated && latestReportId) {
      pollSalesReport(latestReportId);
    }
  }, [auditReportGenerated]);

  /************** Loading UI **************/
  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto h-screen">
          <Header />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p>Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /************** Main Content UI **************/
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <Header />
        {!auditReportGenerated ? (
          <ReportGenerate progress={auditReportProgress} />
        ) : (
          <MainContent
            token={token}
            hubId={selectedHubId}
            reportData={auditReportData}
            graphData={auditGraphData}
            salesInUse={salesInUse}
            salesReportData={salesReportData}
            salesGraphData={salesGraphData}
            salesReportProgress={salesReportProgress}
            scores={reportScores}
            completeReportGenerated={completeReportGenerated}
            page="current"
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard_v2;
