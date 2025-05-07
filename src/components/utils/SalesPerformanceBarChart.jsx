import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // for inside-bar values

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

ChartJS.defaults.font.family = "'Lexend', sans-serif";

// Metric display names (for better graph labels)
const metricLabelMap = {
  dealClosure: "Deal Won Percentage",
  revenueImpact: "Revenue Impact Percentage",
  revenueWinRate: "Revenue Win Rate",
  dealstagnationrate: "Deal Stagnation Percentage",
  callRate: "Connected Call Percentage",
  taskCompletion: "Task Completion Percentage",
  meetingRate: "Meeting Taken Percentage",
  actionstaken: "Actions Taken Percentage",
  contactsowned: "Contacts Owned Percentage",
  dealsowned: "Deals Owned Percentage",
  lastLogin: "Days Since Last Login", // Added for lastLogin
};

const SalesPerformanceBarChart = ({
  salesPerformanceData = [],
  selectedMetric,
  inactiveDaysGraph,
  companyAverage = 10,
}) => {
  const [chartData, setChartData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 bars at a time

  useEffect(() => {
    if ((!salesPerformanceData && !inactiveDaysGraph) || !selectedMetric)
      return;

    const getMetricValue = (rep) => {
      if (selectedMetric === "lastLogin") {
        // Find the user in the inactiveDaysGraph data and get the number of inactive days
        const inactiveData = inactiveDaysGraph.find(
          (user) => user.user_email === rep.rep_email
        );
        return inactiveData ? inactiveData.days : 0; // If user not found, return 0
      }

      // Handle other metrics as before
      switch (selectedMetric) {
        case "dealClosure":
          return rep.deal_closure_rate_rounded ?? 0;
        case "revenueImpact":
          return rep.revenue_impact_rounded ?? 0;
        case "revenueWinRate":
          return rep.revenue_win_rate_percentage_diff ?? 0;
        case "dealstagnationrate":
          return rep.deal_stagnation_rate_rounded ?? 0;
        case "callRate":
          return rep.connected_call_rate_rounded ?? 0;
        case "taskCompletion":
          return rep.task_completion_rate_rounded ?? 0;
        case "meetingRate":
          return rep.meetings_than_company_average?.last_30_days_count ?? 0;
        case "actionstaken":
          return rep.actions_than_company_average?.last_30_days_count ?? 0;
        case "contactsowned":
          return rep.contacts_than_company_average?.last_30_days_count ?? 0;
        case "dealsowned":
          return rep.deals_than_company_average?.last_30_days_count ?? 0;
        default:
          return 0;
      }
    };

    const labels = salesPerformanceData.map((rep) => rep.rep_email);
    const rawValues = salesPerformanceData.map((rep) => getMetricValue(rep));

    let values = rawValues.map((val) => Math.abs(val)); // Always draw positive bars
    if (selectedMetric === "lastLogin") {
      // For lastLogin, use the raw values (number of days) directly, no need for % conversion
      values = rawValues;
    }

    const colors = rawValues.map(
      (val) => (val >= 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(239,68,68,0.6)") // Blue for positive, Red for negative
    );

    setCurrentPage(1);
    // Set initial chart data
    setChartData({
      labels,
      rawValues, // Keep raw values for data labels
      datasets: [
        {
          label: metricLabelMap[selectedMetric] || "Selected Metric",
          data: values,
          backgroundColor: colors,
          barThickness: 20,
        },
      ],
    });
  }, [salesPerformanceData, selectedMetric, inactiveDaysGraph]);

  const getChartTitle = (metric) => {
    if (metric === "lastLogin") {
      return "Days Since Last Login"; // Special title for lastLogin
    }
    return `${metricLabelMap[selectedMetric]}`;
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: {
        display: true,
        text: getChartTitle(selectedMetric),
        align: "center",
        color: "#000",
        font: { size: 16, weight: "light" },
        padding: { top: 0, bottom: 20 },
      },
      datalabels: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + Number(b),
            0
          );
          const threshold = total * 0.1;
          return value < threshold ? "end" : "center"; // Align accordingly
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + Number(b),
            0
          );
          const threshold = total * 0.1; // 10% of total value
          return value < threshold ? "end" : "center"; // Align accordingly
        },
        color: (context) => {
          const value = context.dataset.rawValues?.[context.dataIndex] || 0;
          return "#000"; // inside white, outside black
        },
        font: { weight: "light", size: 12 },
        formatter: (value, context) => {
          const rawValue = context.dataset.data?.[context.dataIndex] || 0;
          if (rawValue === 0) return "";
          if (selectedMetric === "lastLogin") {
            return `${Math.abs(rawValue)} Days`; // Show days instead of percentage for lastLogin
          }
          if (rawValue < 0) {
            return `-${Math.abs(rawValue)}`;
          }
          return `${Math.abs(rawValue)}`;
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: "#000" },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#000",
          callback: function (value) {
            let label = this.getLabelForValue(value);
            return label.length > 20 ? label.slice(0, 18) + "..." : label;
          },
        },
      },
    },
  };

  // Paginate the data
  const pagedData = chartData
    ? {
        ...chartData,
        labels: chartData.labels.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        ),
        datasets: [
          {
            ...chartData.datasets[0],
            data: chartData.datasets[0].data.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            ),
          },
        ],
        rawValues: chartData.rawValues.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        ),
      }
    : null;

  const handleNextPage = () => {
    if (pagedData && currentPage * itemsPerPage < chartData.labels.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full relative">
      <div className="overflow-hidden">
        <div className="relative">
          <div
            className="min-w-[600px] md:max-w-[950px] h-[500px] mx-auto"
            style={{
              maxHeight: "500px", // Fixed height for the chart container
            }}
          >
            {pagedData && pagedData.labels.length > 0 ? (
              <Bar
                data={pagedData}
                options={options}
                plugins={[ChartDataLabels]}
              />
            ) : (
              <p className="text-center text-gray-500 py-10">
                No data available for this metric.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Up Arrow Button */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="absolute top-4 right-16 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        ↑
      </button>

      {/* Down Arrow Button */}
      <button
        onClick={handleNextPage}
        disabled={
          pagedData && currentPage * itemsPerPage >= chartData.labels.length
        }
        className="absolute bottom-4 right-16 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        ↓
      </button>
    </div>
  );
};

export default SalesPerformanceBarChart;
