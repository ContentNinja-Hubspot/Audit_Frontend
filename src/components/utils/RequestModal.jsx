import React, { useEffect, useState } from "react";
import { handleJunkDataAction } from "../../api";

const RequestModal = ({
  isOpen,
  onClose,
  selectedItems = [],
  actionType,
  token,
  hubId,
  objectname,
}) => {
  const [loadingStatus, setLoadingStatus] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && selectedItems.length > 0) {
      processRequests(selectedItems);
    }
  }, [isOpen]);

  const processRequests = async (itemsToProcess) => {
    setIsProcessing(true);

    // Set all to loading initially
    const initialStatus = {};
    itemsToProcess.forEach((item) => {
      initialStatus[item] = { status: "loading", message: "" };
    });
    setLoadingStatus(initialStatus);

    try {
      const response = await handleJunkDataAction({
        actionType,
        token,
        hubId,
        items: itemsToProcess,
        objectname,
      });

      const { results = {} } = response;

      const updatedStatus = {};
      itemsToProcess.forEach((item) => {
        const res = results[item] || {};
        const success = res.success ?? false;
        updatedStatus[item] = {
          status: success ? "success" : "failed",
          message: res.message || "Unknown error",
        };
      });

      setLoadingStatus(updatedStatus);
    } catch (err) {
      const errorStatus = {};
      itemsToProcess.forEach((item) => {
        errorStatus[item] = { status: "failed", message: "Request failed" };
      });
      setLoadingStatus(errorStatus);
    }

    setIsProcessing(false);
  };

  // const retryFailed = () => {
  //   const failedItems = Object.keys(loadingStatus).filter(
  //     (key) => loadingStatus[key].status === "failed"
  //   );
  //   if (failedItems.length > 0) processRequests(failedItems);
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center text-base w-[70%] text-black shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {actionType === "create"
            ? "Creating Active List"
            : "Deleting Junk Data"}
        </h2>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="text-center border-b">
              <th className="pb-2">Item</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item} className="border-b">
                <td className="py-2">{item.replace(/_/g, " ")}</td>
                <td className="py-2">
                  {loadingStatus[item]?.status === "failed" ? (
                    <span className="text-red-500 text-lg">❌</span>
                  ) : loadingStatus[item]?.status === "success" ? (
                    <span className="text-green-600 text-lg">✅</span>
                  ) : (
                    <span className="inline-block w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ml-2 align-middle"></span>
                  )}
                </td>
                <td className="py-2">{loadingStatus[item]?.message}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className={` ${
              isProcessing ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
          >
            Close
          </button>
          {/* <button
            onClick={retryFailed}
            disabled={isProcessing}
            className={`px-4 py-2 text-white font-medium ${
              isProcessing
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Retry Failed
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
