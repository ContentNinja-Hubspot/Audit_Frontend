import React, { useRef } from "react";
import {
  checkSalesReportStatus,
  fetchAllScores,
  fetchSalesReportData,
  fetchSalesGraphData,
} from "../api";

export const useSalesReportPolling = ({
  token,
  hubID,
  setSalesInUse,
  setSalesReportData,
  setSalesGraphData,
  setReportScores,
  setSalesReportProgress,
  setCompleteReportGenerated,
}) => {
  const isPollingSales = useRef(false);

  const pollSalesReport = async (reportId) => {
    if (isPollingSales.current || !token || !hubID) return;
    isPollingSales.current = true;

    try {
      const salesStatus = await checkSalesReportStatus(token, reportId);

      if (salesStatus?.completed_objects?.includes("no_sales_seat")) {
        setSalesInUse(false);
        setSalesReportProgress(100);
        setSalesReportData({
          message:
            "We could not conduct a Sales Audit as you do not have a paid sales seat assigned to any rep.",
        });
        setSalesGraphData(null);
        setCompleteReportGenerated(true);
        return;
      }

      if (salesStatus?.progress < 100 && salesStatus?.status !== "Completed") {
        setSalesReportProgress(salesStatus?.progress || 0);
        setTimeout(() => pollSalesReport(reportId), 60000);
      } else if (
        salesStatus?.progress === 100 &&
        salesStatus?.status === "Completed"
      ) {
        const [salesData, salesGraph, allScores] = await Promise.all([
          fetchSalesReportData(token, reportId),
          fetchSalesGraphData(token, reportId),
          fetchAllScores(token, reportId),
        ]);

        setSalesReportData(salesData);
        setSalesGraphData(salesGraph?.data || null);
        setReportScores(allScores);
        setSalesReportProgress(100);
        setCompleteReportGenerated(true);
      }
    } catch (err) {
      console.error("Error polling sales report:", err);
    } finally {
      isPollingSales.current = false;
    }
  };

  return { pollSalesReport };
};
