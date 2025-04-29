import React from "react";

const ReportGenerate = ({ progress }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32">
        <p className="text-lg font-semibold bg-gradient-to-r from-teal-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-2">
          Generating Report: {progress}%
        </p>
        <div className="w-4/5 max-w-3xl h-3 bg-gray-300 rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-indigo-600 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #00c6ff, #0072ff)`,
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 my-10">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto w-full md:w-[80%] ">
            <p className="text-5xl text-start font-semibold">
              <span className="text-orange-500 text-3xl md:text-6xl">
                Sit Tight!{" "}
              </span>
              <br />
              <span
                className="text-xl md:text-5xl"
                style={{ lineHeight: "1.375" }}
              >
                Your report is being generated and will be displayed soon
              </span>
            </p>

            <div className="w-80">
              <img
                src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/platform_GIF.gif"
                alt="Loading"
              />
            </div>
          </div>
        </div>

        <p className="text-sm italic text-gray-600 mb-4">
          <em>This automated HubSpot auditor is currently in beta.</em>
        </p>
        <p className="text-center text-sm">
          We’re a small team working hard to build value-driven products for the
          HubSpot ecosystem. If you face any challenges, please{" "}
          <a href="#" className="text-blue-500 hover:underline">
            drop us a note
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-500 hover:underline">
            restart the process here
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default ReportGenerate;
