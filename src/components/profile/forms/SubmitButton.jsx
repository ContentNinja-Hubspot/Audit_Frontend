import React from "react";

function SubmitButton({ loading, text }) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Processing..." : text}
      </button>
    </div>
  );
}

export default SubmitButton;
