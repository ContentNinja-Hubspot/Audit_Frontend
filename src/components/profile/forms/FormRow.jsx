import React from "react";

function FormRow({ label, required, children }) {
  return (
    <div>
      <label className="block text-gray-600 text-sm font-semibold mb-1 text-start">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export default FormRow;
