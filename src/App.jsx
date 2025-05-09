import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ReportProvider } from "./context/ReportContext";
import { NotificationProvider } from "./context/NotificationContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PastReports from "./pages/PastReports";
import NotFound from "./pages/NotFound";
import PastReportDetail from "./pages/PastReportDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./components/AdminRoute";
import AdminPortal from "./pages/AdminPortal";
import { ErrorBoundary } from "react-error-boundary";
import FallbackErrorPage from "./components/FallbackErrorPage";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromParams = params.get("state");

    if (tokenFromParams) {
      Cookies.set("state", tokenFromParams, {
        path: "/",
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
        expires: 1,
      });
    }
  }, []);

  return (
    <NotificationProvider>
      <UserProvider>
        <ReportProvider>
          <ErrorBoundary FallbackComponent={FallbackErrorPage}>
            <Router>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                toastClassName="bg-white border border-purple-400 text-sm text-gray-800 shadow-lg"
                bodyClassName="p-3"
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
              />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/past-reports" element={<PastReports />} />
                  <Route
                    path="/past-reports/:reportID"
                    element={<PastReportDetail />}
                  />
                </Route>

                <Route element={<AdminRoute />}>
                  <Route path="/admin-portal" element={<AdminPortal />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </ReportProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;
