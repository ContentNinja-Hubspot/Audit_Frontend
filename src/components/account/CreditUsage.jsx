import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const reportData = [
  { name: "Annual Financial Report", date: "2023-10-26", credits: 150 },
  { name: "Q3 Marketing Analysis", date: "2023-09-15", credits: 75 },
  { name: "Competitor Overview", date: "2023-08-01", credits: 220 },
  { name: "Sales Performance Q2", date: "2023-07-10", credits: 120 },
  { name: "User Engagement Metrics", date: "2023-06-22", credits: 90 },
  { name: "Product Feedback Summary", date: "2023-05-18", credits: 180 },
  { name: "Inventory Stock Levels", date: "2023-04-30", credits: 50 },
  { name: "Website Traffic Analysis", date: "2023-03-12", credits: 300 },
];

const CreditUsage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reportData.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 w-full max-w-5xl">
      <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
        {/* Search bar with icon inside */}
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 text-sm rounded-md"
          />
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-sm rounded-md">
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 bg-gray-200 uppercase border-b">
          <tr>
            <th className="px-4 py-2">Report Name</th>
            <th className="py-2">Date Generated</th>
            <th className="py-2">Credits Used</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-3 font-semibold">{report.name}</td>
              <td className="py-3">{report.date}</td>
              <td className="py-3">{report.credits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredReports.length} of {reportData.length} results
      </div>

      <div className="mt-2 flex justify-center space-x-2 text-sm">
        {[1, 2, 3, "...", 8, 9, 10].map((num, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md ${
              num === 1 ? "bg-indigo-600 text-white" : "bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreditUsage;
