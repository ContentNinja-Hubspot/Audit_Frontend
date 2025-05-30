import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Applying Logo" },
  { id: 2, label: "Applying Theme" },
  { id: 3, label: "Applying Font" },
];

const dotVariants = {
  initial: { scale: 0.8, opacity: 0.3 },
  active: { scale: 1.2, opacity: 1, transition: { duration: 0.4 } },
  complete: { scale: 1, opacity: 0.5, transition: { duration: 0.4 } },
};

export default function ApplyProgressAnimation({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) return prev + 1;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur flex flex-col justify-center items-center">
      <div className="mb-6 text-xl font-semibold text-gray-800">
        Finalizing your setup...
      </div>
      <div className="flex flex-col items-center gap-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-3">
            <motion.div
              className="w-4 h-4 rounded-full bg-purple-600"
              variants={dotVariants}
              initial="initial"
              animate={
                currentStep === idx + 1
                  ? "active"
                  : currentStep > idx + 1
                  ? "complete"
                  : "initial"
              }
            />
            <p
              className={`text-sm ${
                currentStep > idx
                  ? "text-gray-500"
                  : currentStep === idx
                  ? "text-purple-600 font-medium"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
