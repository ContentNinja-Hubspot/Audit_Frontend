import React from "react";
import Contact from "./dataQuality/Contacts";
import Company from "./dataQuality/Companies";
import Deal from "./dataQuality/Deals";
import Ticket from "./dataQuality/Tickets";

const MissingData = ({
  selectedItem,
  dataAudit,
  graphData,
  token,
  hubId,
  page,
  completeReportGenerated,
}) => {
  if (!dataAudit) return null;

  const renderComponent = () => {
    switch (selectedItem) {
      case "Contacts":
        return (
          <Contact
            scoreData={dataAudit?.contacts}
            graphData={graphData?.data?.contacts}
            page={page}
            hubId={hubId}
            token={token}
            completeReportGenerated={completeReportGenerated}
          />
        );
      case "Companies":
        return (
          <Company
            scoreData={dataAudit?.companies}
            graphData={graphData?.data?.companies}
            page={page}
            hubId={hubId}
            token={token}
            completeReportGenerated={completeReportGenerated}
          />
        );
      case "Deals":
        return (
          <Deal
            scoreData={dataAudit?.deals}
            graphData={graphData?.data?.deals}
            page={page}
            hubId={hubId}
            token={token}
            completeReportGenerated={completeReportGenerated}
          />
        );
      case "Tickets":
        return (
          <Ticket
            scoreData={dataAudit?.tickets}
            graphData={graphData?.data?.tickets}
            page={page}
            hubId={hubId}
            token={token}
            completeReportGenerated={completeReportGenerated}
          />
        );
      default:
        return (
          <Contact
            scoreData={dataAudit?.contacts}
            graphData={graphData?.data?.contacts}
            page={page}
            hubId={hubId}
            token={token}
            completeReportGenerated={completeReportGenerated}
          />
        );
    }
  };

  return <div>{renderComponent()}</div>;
};

export default MissingData;
