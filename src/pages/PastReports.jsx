import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { fetchReportList, shareReport, fetchSharedReports } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";
import CryptoJS from "crypto-js";
import PastReportHeader from "../components/header/PastReportHeader";
import ShareReportModal from "../components/ShareReportModal";

const PastReports = () => {
  const CRYPTO_SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error, success } = useNotify();
  const { token } = useUser();

  const [activeTab, setActiveTab] = useState("past");
  const [sharedReports, setSharedReports] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReportList(token);
        setReports(response?.data || []);
      } catch (e) {
        error("Error while fetching past report data");
        console.error("Failed to fetch audit data:", e);
      } finally {
        setLoading(false);
      }
    };

    const fetchShared = async () => {
      try {
        const response = await fetchSharedReports(token);
        if (response.success) {
          setSharedReports(response.data || []);
        } else {
          error(response.message || "Failed to fetch shared reports");
        }
      } catch (e) {
        error("Error while fetching shared reports");
        console.error(e);
      }
    };

    fetchData();
    fetchShared();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handlePastReportClick = (hub_domain, reportId) => {
    const encryptedId = CryptoJS.AES.encrypt(
      reportId.toString(),
      CRYPTO_SECRET_KEY
    ).toString();
    const encodedId = encodeURIComponent(encryptedId);
    navigate(`/past-reports/${encodedId}?hub_domain=${hub_domain}`);
  };

  const getSafeScore = (score) => {
    return score && !isNaN(score) ? Number(score.toFixed(1)) : "N/A";
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
  };

  const handleShareReport = async () => {
    if (!shareEmail || !selectedReport) return;

    try {
      const response = await shareReport(
        token,
        selectedReport.report_id,
        shareEmail
      );

      if (response.status === "success") {
        success("Report shared successfully.");
      } else {
        error(response.message || "Failed to share report.");
      }
    } catch (e) {
      console.error("Share report error:", e);
      error("Something went wrong while sharing the report.");
    } finally {
      setShowShareModal(false);
      setShareEmail("");
      setSelectedReport(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <PastReportHeader />
      <main className="flex-1 overflow-auto h-screen">
        <div className="p-6 mt-20">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            {/* Toggle Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "past"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                Past Reports
              </button>
              <button
                onClick={() => setActiveTab("shared")}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === "shared"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                Shared With Me
              </button>
            </div>

            {/* Pagination */}
            <div className="flex items-center text-sm text-gray-700">
              <p
                className={`underline mr-4 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={goToPreviousPage}
              >
                Previous
              </p>
              <span className="mr-4">
                Page {currentPage} of {totalPages}
              </span>
              <p
                className={`underline ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={goToNextPage}
              >
                Next
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-md overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-center px-4 py-3 text-sm">S. No.</th>
                  <th className="text-center px-4 py-3 text-sm">Hub Domain</th>
                  <th className="text-center px-4 py-3 text-sm">Create Date</th>
                  <th className="text-center px-4 py-3 text-sm">Score</th>
                  <th className="text-center px-4 py-3 text-sm">Action</th>
                  {activeTab === "past" && (
                    <th className="text-center px-4 py-3 text-sm">Share</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(activeTab === "past" ? currentReports : sharedReports).map(
                  (report, index) => (
                    <tr key={index} className="bg-gray-50 border-t">
                      <td className="px-4 py-3 text-sm">
                        {indexOfFirstReport + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {report?.hub_domain || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(report?.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getSafeScore(report?.overall_score)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() =>
                            handlePastReportClick(
                              report.hub_domain,
                              report.report_id
                            )
                          }
                          className="bg-black text-white px-3 py-2 rounded-md text-sm"
                        >
                          View Report
                        </button>
                      </td>
                      {activeTab === "past" && (
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowShareModal(true);
                            }}
                            className="bg-black text-white px-3 py-2 rounded-md text-sm"
                          >
                            Share Report
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {/* Share Modal */}
      <ShareReportModal
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareEmail("");
          setSelectedReport(null);
        }}
        onShare={handleShareReport}
        email={shareEmail}
        setEmail={setShareEmail}
      />
    </div>
  );
};

export default PastReports;
