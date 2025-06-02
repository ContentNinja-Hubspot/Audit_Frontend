import React from "react";
import { useTheme } from "../context/ThemeContext";

const PlanCard = ({ plan }) => {
  const { highlight, disabled } = plan;
  const { themeId } = useTheme();

  return (
    <div
      className={`relative border rounded-lg p-6 shadow-md flex flex-col justify-between min-h-[460px] m-3 transition-all duration-200 transform hover:scale-105 ${
        highlight
          ? `bg-partner-tertiary-${themeId}`
          : `border-gray-300 bg-white`
      } ${disabled ? "pointer-events-none" : ""}`}
    >
      {plan.isCurrent && (
        <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg z-10">
          Your Plan
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center">
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          {highlight && plan.name === "Starter" && (
            <span className="ml-2 text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 font-semibold">
              Most Popular
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-purple-700 mb-3">
          {plan.price}
        </div>
        <div className="text-lg font-semibold text-gray-600 mb-3">
          {plan.creditsLabel}
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
        onClick={plan.onClick}
        className={`w-full py-2 px-4 rounded font-semibold ${
          plan.disabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : plan.highlight
            ? ""
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

export default PlanCard;
