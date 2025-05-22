import PartnerRegistration from "../components/PartnerRegistration";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";

export default function PartnerRegistrationPage() {
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
