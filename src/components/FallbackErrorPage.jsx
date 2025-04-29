import React from "react";
// import PastReportHeader from "./header/PastReportHeader";

const FallbackErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex">
      <main className="flex-1 overflow-auto h-screen">
        {/* <PastReportHeader /> */}
        <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-24">
          <h1 className="text-3xl font-bold mb-4">
            😵 Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 mb-4">{error?.message}</p>
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={resetErrorBoundary}
          >
            Try Again
          </button>
        </div>
      </main>
    </div>
  );
};

export default FallbackErrorPage;
