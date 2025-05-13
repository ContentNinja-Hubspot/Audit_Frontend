import React, { useEffect, useState } from "react";

const AdminPortal = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Replace with your actual fetch logic
    const fetchReports = async () => {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReports(data);
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">All Reports</h1>
      <ul className="space-y-2">
        {reports.map((report) => (
          <li key={report.id} className="border p-3">
            <p>
              <strong>ID:</strong> {report.id}
            </p>
            <p>
              <strong>Title:</strong> {report.title}
            </p>
            {/* Add more fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPortal;
