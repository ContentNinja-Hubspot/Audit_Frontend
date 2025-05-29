import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { fetchReportList, shareReport, fetchSharedReports } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";
import CryptoJS from "crypto-js";
import PastReportHeader from "../components/header/PastReportHeader";
import ShareReportModal from "../components/ShareReportModal";
import { ClockIcon, ShareIcon } from "@heroicons/react/24/outline";

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

  const handleShareReport = async (email) => {
    if (!email || !selectedReport) return;

    try {
      const response = await shareReport(
        token,
        selectedReport.report_id,
        email
      );

      return response;
    } catch (e) {
      console.error("Share report error:", e);
      return {
        status: "error",
        message: "Something went wrong while sharing the report.",
      };
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
            {/* Toggle Tabs */}
            <div className="flex justify-start mt-2 w-full items-center gap-6 border-b border-gray-200 mb-6">
              <div
                onClick={() => setActiveTab("past")}
                className={`pb-2 text-sm font-medium cursor-pointer flex gap-1 items-center border-b-2 transition ${
                  activeTab === "past"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                <ClockIcon className="h-4 w-4" />
                Past Reports
              </div>
              <div
                onClick={() => setActiveTab("shared")}
                className={`pb-2 text-sm font-medium cursor-pointer border-b-2 flex gap-1 items-center transition ${
                  activeTab === "shared"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-black"
                }`}
              >
                <ShareIcon className="h-4 w-4" />
                Shared With Me
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-md overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-500">
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
        {/* Pagination */}
        {activeTab === "past" && totalPages > 0 && (
          <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-700">
            <p
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
              className={`underline ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Previous
            </p>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <p
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
              className={`underline ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Next
            </p>
          </div>
        )}
      </main>
      {/* Share Modal */}
      <ShareReportModal
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedReport(null);
        }}
        onShare={handleShareReport}
      />
    </div>
  );
};

export default PastReports;
