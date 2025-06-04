import React, { useEffect, useState } from "react";
import { fetchUserPlan, fetchUserCredits } from "../../api";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const SubscriptionDetails = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const [planResponse, creditResponse] = await Promise.all([
          fetchUserPlan(token),
          fetchUserCredits(token),
        ]);

        if (planResponse.success && planResponse.subscription) {
          const sub = planResponse.subscription;

          const credits = creditResponse.success
            ? {
                remaining: creditResponse.credits_remaining,
                used: creditResponse.credits_used,
                total: creditResponse.total_credits,
              }
            : { remaining: 0, used: 0, total: 0 };

          setSubscriptionData({
            plan: sub.plan_name || "N/A",
            price: sub.plan_name === "Free" ? 0 : 29,
            credits,
            renewalDate: new Date(sub.end_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            supportEmail: "billing@example.com",
          });
        }
      } catch (error) {
        console.error("Failed to load subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [token]);

  if (loading) return <p>Loading subscription details...</p>;
  if (!subscriptionData) return <p>Unable to load subscription data.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 text-start">
        <div>
          <p className="font-medium">Current Plan</p>
          <p className="font-bold text-xl">{subscriptionData.plan}</p>
        </div>
        <div>
          <p className="font-medium">Price</p>
          <p className="font-bold text-xl">
            {subscriptionData.price === 0
              ? "Free"
              : `$${subscriptionData.price}/month`}
          </p>
        </div>
        <div>
          <p className="font-medium">Total Credits</p>
          <p className="font-bold text-xl">
            {subscriptionData.credits.total} Credits
          </p>
        </div>
        <div>
          <p className="font-medium">Renewal Date</p>
          <p className="font-bold text-xl">{subscriptionData.renewalDate}</p>
        </div>
      </div>

      <button
        className="mt-6 w-full"
        onClick={() => {
          navigate("/plans");
        }}
      >
        ↑ Upgrade Plan
      </button>

      {/* <p className="text-xs text-center text-gray-500 mt-4">
        For billing inquiries, please contact{" "}
        <a
          href={`mailto:${subscriptionData.supportEmail}`}
          className="text-indigo-500"
        >
          {subscriptionData.supportEmail}
        </a>
      </p> */}
    </div>
  );
};

export default SubscriptionDetails;
