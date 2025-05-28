import React from "react";

const PlanCard = ({ plan }) => {
  const { highlight, disabled } = plan;

  return (
    <div
      className={`border rounded-lg p-6 shadow-md flex flex-col justify-between min-h-[460px] m-3 transition-all duration-200 ${
        highlight
          ? "border-purple-600 shadow-purple-200 scale-105 bg-[#f8f4ff]"
          : "border-gray-300 bg-white"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div>
        <div className="mb-2 flex items-center">
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          {highlight && plan.name === "Agency+" && (
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
              <span className="mr-2 text-purple-500 font-bold">✓</span>{" "}
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <button
        disabled={plan.disabled}
        className={`w-full py-2 px-4 rounded font-semibold ${
          plan.disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : plan.highlight
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
