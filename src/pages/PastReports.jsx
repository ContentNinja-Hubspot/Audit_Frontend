import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { fetchReportList } from "../api";
import { useUser } from "../context/UserContext";
import { useNotify } from "../context/NotificationContext";
import CryptoJS from "crypto-js";

const PastReports = () => {
  const CRYPTO_SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useNotify();

  const { token } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchReportList(token);
        setReports(response?.data);
      } catch (e) {
        error("Error while fetching past report data");
        console.error("Failed to fetch audit data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center">Past Reports</h2>
          <div className="mt-4 text-center flex justify-center items-center gap-4 text-gray-700">
            <p
              className={`underline text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </p>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <p
              className={`underline text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </p>
          </div>
          <div className="mt-4 overflow-x-auto w-full">
            <table className="w-full min-w-[600px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-sm sm:text-md p-2 border border-gray-300">
                    S. No.
                  </th>
                  <th className="text-sm sm:text-md p-2 border border-gray-300">
                    Hub Domain
                  </th>
                  <th className="text-sm sm:text-md p-2 border border-gray-300">
                    Create Date
                  </th>
                  <th className="text-sm sm:text-md p-2 border border-gray-300">
                    Score
                  </th>
                  <th className="text-sm sm:text-md p-2 border border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report, index) => (
                  <tr
                    key={indexOfFirstReport + index + 1}
                    className="bg-gray-100 text-start md:text-center"
                  >
                    <td className="text-sm md:text-md p-2 border border-gray-300">
                      {indexOfFirstReport + index + 1}
                    </td>
                    <td className="text-sm md:text-md p-2 border border-gray-300">
                      {report?.hub_domain}
                    </td>
                    <td className="text-sm md:text-md p-2 border border-gray-300">
                      {new Date(report.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td className="text-sm md:text-md p-2 border border-gray-300">
                      {Number(report?.overall_score.toFixed(1))}
                    </td>
                    <td className="text-sm md:text-md p-2 border border-gray-300">
                      <button
                        onClick={() => {
                          handlePastReportClick(
                            report.hub_domain,
                            report.report_id
                          );
                        }}
                        className="text-sm min-w-min md:text-md h-10 md:h-10 truncate"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PastReports;
