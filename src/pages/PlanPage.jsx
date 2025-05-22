import React, { useState } from "react";
import PlanCard from "../components/PlanCard";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";

const initialPlans = [
  {
    name: "Standard",
    price: "$49/mo",
    features: [
      "Core analytics & reporting",
      "Email support",
      "Basic user management",
      "Integrate with HubSpot",
    ],
    buttonText: "Get Standard",
    highlight: false,
    description:
      "All the essentials to get your team tracking and reporting like pros—without breaking the bank.",
  },
  {
    name: "Premium",
    price: "$99/mo",
    features: [
      "Everything in Standard",
      "Priority support",
      "Custom integrations",
      "Advanced reporting & automations",
    ],
    buttonText: "Upgrade to Premium",
    highlight: true,
    description:
      "Serious about growth? Go Premium for advanced insights, integrations, and our A-team on speed dial.",
  },
];

const PlanPage = () => {
  const [plans, setPlans] = useState(initialPlans);

  const handleCardClick = (name) => {
    const updatedPlans = plans.map((plan) => ({
      ...plan,
      highlight: plan.name === name, // Only the clicked one gets highlight
    }));
    setPlans(updatedPlans);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <div className="flex items-center justify-center mt-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Choose Your Plan</h1>
            <p className="mb-8 text-gray-600 max-w-xl text-center">
              Pick the plan that fits your needs best.
            </p>
            <div className="flex flex-col md:flex-row justify-center w-full max-w-3xl">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => handleCardClick(plan.name)}
                  className="cursor-pointer"
                >
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanPage;
