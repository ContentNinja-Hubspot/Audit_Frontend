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

// Metric display names (for better graph labels)
const metricLabelMap = {
  dealClosure: "Deal Win Rate",
  revenueImpact: "Revenue Impact",
  revenueWinRate: "Revenue Win Rate",
  dealstagnationrate: "Deal Stagnation Rate",
  callRate: "Connected Call Rate",
  taskCompletion: "Task Completion Rate",
  meetingRate: "Meeting Rate",
  actionstaken: "Actions Taken",
  contactsowned: "Contacts Owned",
  dealsowned: "Deals Owned",
};

const SalesPerformanceBarChart = ({
  salesPerformanceData = [],
  selectedMetric,
}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!salesPerformanceData || !selectedMetric) return;

    const getMetricValue = (rep) => {
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
          return (
            rep.meetings_than_company_average?.last_30_days_percentage_diff ?? 0
          );
        case "actionstaken":
          return (
            rep.actions_than_company_average?.last_30_days_percentage_diff ?? 0
          );
        case "contactsowned":
          return (
            rep.contacts_than_company_average?.last_30_days_percentage_diff ?? 0
          );
        case "dealsowned":
          return (
            rep.deals_than_company_average?.last_30_days_percentage_diff ?? 0
          );
        default:
          return 0;
      }
    };

    const labels = salesPerformanceData.map((rep) => rep.rep_email);
    const rawValues = salesPerformanceData.map((rep) => getMetricValue(rep));
    const values = rawValues.map((val) => Math.abs(val)); // Always draw positive bars
    const colors = rawValues.map((val) =>
      val >= 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(239,68,68,0.6)"
    ); // Blue for positive, Red for negative

    setChartData({
      labels,
      datasets: [
        {
          label: metricLabelMap[selectedMetric] || "Selected Metric",
          data: values,
          backgroundColor: colors,
          barThickness: 20,
          rawValues, // Keep raw values for datalabels
        },
      ],
    });
  }, [salesPerformanceData, selectedMetric]);

  const getChartTitle = (metric) => {
    if (
      metric === "revenueWinRate" ||
      metric === "actionstaken" ||
      metric === "contactsowned" ||
      metric === "dealsowned" ||
      metric === "meetingRate"
    ) {
      return "% Difference Compared to Company Average";
    }
    return "Performance Metrics (%)";
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
          const value = context.dataset.rawValues?.[context.dataIndex] || 0;
          return Math.abs(value) < 5 ? "end" : "center";
        },
        align: (context) => {
          const value = context.dataset.rawValues?.[context.dataIndex] || 0;
          return Math.abs(value) < 5 ? "end" : "center";
        },
        color: (context) => {
          const value = context.dataset.rawValues?.[context.dataIndex] || 0;
          return "#000"; // inside white, outside black
        },
        font: { weight: "light", size: 12 },
        formatter: (value, context) => {
          const rawValue = context.dataset.rawValues?.[context.dataIndex] || 0;
          if (rawValue === 0) return "";
          if (rawValue < 0) {
            return `-${Math.abs(rawValue)}%`;
          }
          return `${Math.abs(rawValue)}%`;
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[600px] md:max-w-[950px] h-[500px] mx-auto">
          {chartData && chartData.labels.length > 0 ? (
            <Bar
              data={chartData}
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
  );
};

export default SalesPerformanceBarChart;
