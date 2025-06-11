import { createContext, useContext, useEffect, useState } from "react";

const ReportContext = createContext();

export const ReportProgressProvider_v2 = ({ children }) => {
  const [auditReportProgress, setAuditReportProgress] = useState(0);
  const [salesReportProgress, setSalesReportProgress] = useState(0);
  const [salesInUse, setSalesInUse] = useState(true);
  const [auditReportGenerated, setAuditReportGenerated] = useState(false);
  const [completeReportGenerated, setCompleteReportGenerated] = useState(false);

  return (
    <ReportContext.Provider
      value={{
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
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportProgress = () => useContext(ReportContext);
