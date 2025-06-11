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

  //   console.log("User in Dashboard_v2:", user);

  const [selectedHubId, setSelectedHubId] = useState(null);
  const [reportId, setReportId] = useState(null);

  /******************************* Initializing Report Custom Hooks ********************************/
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

  /******************************* Check Report Generation Status *****************************/
  const handleCheckReportGeneration = async () => {
    const result = await checkReportGeneration(token);
    console.log("Check Report Generation Result:", result);
    if (result) {
      return result?.generate_report;
    }
    return false;
  };

  /******************************* Setting Selected Hub ***************************************/
  const handleSettingSelectedHub = (user) => {
    const selectedHubId = user?.hub_details?.data?.hub_id || null;

    const matchedHub = user?.unique_hub_ids?.find(
      (hub) => hub.hub_id === selectedHubId
    );

    const latestReportId = matchedHub?.latest_report_id || null;

    setSelectedHubId(selectedHubId);
    setLatestReportId(latestReportId);
  };

  /******************************* useEffect for Initial Setup *********************************/
  useEffect(() => {
    const init = async () => {
      handleSettingSelectedHub(user);
      const resultCheckReportGeneration = await handleCheckReportGeneration();

      if (!loading && resultCheckReportGeneration === true && selectedHubId) {
        // await triggerReportGeneration(token, hubId);
        setTimeout(() => {
          pollAuditReport();
        }, 30000);
      } else if (!loading && resultCheckReportGeneration === false) {
        setAuditReportGenerated(true);
      }

      setLoading(false);
    };

    init();
  }, [token, loading]);

  useEffect(() => {
    if (auditReportGenerated && reportId) {
      pollSalesReport(reportId);
    }
  }, [auditReportGenerated]);

  /******************************* Rendering Loading Content *******************************/

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

  /******************************* Rendering Main Content ************************************/

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
