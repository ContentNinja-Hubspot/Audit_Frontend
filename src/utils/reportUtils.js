import {
  fetchAuditDataByID,
  fetchGraphData,
  fetchAllScores,
  fetchSalesReportData,
  fetchSalesGraphData,
  checkSalesReportStatus,
} from "../api";

export const fetchAuditReportData = async ({ token, reportId }) => {
  const [auditData, graph, scoreData] = await Promise.all([
    fetchAuditDataByID(token, reportId),
    fetchGraphData(token, reportId),
    fetchAllScores(token, reportId),
  ]);

  return { auditData, graph, scoreData };
};

export const fetchSalesReportDataBundle = async ({ token, reportId }) => {
  const [salesData, salesGraph] = await Promise.all([
    fetchSalesReportData(token, reportId),
    fetchSalesGraphData(token, reportId),
  ]);

  return {
    salesData,
    salesGraph: salesGraph?.data || null,
  };
};

export const checkIfSalesSeatExists = async ({ token, reportId }) => {
  const response = await checkSalesReportStatus(token, reportId);
  const noSalesSeat = response?.completed_objects?.includes("no_sales_seat");
  return { hasSalesSeat: !noSalesSeat, response };
};
