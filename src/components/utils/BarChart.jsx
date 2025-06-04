import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "../../context/ThemeContext";
import { THEME_COLORS } from "../../config/theme.config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartDataLabels,
  Legend
);

ChartJS.defaults.font.family = "'Lexend', sans-serif";

const dummyDataBySource = {
  labels: [
    "Organic Search",
    "Paid Search",
    "Email Marketing",
    "Social Media",
    "Referrals",
    "Other Campaigns",
    "Direct Traffic",
    "Offline",
    "Paid Social",
    "Unknown",
  ],
  datasets: [
    {
      label: "By Source",
      data: [23, 87, 59, 75, 11, 55, 1, 95, 62, 51],
    },
  ],
};

const dummyDataByOwners = {
  labels: [
    "Owner A",
    "Owner B",
    "Owner C",
    "Owner D",
    "Owner E",
    "Owner F",
    "Owner G",
    "Owner H",
    "Owner I",
    "Owner J",
  ],
  datasets: [
    {
      label: "By Owners",
      data: [40, 65, 75, 50, 90, 33, 28, 66, 77, 45],
    },
  ],
};

const BarChart = ({
  parent,
  dataPoint,
  graphData,
  missingData,
  inferenceKey,
}) => {
  const [chartDataBySource, setChartDataBySource] = useState(null);
  const [chartDataByOwners, setChartDataByOwners] = useState(null);
  const [inference, setInference] = useState(null);
  const [view, setView] = useState("source");

  const { themeId } = useTheme();

  const theme = THEME_COLORS[themeId];

  const noDataPoints = [
    "internal_team_members",
    "without_name_and_domain",
    "without_name_and_owner",
  ];
  const isNoDataPoint = noDataPoints.includes(dataPoint);

  useEffect(() => {
    if (!graphData || !dataPoint) return;

    const sourceData = graphData.graph_data_by_source[dataPoint] || {};
    const labelsBySource = Object.keys(sourceData);
    const valuesBySource = Object.values(sourceData);

    if (labelsBySource.length && valuesBySource.length) {
      setChartDataBySource({
        labels: labelsBySource,
        datasets: [
          {
            label: `${dataPoint}`,
            data: valuesBySource,
            backgroundColor: theme?.secondary || "rgba(54, 162, 235, 0.5)",
            barThickness: 20,
          },
        ],
      });
    }

    const ownerEntries = Object.entries(
      graphData.graph_data_by_owner[dataPoint] || {}
    );
    ownerEntries.sort((a, b) => b[1] - a[1]);

    const labelsByOwners = ownerEntries.map(([key]) => key);
    const valuesByOwners = ownerEntries.map(([, value]) => value);

    setChartDataByOwners({
      labels: labelsByOwners,
      datasets: [
        {
          label: `${dataPoint}`,
          data: valuesByOwners,
          backgroundColor: theme?.secondary || "rgba(54, 162, 235, 0.5)",
          barThickness: 20,
        },
      ],
    });
  }, [graphData, dataPoint]);

  useEffect(() => {
    if (missingData && inferenceKey) {
      const inferenceData = missingData[inferenceKey];
      setInference(inferenceData?.inference);
    }
  }, [missingData, inferenceKey]);

  const options = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 60,
      },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end", // Position at end of bar
        align: "end", // Align nicely at end
        color: "#000", // Black text
        font: {
          weight: "light",
          size: 12,
        },
        formatter: (value) => {
          if (value === 0) return "";
          return value.toLocaleString(); // Add commas if large number
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          color: "#000",
          autoSkip: true,
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#000",
          align: "start",
          padding: 5,
          callback: function (value) {
            let label = this.getLabelForValue(value);
            label = label.replace(/_/g, " ").toLowerCase();
            return label.length > 20 ? label.slice(0, 18) + "..." : label;
          },
        },
      },
    },
  };

  const renderChart = () => {
    const activeChartData =
      view === "source"
        ? chartDataBySource || dummyDataBySource
        : chartDataByOwners || dummyDataByOwners;

    const rowHeight = 50;
    const chartHeight =
      activeChartData?.labels?.length > 0
        ? activeChartData.labels.length * rowHeight
        : 400;

    return (
      <div className="overflow-y-auto max-h-[500px] cursor-all-scroll">
        <div
          className="min-w-[600px] md:max-w-[950px] mx-auto"
          style={{ height: `${chartHeight}px` }}
        >
          <Bar data={activeChartData} options={options} />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full hidden md:block">
      {inference && (
        <p className="text-center text-gray-700 border-b border-gray-300 pb-4 mb-6 max-w-4xl mx-auto text-sm sm:text-base w-[90%]">
          {inference}
        </p>
      )}

      {isNoDataPoint ? (
        <div className="flex justify-center items-center h-96 text-gray-600 text-lg">
          No graph data available
        </div>
      ) : (
        <>
          {/* Toggle */}
          <div className={`${parent === "sales" ? "hidden" : "block"}`}>
            <div className="flex justify-center items-center mb-4 gap-4">
              <span
                className={`cursor-pointer text-sm sm:text-base transition ${
                  view === "source"
                    ? "text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setView("source")}
              >
                By Source
              </span>

              <div
                className="relative w-14 h-6 bg-gray-300 rounded-full cursor-pointer"
                onClick={() => setView(view === "source" ? "owners" : "source")}
              >
                <div
                  className={`absolute top-0 h-6 w-6 bg-black rounded-full transition-transform duration-300 ${
                    view === "owners" ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </div>

              <span
                className={`cursor-pointer text-sm sm:text-base transition ${
                  view === "owners"
                    ? "text-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setView("owners")}
              >
                By Owners
              </span>
            </div>
          </div>

          {/* Chart or Loader */}
          {!graphData || !dataPoint ? (
            <div className="relative">
              {renderChart()}
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Generating Graph...
                </p>
              </div>
            </div>
          ) : (
            renderChart()
          )}
        </>
      )}
    </div>
  );
};

export default BarChart;
