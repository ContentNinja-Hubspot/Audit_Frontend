import React, { useState, useEffect } from "react";
import PlanCard from "../components/PlanCard";
import Sidebar from "../components/SideBar";
import PastReportHeader from "../components/header/PastReportHeader";
import { useUser } from "../context/UserContext";
import { fetchPricingDetails, fetchUserPlan } from "../api";
import { useTheme } from "../context/ThemeContext";
import { HubSpotModal } from "../components/utils/HubSpotModal";

const PlanPage = () => {
  const { user, userType, token } = useUser();
  const { themeId } = useTheme();

  const [plans, setPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedPlan, setHighlightedPlan] = useState(
    user?.planName || "Free"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const descriptions = {
    client: {
      Free: "Basic tools to get started with limited usage.",
      Starter: "Perfect for small teams who want consistent insights.",
      Growth: "Grow faster with expanded limits and advanced tools.",
    },
    partner: {
      Free: "Great for testing tools before onboarding clients.",
      Starter: "Ideal for small agencies managing multiple accounts.",
      "Agency+": "Maximum capacity, flexibility, and branding options.",
    },
  };

  const transformPlan = (plan, billingCycle) => {
    const isFree = parseFloat(plan.price) === 0;
    const type = plan.plan_type;

    let price;
    if (billingCycle === "yearly") {
      if (isFree) {
        price = "Free";
      } else {
        const yearlyPrice = plan.price * 12 * 0.9;
        const monthlyEquivalent = Math.round(yearlyPrice / 12);
        price = `$${monthlyEquivalent}/mo`;
      }
    } else {
      price = isFree ? "Free" : `$${Math.round(plan.price)}/mo`;
    }

    const creditsLabel = isFree
      ? `${plan.monthly_credits} One-time Credits`
      : `${plan.monthly_credits} Credits / Month`;

    const features = [
      `${
        plan.max_hubs === 100000 ? "Unlimited" : `Up to ${plan.max_hubs}`
      } Hubs`,
      `Up to ${plan.max_audits} Audits/Month`,
      plan.access_to_cleanup_tools && "Access to Cleanup tools",
      plan.csv_pdf_download && (isFree ? "PDF Download" : "PDF & CSV Download"),
      plan.white_labeling &&
        (type === "partner" ? "Full white-labeling" : "Basic white-labeling"),
    ].filter(Boolean);

    return {
      name: plan.plan_name,
      price,
      creditsLabel,
      subheading:
        plan.plan_name === "Free"
          ? "Includes"
          : `Everything in ${
              plan.plan_name === "Starter" ? "Free" : "Starter"
            }, plus`,
      features,
      description: descriptions[type][plan.plan_name] || "",
    };
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const data = await fetchPricingDetails(token);

        if (data.success) {
          const tierOrder = ["Free", "Starter", "Growth", "Agency+"];
          const filtered = data.plans
            .filter((p) => p.plan_type === userType)
            .sort(
              (a, b) =>
                tierOrder.indexOf(a.plan_name) - tierOrder.indexOf(b.plan_name)
            );

          setPlans(filtered); // ⬅️ Store raw plans
        } else {
          setError("Failed to load plans.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const loadUserPlan = async () => {
      try {
        const data = await fetchUserPlan(token);
        const planName = data?.subscription?.plan_name;
        if (planName) {
          setUserPlan(planName);
          setHighlightedPlan(planName);
        }
      } catch (err) {
        console.error("Error fetching user plan", err);
      }
    };

    loadUserPlan();
    loadPlans();
  }, [userType, token]); // ✅ removed billingCycle

  const currentPlanIndex = plans.findIndex((p) => p.name === userPlan);
  const transformedPlans = plans.map((plan) =>
    transformPlan(plan, billingCycle)
  );

  const handleCardClick = (planName, index) => {
    if (index < currentPlanIndex) return;
    setHighlightedPlan(planName);
    if (planName !== userPlan) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        <PastReportHeader />
        <div className="flex flex-col items-center mt-24 px-4">
          <p className="mb-4 text-2xl font-medium max-w-xl mt-2 text-center">
            Pick the plan that fits your needs best
          </p>

          {/* Toggle for billing cycle */}
          <div
            className={`flex mb-8 items-center rounded-full bg-partner-tertiary-${themeId} w-min p-1 border-2 border-gray-600`}
          >
            <p
              onClick={() => setBillingCycle("monthly")}
              className={`w-32 h-10 rounded-full cursor-pointer font-medium text-sm flex items-center justify-center transition-colors duration-200 ${
                billingCycle === "monthly"
                  ? `bg-partner-secondary-${themeId} text-black`
                  : "bg-transparent text-black"
              }`}
            >
              MONTHLY
            </p>
            <p
              onClick={() => setBillingCycle("yearly")}
              className={`w-36 h-10 rounded-full cursor-pointer font-medium text-sm flex items-center justify-center transition-colors duration-200 whitespace-nowrap ${
                billingCycle === "yearly"
                  ? `bg-partner-secondary-${themeId} text-black`
                  : "bg-transparent text-black"
              }`}
            >
              YEARLY (SAVE 10%)
            </p>
          </div>

          {/* Plan Cards */}
          {loading ? (
            <p>Loading plans...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-center w-full max-w-5xl">
              {transformedPlans.map((plan, index) => {
                const isCurrent = plan.name === userPlan;
                const isLower = index < currentPlanIndex;

                return (
                  <div
                    key={plan.name}
                    className={`flex-1 ${
                      isLower ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <PlanCard
                      plan={{
                        ...plan,
                        highlight: highlightedPlan === plan.name,
                        disabled: isLower || isCurrent,
                        isCurrent: isCurrent,
                        buttonText: isCurrent
                          ? "Existing Plan"
                          : `Get ${plan.name}`,
                        onClick: () => handleCardClick(plan.name, index),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <HubSpotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PlanPage;
