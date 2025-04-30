import React from "react";

export const Tooltip = ({ tooltipText, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-3/4 mb-2 hidden group-hover:block rounded bg-white text-black py-1 px-2 text-xs shadow-lg z-10 w-48 text-start">
        {tooltipText}
      </div>
    </div>
  );
};
