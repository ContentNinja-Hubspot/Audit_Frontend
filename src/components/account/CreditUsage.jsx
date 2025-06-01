import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { fetchCreditUsage } from "../../api";
import { useUser } from "../../context/UserContext";

const ITEMS_PER_PAGE = 10;

const CreditUsage = () => {
  const { token } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [creditData, setCreditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCreditUsage = async () => {
      try {
        setLoading(true);
        const data = await fetchCreditUsage(token);
        if (data && Array.isArray(data.credit_usage)) {
          setCreditData(data.credit_usage);
        } else {
          setCreditData([]);
        }
      } catch (err) {
        setError("Failed to fetch credit usage.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCreditUsage();
  }, [token]);

  const filteredReports = creditData.filter((report) =>
    report.action_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleExportCSV = () => {
    const csvHeader = "Transaction Type,Date Generated,Credits Used\n";
    const csvRows = creditData
      .map(
        (r) =>
          `"${r.action_type}","${new Date(
            r.action_timestamp
          ).toLocaleString()}","${r.credits_used}"`
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "credit-usage.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const POSITIVE_TRANSACTIONS = ["Plan Subscribed"];

  const isPositiveTransaction = (type) => POSITIVE_TRANSACTIONS.includes(type);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 w-full max-w-5xl">
      <div className="border-b border-gray-200 pb-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 text-sm rounded-md"
          />
        </div>

        <button onClick={handleExportCSV}>Export CSV</button>
      </div>

      {loading ? (
        <p>Loading credit usage...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 min-w-[500px]">
              <thead className="text-xs text-center text-gray-500 bg-gray-200 uppercase border-b">
                <tr>
                  <th className="py-2">Transaction Type</th>
                  <th className="py-2">Date Generated</th>
                  <th className="py-2">Credits Used</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report, index) => (
                  <tr key={index} className="border-b text-center">
                    <td className="px-4 py-3 font-semibold">
                      {report.action_type}
                    </td>
                    <td className="py-3">
                      {new Date(report.action_timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                          isPositiveTransaction(report.action_type)
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isPositiveTransaction(report.action_type) ? "+" : "-"}
                        {report.credits_used}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of{" "}
            {filteredReports.length} results
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md disabled:opacity-50 text-white"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded-md ${
                  num === currentPage
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md disabled:opacity-50 text-white"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreditUsage;
