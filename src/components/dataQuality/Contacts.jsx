import React, { useState } from "react";
import BarChart from "../utils/BarChart";
import RequestModal from "../utils/RequestModal";
import { findRiskImage, getBorderColor } from "../../utils";
import { Tooltip } from "../utils/Tooltip";
import ToggleSection from "../utils/ToggleSection";
import { CheckboxGroup, ActionButton } from "../utils/TakeAction";

const Contact = ({
  token,
  scoreData,
  graphData,
  hubId,
  page,
  completeReportGenerated,
}) => {
  const {
    missing_data,
    junk_data,
    total_contacts,
    total_contact_oppurtunity_customer,
  } = scoreData;

  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [isDeletingDataExpanded, setIsDeletingDataExpanded] = useState(true);
  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("without_first_name");
  const [secondRowSelectedItem, setSecondRowSelectedItem] =
    useState("without_deals");
  const [thirdRowSelectedItem, setThirdRowSelectedItem] =
    useState("without_job_title");
  const [firstDatapoint, setFirstDatapoint] = useState("firstname");
  const [secondDataPoint, setSecondDataPoint] = useState(
    "num_associated_deals"
  );
  const [thirdDataPoint, setThirdDataPoint] = useState("jobtitle");
  const [lastDataPoint, setLastDataPoint] = useState(
    "no_activity_in_last_180_days"
  );

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestModalData, setRequestModalData] = useState({
    selectedItems: [],
    actionType: "",
  });

  const [activeListSelections, setActiveListSelections] = useState({
    group1: {
      no_firstname: false,
      no_email: false,
      no_associated_company: false,
      no_owner: false,
    },
    group2: {
      no_associated_deals: false,
      no_lead_source: false,
      no_lifecycle_stage: false,
      no_lead_status: false,
    },
    group3: {
      no_jobtitle: false,
      no_market_status: false,
      no_hubspotscore: false,
      no_phone: false,
    },
    group5: {
      contacts_with_no_activity_in_last_180_days: false,
      internal_team_members: false,
    },
  });

  const handleContactCheckboxChange = (group, key, checked) => {
    setActiveListSelections((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: checked,
      },
    }));
  };

  const handleDataPointChange = (count, dataPoint) => {
    switch (count) {
      case 1:
        setFirstDatapoint(dataPoint);
        break;
      case 2:
        setSecondDataPoint(dataPoint);
        break;
      case 3:
        setThirdDataPoint(dataPoint);
        break;
      default:
        break;
    }
  };

  const handleRequestModalOpen = (selectedItems, actionType) => {
    setRequestModalData({ selectedItems, actionType });
    setIsRequestModalOpen(true);
  };

  const toggleSection = (section) => {
    if (section === "missingData")
      setIsMissingDataExpanded(!isMissingDataExpanded);
    if (section === "deletingData")
      setIsDeletingDataExpanded(!isDeletingDataExpanded);
  };

  if (!scoreData)
    return <div className="p-4">No data available for Contacts.</div>;

  return (
    <div className="text-gray-700  rounded-lg  border-gray-300">
      {/* Missing Data Section */}
      <section className="bg-white rounded-md mb-6">
        <div className="flex justify-between items-center px-5 py-4">
          <h3 className="text-lg font-bold">Missing Data - Contacts</h3>
          <ToggleSection
            isSectionExpanded={isMissingDataExpanded}
            setIsSectionExpanded={() => toggleSection("missingData")}
          />
        </div>
        {isMissingDataExpanded && (
          <div>
            {/* Fix This First */}
            <div>
              <div className="flex mb-4 mx-10 font-semibold text-lg text-black">
                <p>Fix this first - fast!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_first_name",
                    label: "Contacts without First Name",
                    dataPoint: "firstname",
                    info: "These contacts do not have a first name recorded, which is typically used to personalize communication",
                  },
                  {
                    key: "without_email",
                    label: "Contacts without Email ID",
                    dataPoint: "email",
                    info: "These contacts do not have an email address recorded, which is commonly used for outreach and engagement",
                  },
                  {
                    key: "without_associated_company",
                    label: "Contacts without Associated Company",
                    dataPoint: "associatedcompanyid",
                    info: "These contacts are not linked to any company, meaning there is no business entity associated with them",
                  },
                  {
                    key: "without_owner",
                    label: "Contacts without Owners",
                    dataPoint: "hubspot_owner_id",
                    info: "These contacts do not have an assigned owner, meaning no specific user is responsible for managing them",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      firstRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                        : "bg-white"
                    } ${getBorderColor(missing_data[item.key]?.risk)}`}
                    onClick={() => {
                      setfirstRowSelectedItem(item.key);
                      handleDataPointChange(1, item.dataPoint);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                        {item.label}
                      </p>
                      <Tooltip tooltipText={item.info}>
                        <img
                          className="h-4 min-w-4"
                          src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                          alt="Info"
                        />
                      </Tooltip>
                    </div>

                    <div className="flex flex-col items-start gap-2 justify-start mt-2">
                      <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_contacts.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-3 xl:h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pb-8">
                <BarChart
                  dataPoint={firstDatapoint}
                  graphData={graphData}
                  missingData={missing_data}
                  inferenceKey={firstRowSelectedItem}
                />
              </div>
            </div>

            {/* Must Fix */}
            <div>
              <div className="flex my-4 mx-10 font-semibold text-lg text-black">
                <p>Must Fix</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_deals",
                    label: "Contacts without Deals (Opportunity/Customer)",
                    dataPoint: "num_associated_deals",
                    info: "These contacts are not associated with any deals, indicating no recorded business opportunities linked to them",
                  },
                  {
                    key: "without_lastname",
                    label: "Contacts without Last Name",
                    dataPoint: "lastname",
                    info: "These contacts do not have a last name recorded, which is often used for proper identification",
                  },
                  {
                    key: "without_lifecycle_stage",
                    label: "Contacts without Lifecycle Stage",
                    dataPoint: "lifecyclestage",
                    info: "These contacts do not have a lifecycle stage assigned, which is used to track their journey in the sales funnel",
                  },
                  {
                    key: "without_lead_status",
                    label: "Contacts without Lead status",
                    dataPoint: "hs_lead_status",
                    info: "These contacts do not have a lead status assigned, which is typically used to indicate their engagement level",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      secondRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                        : "bg-white"
                    } ${getBorderColor(missing_data[item.key]?.risk)}`}
                    onClick={() => {
                      setSecondRowSelectedItem(item.key);
                      handleDataPointChange(2, item.dataPoint);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                        {item.label}
                      </p>
                      <Tooltip tooltipText={item.info}>
                        <img
                          className="h-4 min-w-4"
                          src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                          alt="Info"
                        />
                      </Tooltip>
                    </div>

                    <div className="flex flex-col items-start gap-2 justify-start mt-2">
                      <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          /{" "}
                          {item.key === "without_deals"
                            ? (
                                total_contact_oppurtunity_customer ?? 0
                              ).toLocaleString()
                            : (total_contacts ?? 0).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-3 xl:h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pb-8">
                <BarChart
                  dataPoint={secondDataPoint}
                  graphData={graphData}
                  missingData={missing_data}
                  inferenceKey={secondRowSelectedItem}
                />
              </div>
            </div>

            {/* Good to Fix */}
            <div>
              <div className="flex my-4 mx-10 font-semibold text-lg text-black">
                <p>Good to Fix</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_job_title",
                    label: "Contacts without Job Title",
                    dataPoint: "jobtitle",
                    info: "These contacts do not have a job title recorded, which is often used to understand their role within a company",
                  },
                  {
                    key: "without_marketing_contact_status",
                    label: "Contacts without Marketing Status",
                    dataPoint: "hs_marketable_status",
                    info: "These contacts do not have a marketing contact status assigned, which is used to determine if they are eligible for marketing campaigns",
                  },
                  {
                    key: "without_hubspotscore",
                    label: "Contacts without Lead Score",
                    dataPoint: "hubspotscore",
                    info: "These contacts do not have a lead score recorded, which is commonly used to prioritize leads based on engagement and fit",
                  },
                  {
                    key: "without_phone",
                    label: "Contacts without Phone No",
                    dataPoint: "phone",
                    info: "These contacts do not have a phone number recorded, which is typically used for direct communication",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg shadow cursor-pointer transition-transform duration-300 ${
                      thirdRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                        : "bg-white"
                    } ${getBorderColor(missing_data[item.key]?.risk)}`}
                    onClick={() => {
                      setThirdRowSelectedItem(item.key);
                      handleDataPointChange(3, item.dataPoint);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                        {item.label}
                      </p>
                      <Tooltip tooltipText={item.info}>
                        <img
                          className="h-4 min-w-4"
                          src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                          alt="Info"
                        />
                      </Tooltip>
                    </div>

                    <div className="flex flex-col items-start gap-2 justify-start mt-2">
                      <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_contacts.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-3 xl:h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pb-8">
                <BarChart
                  dataPoint={thirdDataPoint}
                  graphData={graphData}
                  missingData={missing_data}
                  inferenceKey={thirdRowSelectedItem}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Consider Deleting Section */}
      <section className="bg-white rounded-md mb-6">
        <div className="flex justify-between items-center px-6 py-4">
          <h3 className="text-xl font-bold">Consider Deleting</h3>
          <ToggleSection
            isSectionExpanded={isDeletingDataExpanded}
            setIsSectionExpanded={() => toggleSection("deletingData")}
          />
        </div>
        {isDeletingDataExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-10">
              {[
                {
                  key: "no_activity_in_last_180_days",
                  label: "Contacts Without Activity in Last 180 Days",
                  dataPoint: "no_activity_in_last_180_days",
                  info: "These contacts have not had any recorded interactions or updates in the past 180 days",
                },
                {
                  key: "internal_team_members",
                  label: "Internal Team Members",
                  dataPoint: "internal_team_members",

                  info: "These contacts are recognized as internal team members, meaning they are not external leads or customers",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`relative p-3 border rounded-lg cursor-pointer transition-transform duration-300 ${
                    lastDataPoint === item.key
                      ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                      : "bg-white"
                  } ${getBorderColor(junk_data[item.key]?.risk)}`}
                  onClick={() => {
                    setLastDataPoint(item.key);
                    handleDataPointChange(4, item.dataPoint);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs xl:text-sm font-medium text-gray-600 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
                      {item.label}
                    </p>
                    <Tooltip tooltipText={item.info}>
                      <img
                        className="h-4 min-w-4"
                        src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/info.png"
                        alt="Info"
                      />
                    </Tooltip>
                  </div>

                  <div className="flex flex-col items-start gap-2 justify-start mt-2">
                    <p className="text:xl md:text-2xl xl:text-3xl font-bold text-gray-900">
                      {junk_data[item.key]?.percent}%
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {junk_data[item.key]?.count.toLocaleString()}{" "}
                      <span className="text-gray-400 text-xs lg:text-sm">
                        / {total_contacts.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <img
                    className="absolute bottom-4 right-4 h-3 xl:h-4"
                    src={findRiskImage(junk_data[item.key]?.risk)}
                    alt={junk_data[item.key]?.risk}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 pb-8">
              <BarChart
                graphData={graphData}
                dataPoint={lastDataPoint}
                missingData={junk_data}
                inferenceKey={lastDataPoint}
              />
            </div>
          </>
        )}
      </section>

      {/* Take Bulk Action */}
      <section
        className={`${
          page === "past"
            ? "backdrop-blur-3xl pointer-events-none relative"
            : ""
        }`}
      >
        {page === "past" && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-2xl font-semibold text-gray-800 z-10">
            Can't take action in past report
          </div>
        )}

        <div
          className="bg-white rounded-md my-5 px-6 py-5 max-w-full"
          id="take_action"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-black font-semibold text-lg mb-2">
              Take Bulk Action
            </h4>
            <button
              onClick={() =>
                document
                  .getElementById("overall_audit_section")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Move to Top ↑
            </button>
          </div>

          {/* Fix this / Must Fix / Good to Fix */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[95%] mx-auto">
              {/* Fix this first */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Fix this first - fast!
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleContactCheckboxChange}
                  groupKey="group1"
                  options={[
                    {
                      label: "Contacts without First Name",
                      value: "no_firstname",
                    },
                    { label: "Contacts without Email", value: "no_email" },
                    { label: "Contacts without Owner", value: "no_owner" },
                    // {
                    //   label: "Contacts without Associated Company",
                    //   value: "no_associated_company",
                    // },
                  ]}
                />
                <ActionButton
                  onClick={() =>
                    handleRequestModalOpen(
                      Object.keys(activeListSelections.group1).filter(
                        (k) => activeListSelections.group1[k]
                      ),
                      "create"
                    )
                  }
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Must Fix */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Must Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleContactCheckboxChange}
                  groupKey="group2"
                  options={[
                    {
                      label: "Contacts without Deals",
                      value: "no_associated_deals",
                    },
                    {
                      label: "Contacts without Lifecycle Stage",
                      value: "no_lifecycle_stage",
                    },
                    {
                      label: "Contacts without Lead Status",
                      value: "no_lead_status",
                    },
                    {
                      label: "Contacts without Lead Source",
                      value: "no_lead_source",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() =>
                    handleRequestModalOpen(
                      Object.keys(activeListSelections.group2).filter(
                        (k) => activeListSelections.group2[k]
                      ),
                      "create"
                    )
                  }
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Good to Fix */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Good to Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleContactCheckboxChange}
                  groupKey="group3"
                  options={[
                    {
                      label: "Contacts without Job Title",
                      value: "no_jobtitle",
                    },
                    {
                      label: "Contacts without Marketing Status",
                      value: "no_market_status",
                    },
                    {
                      label: "Contacts without Lead Score",
                      value: "no_hubspotscore",
                    },
                    {
                      label: "Contacts without Phone Number",
                      value: "no_phone",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() =>
                    handleRequestModalOpen(
                      Object.keys(activeListSelections.group3).filter(
                        (k) => activeListSelections.group3[k]
                      ),
                      "create"
                    )
                  }
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Consider Deleting
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleContactCheckboxChange}
                  groupKey="group5"
                  options={[
                    {
                      label: "Internal Team Members",
                      value: "internal_team_members",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() =>
                    handleRequestModalOpen(
                      ["internal_team_members"].filter(
                        (k) => activeListSelections.group5[k]
                      ),
                      "create"
                    )
                  }
                  disabled={!completeReportGenerated}
                  label="Create Active List"
                />
              </div>

              {/* Delete Junk */}
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Delete Junk
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleContactCheckboxChange}
                  groupKey="group5"
                  options={[
                    {
                      label: "Contacts without activity in last 180 days",
                      value: "contacts_with_no_activity_in_last_180_days",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() =>
                    handleRequestModalOpen(
                      ["contacts_with_no_activity_in_last_180_days"].filter(
                        (k) => activeListSelections.group5[k]
                      ),
                      "delete"
                    )
                  }
                  disabled={!completeReportGenerated}
                  label="Delete Junk"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        selectedItems={requestModalData.selectedItems}
        actionType={requestModalData.actionType}
        token={token}
        hubId={hubId}
        objectname="contacts"
      />
    </div>
  );
};

export default Contact;
