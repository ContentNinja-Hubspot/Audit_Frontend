import React from "react";

const PlanCard = ({ plan }) => {
  return (
    <div
      className={`border rounded-lg p-6 shadow-md flex-1 m-3 ${
        plan.highlight
          ? "border-purple-600 shadow-purple-200 scale-105"
          : "border-gray-300"
      }`}
      style={{
        background: plan.highlight ? "#f8f4ff" : "#fff",
        transition: "all 0.2s",
      }}
    >
      <div className="mb-2 flex items-center">
        <h2 className="text-2xl font-bold">{plan.name}</h2>
        {plan.highlight && plan.name == "Premium" && (
          <span className="ml-2 text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-semibold">
            Most Popular
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-purple-700 mb-3">
        {plan.price}
      </div>
      <div className="mb-3 text-gray-700">{plan.description}</div>
      <ul className="mb-4">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center mb-2">
            <span className="mr-2 text-purple-500 font-bold">✓</span> {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 px-4 rounded font-semibold ${
          plan.highlight
            ? "bg-purple-700 text-white hover:bg-purple-800"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

export default PlanCard;
