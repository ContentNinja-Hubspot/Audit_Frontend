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
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import datalabels plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register datalabels plugin
);

ChartJS.defaults.font.family = "'Lexend', sans-serif";

// Prettier labels for the selected metrics
const metricLabelMap = {
  users_not_loggedin: "Days Not Logged In",
  deals_not_owned: "Days Deals Not Owned",
  calls_not_logged: "Calls Not Logged",
  email_not_logged: "Emails Not Logged",
  contacts_not_added: "Contacts Not Added",
  overdue_tasks: "Overdue Tasks (%)",
  meetings_not_logged: "Meetings Not Logged",
  deals_not_created: "Deals Not Created",
};

// Map selectedMetric -> actual data array key inside usageScorecardData
const metricKeyToDataArrayMap = {
  users_not_loggedin: "inactive_days",
  calls_not_logged: "calls_not_made_days",
  email_not_logged: "emails_not_sent_days",
  contacts_not_added: "contacts_not_added_days",
  deals_not_created: "deals_not_created_days",
  deals_not_owned: "deals_not_owned_days",
  meetings_not_logged: "meetings_not_logged_days",
  overdue_tasks: "users_with_high_overdue_tasks", // special case
};

const UsageScorecardChart = ({ usageScorecardData, selectedMetric }) => {
  const [chartData, setChartData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getChartTitle = (selectedMetric) => {
    const titleMap = {
      users_not_loggedin: "Days since reps logged in",
      deals_not_owned: "Days since reps owned new deals",
      calls_not_logged: "Days since reps made any call",
      email_not_logged: "Days since reps sent an email",
      contacts_not_added: "Days since reps added new contacts",
      overdue_tasks: "% of overdue tasks",
      meetings_not_logged: "Days since reps logged a meeting",
      deals_not_created: "Days since reps created new deals",
    };

    return titleMap[selectedMetric] || "Days Since Last Activity";
  };

  useEffect(() => {
    if (!usageScorecardData || !selectedMetric) return;

    let users = [];
    let values = [];

    const dataArrayKey = metricKeyToDataArrayMap[selectedMetric];

    if (!dataArrayKey) {
      console.error(`No mapping found for selected metric: ${selectedMetric}`);
      return;
    }

    if (selectedMetric === "overdue_tasks") {
      // Special case handling
      const overdueArray = usageScorecardData[dataArrayKey] || [];
      users = overdueArray.map((item) => item.user_email);
      values = overdueArray.map((item) => item.overdue_percentage || 0);
    } else {
      const metricArray = usageScorecardData[dataArrayKey] || [];
      users = metricArray.map((item) => item.user_email);
      values = metricArray.map((item) => {
        if (item.days === "None") return 0;
        return item.days ? Number(item.days) : 0;
      });
    }

    setCurrentPage(1);
    setChartData({
      labels: users,
      datasets: [
        {
          label: metricLabelMap[selectedMetric] || "Selected Metric",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          barThickness: 20,
        },
      ],
    });
  }, [usageScorecardData, selectedMetric]);

  const handleNextPage = () => {
    if (chartData) {
      const totalItems = chartData.labels.length;
      const maxPages = Math.ceil(totalItems / itemsPerPage);
      if (currentPage < maxPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: {
        display: true,
        text: getChartTitle(selectedMetric),
        align: "center", // <-- align left
        color: "#000",
        font: {
          size: 16,
          weight: "light",
        },
        padding: {
          top: 0,
          bottom: 20,
        },
      },
      datalabels: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const threshold = total * 0.1; // 10% of total value
          return value < threshold ? "end" : "center"; // Move outside if small value
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const threshold = total * 0.1; // 10% of total value
          return value < threshold ? "end" : "center"; // Align accordingly
        },
        color: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return "#000"; // Black outside, White inside
        },
        font: {
          weight: "light",
          size: 12,
        },
        formatter: (value, context) => {
          const selected =
            context.chart.data.datasets[context.datasetIndex].label;
          if (selected.includes("%")) {
            return value ? `${value}%` : "";
          } else {
            return value ? `${value} Days` : "";
          }
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
      }
    : null;

  return (
    <div className="w-full relative">
      <div className="overflow-hidden">
        <div className="min-w-[600px] md:max-w-[950px] h-[500px] mx-auto">
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
          !pagedData || currentPage * itemsPerPage >= chartData.labels.length
        }
        className="absolute bottom-4 right-16 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        ↓
      </button>
    </div>
  );
};

export default UsageScorecardChart;
