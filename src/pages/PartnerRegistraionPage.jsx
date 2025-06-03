import PartnerRegistration from "../components/profile/PartnerRegistration";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { useUser } from "../context/UserContext";
import { Navigate } from "react-router-dom";

export default function PartnerRegistrationPage() {
  const { userType } = useUser();
  if (userType !== "partner") {
    return <Navigate to="/not-found" replace />;
  }
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <PartnerRegistration />
      </main>
    </div>
  );
}
