import React from "react";

function SubmitButton({ loading, text }) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        disabled={loading}
        className={`bg-purple-500 text-white font-medium text-lg py-2 px-8 rounded-md transition hover:bg-purple-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : text}
      </button>
    </div>
  );
}

export default SubmitButton;
