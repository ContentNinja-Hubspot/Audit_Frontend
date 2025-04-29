import React, { useState } from "react";
import BarChart from "../utils/BarChart";
import RequestModal from "../utils/RequestModal";
import { findRiskImage, getBorderColor } from "../../utils";
import { Tooltip } from "../utils/Tooltip";
import ToggleSection from "../utils/ToggleSection";
import { CheckboxGroup, ActionButton } from "../utils/TakeAction";

const Company = ({
  token,
  scoreData,
  graphData,
  isGeneratingGraph,
  hubId,
  page,
}) => {
  const { missing_data, junk_data, total_companies } = scoreData;
  const [isMissingDataExpanded, setIsMissingDataExpanded] = useState(true);
  const [isDeletingDataExpanded, setIsDeletingDataExpanded] = useState(true);
  const [firstRowSelectedItem, setfirstRowSelectedItem] =
    useState("without_name");
  const [secondRowSelectedItem, setSecondRowSelectedItem] = useState(
    "without_associated_deals"
  );
  const [thirdRowSelectedItem, setThirdRowSelectedItem] = useState(
    "without_num_of_employees"
  );
  const [firstDatapoint, setFirstDatapoint] = useState("name");
  const [secondDataPoint, setSecondDataPoint] = useState(
    "num_associated_deals"
  );
  const [thirdDataPoint, setThirdDataPoint] = useState("numberofemployees");
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
      companies_without_name: false,
      companies_without_domain: false,
      companies_without_num_associated_con: false,
      companies_without_owner: false,
    },
    group2: {
      companies_without_associated_deals: false,
      companies_without_industry: false,
      companies_without_lifecycle_stage: false,
      companies_without_country_region: false,
    },
    group3: {
      companies_without_num_of_employee: false,
      companies_without_revenue: false,
      companies_without_linkedin_url: false,
      companies_without_phone_num: false,
    },
    group4: {
      companies_without_name_and_domain: false,
      companies_without_activity_180_days: false,
    },
    group5: {
      companies_without_name_and_domain: false,
      companies_with_no_activity_in_last_180_days: false,
    },
  });

  const handleCheckboxChange = (group, property, checked) => {
    setActiveListSelections((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [property]: checked,
      },
    }));
  };

  const handleCreateActiveList = (group) => {
    const selectedKeys = Object.entries(activeListSelections[group])
      .filter(([key, value]) => value)
      .map(([key]) => key);

    if (!selectedKeys.length) {
      alert("Please select at least one property.");
      return;
    }

    setRequestModalData({ selectedItems: selectedKeys, actionType: "create" });
    setIsRequestModalOpen(true);
  };

  const handleDeleteActiveList = (group) => {
    const selectedKeys = Object.entries(activeListSelections[group])
      .filter(([key, value]) => value)
      .map(([key]) => key);

    if (!selectedKeys.length) {
      alert("Please select at least one property.");
      return;
    }

    setRequestModalData({ selectedItems: selectedKeys, actionType: "delete" });
    setIsRequestModalOpen(true);
  };

  const toggleSection = (section) => {
    switch (section) {
      case "missingData":
        setIsMissingDataExpanded(!isMissingDataExpanded);
        break;
      case "deletingData":
        setIsDeletingDataExpanded(!isDeletingDataExpanded);
        break;
    }
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

  if (!scoreData) {
    return (
      <div className="report-details">
        <p>No data available for Companies.</p>
      </div>
    );
  }

  return (
    <div className="report-details">
      {/* Missing Data Section */}
      <section className="mb-[30px] bg-white rounded-md">
        <div className="flex justify-between items-center px-5 py-4">
          <h3 className="text-lg font-bold">Missing Data - Companies</h3>
          <ToggleSection
            isSectionExpanded={isMissingDataExpanded}
            setIsSectionExpanded={() => toggleSection("missingData")}
          />
        </div>
        {isMissingDataExpanded && (
          <>
            {/* First Block: Fix this first */}
            <div>
              <div className="flex mb-4 mx-10 font-semibold text-lg text-black">
                <p>Fix this first - fast!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {/* Repeatable card items */}
                {[
                  {
                    key: "without_name",
                    label: "Companies without Name",
                    info: "These company records do not have a name, making it difficult to identify them",
                    field: "name",
                  },
                  {
                    key: "without_domain",
                    label: "Companies without Domain",
                    info: "These companies do not have a domain associated, which limits online identification and outreach",
                    field: "domain",
                  },
                  {
                    key: "without_associated_contacts",
                    label: "Companies without Associated Contact",
                    info: "These companies do not have any associated contacts, which means no individuals are linked to them",
                    field: "num_associated_contacts",
                  },
                  {
                    key: "without_owner",
                    label: "Companies without an Owner",
                    info: "These companies do not have an assigned owner, meaning no specific user is responsible for managing them.",
                    field: "hubspot_owner_id",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`relative p-3 border rounded-lg cursor-pointer transition-transform duration-300  ${
                      firstRowSelectedItem === item.key
                        ? "bg-gradient-to-r from-[#e3ffff] to-[#e6e4ef]"
                        : "bg-white"
                    } ${getBorderColor(missing_data?.[item.key]?.risk)}`}
                    onClick={() => {
                      setfirstRowSelectedItem(item.key);
                      handleDataPointChange(1, item.field);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs lg:text-sm font-medium text-gray-600 pr-6 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
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
                      <p className="text:xl lg:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_companies.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 pb-8">
                <BarChart
                  graphData={graphData}
                  dataPoint={firstDatapoint}
                  missingData={missing_data}
                  inferenceKey={firstRowSelectedItem}
                />
              </div>
            </div>

            <div>
              <div className="flex my-4 mx-10 font-semibold text-lg text-black">
                <p>Must Fix</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_associated_deals",
                    label: "Companies without Deals (Opportunity/Customer)",
                    info: "These companies are not associated with any deals, indicating no recorded business opportunities linked to them.",
                    field: "num_associated_deals",
                  },
                  {
                    key: "without_industry",
                    label: "Companies without Industry",
                    info: "These companies do not have an industry classification, which is useful for segmentation and targeting.",
                    field: "industry",
                  },
                  {
                    key: "without_lifecycle_stage",
                    label: "Companies without Lifecycle Stage",
                    info: "These companies do not have a lifecycle stage assigned, which is used to track their journey in the business pipeline.",
                    field: "lifecyclestage",
                  },
                  {
                    key: "without_country_region",
                    label: "Companies without Country/Region",
                    info: "These companies do not have a country or region specified, which makes geographic-based analysis and segmentation difficult.",
                    field: "country",
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
                      <p className="text-xs lg:text-sm font-medium text-gray-600 pr-6 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
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
                      <p className="text:xl lg:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_companies.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 pb-8">
                <BarChart
                  graphData={graphData}
                  dataPoint={secondDataPoint}
                  missingData={missing_data}
                  inferenceKey={secondRowSelectedItem}
                />
              </div>
            </div>
            <div>
              <div className="flex my-4 mx-10 font-semibold text-lg text-black">
                <p>Good to Fix</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-10">
                {[
                  {
                    key: "without_num_of_employees",
                    label: "Companies without Number of Employees",
                    info: "These companies do not have the number of employees recorded, which can be a key indicator of company size.",
                    field: "numberofemployees",
                  },
                  {
                    key: "without_revenue",
                    label: "Companies without Revenue",
                    info: "These companies do not have revenue information recorded, which helps in understanding their financial scale.",
                    field: "annualrevenue",
                  },
                  {
                    key: "without_linkedin_url",
                    label: "Companies without LinkedIn Page URL",
                    info: "These companies do not have a LinkedIn page URL recorded, which can limit research and networking opportunities.",
                    field: "linkedin_company_page",
                  },
                  {
                    key: "without_phone_number",
                    label: "Companies without Phone No",
                    info: "These companies do not have a phone number recorded, which can restrict direct communication.",
                    field: "phone",
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
                      <p className="text-xs lg:text-sm font-medium text-gray-600 pr-6 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
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
                      <p className="text:xl lg:text-3xl font-bold text-gray-900">
                        {missing_data[item.key]?.percent}%
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {missing_data[item.key]?.count.toLocaleString()}{" "}
                        <span className="text-gray-400 text-xs lg:text-sm">
                          / {total_companies.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <img
                      className="absolute bottom-4 right-4 h-4"
                      src={findRiskImage(missing_data[item.key]?.risk)}
                      alt={missing_data[item.key]?.risk}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 pb-8">
                <BarChart
                  graphData={graphData}
                  dataPoint={thirdDataPoint}
                  missingData={missing_data}
                  inferenceKey={thirdRowSelectedItem}
                />
              </div>
            </div>
          </>
        )}
      </section>

      <section className="mb-[30px] bg-white rounded-md my-5">
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
                  label: "Companies have no activity in the last 180 days",
                  info: "These companies have not had any recorded interactions or updates in the past 180 days.",
                },
                {
                  key: "without_name_and_domain",
                  label: "Companies without name and domain",
                  info: "These companies are missing both a name and a domain, making it nearly impossible to identify them.",
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
                    <p className="text-xs lg:text-sm font-medium text-gray-600 pr-6 text-start min-h-8 lg:min-h-12 max-h-8  lg:max-h-12 max-w-60">
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
                    <p className="text:xl lg:text-3xl font-bold text-gray-900">
                      {junk_data[item.key]?.percent}%
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      {junk_data[item.key]?.count.toLocaleString()}{" "}
                      <span className="text-gray-400 text-xs lg:text-sm">
                        / {total_companies.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <img
                    className="absolute bottom-4 right-4 h-4"
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

      {/* Take Action Section */}
      <section
        className={`${
          page === "past" ? "blur-sm pointer-events-none relative" : ""
        }`}
      >
        {page === "past" && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-lg font-semibold text-gray-800 z-10">
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

          {/* Groups 1–3: Fix This, Must Fix, Good to Fix */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[95%] mx-auto">
              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Fix this first - fast!
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleCheckboxChange}
                  groupKey="group1"
                  options={[
                    {
                      label: "Companies without Name",
                      value: "companies_without_name",
                    },
                    {
                      label: "Companies without Domain",
                      value: "companies_without_domain",
                    },
                    {
                      label: "Companies without Associated Contact",
                      value: "companies_without_num_associated_con",
                    },
                    {
                      label: "Companies without an Owner",
                      value: "companies_without_owner",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group1")}
                  disabled={isGeneratingGraph}
                  label="Create Active List"
                />
              </div>

              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Must Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleCheckboxChange}
                  groupKey="group2"
                  options={[
                    {
                      label: "Companies without Deals",
                      value: "companies_without_associated_deals",
                    },
                    {
                      label: "Companies without Industry",
                      value: "companies_without_industry",
                    },
                    {
                      label: "Companies without Lifecycle Stage",
                      value: "companies_without_lifecycle_stage",
                    },
                    {
                      label: "Companies without Country/Region",
                      value: "companies_without_country_region",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group2")}
                  disabled={isGeneratingGraph}
                  label="Create Active List"
                />
              </div>

              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Good to Fix
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleCheckboxChange}
                  groupKey="group3"
                  options={[
                    {
                      label: "Companies without Number of Employees",
                      value: "companies_without_num_of_employee",
                    },
                    {
                      label: "Companies without Revenue",
                      value: "companies_without_revenue",
                    },
                    {
                      label: "Companies without LinkedIn Page URL",
                      value: "companies_without_linkedin_url",
                    },
                    {
                      label: "Companies without Phone No",
                      value: "companies_without_phone_num",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group3")}
                  disabled={isGeneratingGraph}
                  label="Create Active List"
                />
              </div>

              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Consider Deleting
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleCheckboxChange}
                  groupKey="group4"
                  options={[
                    {
                      label: "Companies without name and domain",
                      value: "companies_without_name_and_domain",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleCreateActiveList("group4")}
                  disabled={isGeneratingGraph}
                  label="Create Active List"
                />
              </div>

              <div className="flex flex-col gap-3 shadow p-4 rounded-lg h-[16rem] relative w-full">
                <h5 className="font-bold text-black text-base mb-1">
                  Delete Junk
                </h5>
                <CheckboxGroup
                  activeListSelections={activeListSelections}
                  handleCheckboxChange={handleCheckboxChange}
                  groupKey="group5"
                  options={[
                    {
                      label: "Company without activity in the last 180 days",
                      value: "companies_with_no_activity_in_last_180_days",
                    },
                    {
                      label: "Companies without name and domain",
                      value: "companies_without_name_and_domain",
                    },
                  ]}
                />
                <ActionButton
                  onClick={() => handleDeleteActiveList("group5")}
                  disabled={isGeneratingGraph}
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
        objectname="companies"
      />
    </div>
  );
};

export default Company;
