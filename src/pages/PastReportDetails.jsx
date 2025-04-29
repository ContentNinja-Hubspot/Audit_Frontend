import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import MainContent from "../components/MainContent";
import { useUser } from "../context/UserContext";
import { fetchAuditDataByID, fetchGraphData } from "../api";
import { useNotify } from "../context/NotificationContext";

const PastReportDetail = () => {
  const CRYPTO_SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;
  const { reportID: encryptedId } = useParams();
  const [data, setData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useNotify();
  const { token } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedId = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decodedId, CRYPTO_SECRET_KEY);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        const [reportResponse, graphResponse] = await Promise.all([
          fetchAuditDataByID(token, decryptedId),
          fetchGraphData(token, decryptedId),
        ]);
        setData(reportResponse);
        setGraphData(graphResponse);
      } catch (e) {
        error("Error while fetching report or graph data");
        console.error("Failed to fetch audit or graph data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (token && encryptedId) {
      fetchData();
    }
  }, [token, encryptedId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <MainContent reportData={data} graphData={graphData} page="past" />
      </main>
    </div>
  );
};

export default PastReportDetail;
