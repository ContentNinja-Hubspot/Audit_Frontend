import React from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const SubscriptionDetails = () => {
  // Simulated API response
  const subscriptionData = {
    plan: "Starter",
    price: 29,
    credits: 1000,
    renewalDate: "July 20, 2024",
    paymentMethod: {
      type: "Visa",
      maskedNumber: "**** **** **** 1234",
    },
    supportEmail: "billing@example.com",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 text-start">
        <div>
          <p className="font-medium">Current Plan</p>
          <p className="font-bold text-xl">{subscriptionData.plan}</p>
        </div>
        <div>
          <p className="font-medium">Price</p>
          <p className="font-bold text-xl">${subscriptionData.price}/month</p>
        </div>
        <div>
          <p className="font-medium">Credits Included</p>
          <p className="font-bold text-xl">
            {subscriptionData.credits} Credits
          </p>
        </div>
        <div>
          <p className="font-medium">Renewal Date</p>
          <p className="font-bold text-xl">{subscriptionData.renewalDate}</p>
        </div>
        <div className="col-span-2">
          <p className="font-medium">Payment Method</p>
          <p className="flex items-center space-x-2">
            <CreditCardIcon className="h-4 w-4" />
            <span className="font-semibold text-md">
              {subscriptionData.paymentMethod.type}{" "}
              {subscriptionData.paymentMethod.maskedNumber}
            </span>
          </p>
        </div>
      </div>

      <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-center">
        ↑ Upgrade Plan
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        For billing inquiries, please contact{" "}
        <a href={`mailto:billing@example.com`} className="text-indigo-500">
          billing@example.com
        </a>
      </p>
    </div>
  );
};

export default SubscriptionDetails;
