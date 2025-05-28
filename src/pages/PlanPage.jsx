import React, { useState } from "react";
import PlanCard from "../components/PlanCard";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { useUser } from "../context/UserContext";

const clientPlans = [
  {
    name: "Free",
    price: "Free",
    features: ["10 one-time credits", "1 Hub", "Limited Actions"],
    description: "Basic tools to get started with limited usage.",
  },
  {
    name: "Starter",
    price: "$49/mo",
    features: [
      "50 Credits/Month",
      "Unlimited Hubs",
      "Unlimited Actions",
      "Up to 5 Audits/Month",
      "Access to Cleanup tools",
      "PDF Download",
    ],
    description: "Perfect for small teams who want consistent insights.",
  },
  {
    name: "Growth",
    price: "$129/mo",
    features: [
      "150 Credits/Month",
      "Unlimited Hubs",
      "Unlimited Actions",
      "Up to 15 Audits/Month",
      "Access to Cleanup tools",
      "PDF & CSV Download",
    ],
    description: "Grow faster with expanded limits and advanced tools.",
  },
];

const agencyPlans = [
  {
    name: "Free",
    price: "Free",
    features: ["25 one-time credits", "Up to 2 Hubs", "Basic white-labeling"],
    description: "Great for testing tools before onboarding clients.",
  },
  {
    name: "Starter",
    price: "$99/mo",
    features: [
      "100 Credits/Month",
      "Unlimited Hubs",
      "Full white-labeling",
      "Up to 10 Audits/Month",
      "Access to Cleanup tools",
      "PDF Download",
    ],
    description: "Ideal for small agencies managing multiple accounts.",
  },
  {
    name: "Agency+",
    price: "$249/mo",
    features: [
      "300 Credits/Month",
      "Unlimited Hubs",
      "Full white-labeling",
      "Up to 30 Audits/Month",
      "Access to Cleanup tools",
      "PDF & CSV Download",
    ],
    description: "Maximum capacity, flexibility, and branding options.",
  },
];

const PlanPage = () => {
  const { user } = useUser(); // { type: 'client' | 'agency', planName: 'Starter' }
  const isClient = user?.type === "client";
  const plans = isClient ? clientPlans : agencyPlans;

  const currentPlanIndex = plans.findIndex((p) => p.name === user?.planName);
  const [highlightedPlan, setHighlightedPlan] = useState(user?.planName);

  const handleCardClick = (planName, index) => {
    if (index < currentPlanIndex) return;
    setHighlightedPlan(planName);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <div className="flex flex-col items-center mt-8 px-4">
          <h1 className="text-4xl font-extrabold mb-2">Choose Your Plan</h1>
          <p className="mb-8 text-gray-600 max-w-xl text-center">
            Pick the plan that fits your needs best.
          </p>
          <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-5xl">
            {plans.map((plan, index) => {
              const isCurrent = plan.name === user?.planName;
              const isLower = index < currentPlanIndex;

              return (
                <div
                  key={plan.name}
                  onClick={() => handleCardClick(plan.name, index)}
                  className={`cursor-pointer flex-1 ${
                    isLower ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <PlanCard
                    plan={{
                      ...plan,
                      highlight: highlightedPlan === plan.name,
                      disabled: isLower || isCurrent,
                      buttonText: isCurrent
                        ? "Existing Plan"
                        : `Get ${plan.name}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanPage;
