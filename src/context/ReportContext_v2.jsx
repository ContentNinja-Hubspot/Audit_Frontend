import { createContext, useContext, useEffect, useState } from "react";

const ReportContext = createContext();

export const ReportProvider_v2 = ({ children }) => {
  const [auditReportData, setAuditReportData] = useState(null);
  const [auditGraphData, setAuditGraphData] = useState(null);
  const [salesReportData, setSalesReportData] = useState(null);
  const [salesGraphData, setSalesGraphData] = useState(null);
  const [reportScores, setReportScores] = useState(null);
  const [latestReportId, setLatestReportId] = useState(null);
  return (
    <ReportContext.Provider
      value={{
        auditReportData,
        auditGraphData,
        salesReportData,
        salesGraphData,
        reportScores,
        latestReportId,
        setAuditReportData,
        setAuditGraphData,
        setSalesReportData,
        setSalesGraphData,
        setReportScores,
        setLatestReportId,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
