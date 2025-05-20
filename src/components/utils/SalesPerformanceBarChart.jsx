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
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const SalesPerformanceBarChart = ({
  salesPerformanceData = [],
  selectedMetric,
  inactiveDaysGraph,
  companyAverage,
}) => {
  const [chartData, setChartData] = useState(null);

  const metricLabelMap = {
    dealClosure: `Count of Won Deals  [Company Average - ${companyAverage}]`,
    revenueImpact: `Revenue Impact (%)`,
    revenueWinRate: `Revenue Win Rate  [Company Average - ${companyAverage}]`,
    dealstagnationrate: `Count of Stagnated Deals  [Company Average - ${companyAverage}]`,
    callRate: `Count of Connected Calls  [Company Average - ${companyAverage}]`,
    taskCompletion: `Count of Completed Tasks  [Company Average - ${companyAverage}]`,
    meetingRate: `Count of Meetings Taken in Last 30 Days [Company Average - ${companyAverage}]`,
    actionstaken: `Count of Actions Taken in Last 30 Days  [Company Average - ${companyAverage}]`,
    contactsowned: `Count of Contacts Owned in Last 30 Days  [Company Average - ${companyAverage}]`,
    dealsowned: `Count of Deals Owned in Last 30 Days [Company Average - ${companyAverage}]`,
    lastLogin: "Days Since Last Login",
  };

  useEffect(() => {
    if ((!salesPerformanceData && !inactiveDaysGraph) || !selectedMetric)
      return;

    const getMetricValue = (rep) => {
      if (selectedMetric === "lastLogin") {
        const inactiveData = inactiveDaysGraph.find(
          (user) => user.user_email === rep.rep_email
        );
        return inactiveData ? inactiveData.days : 0;
      }

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

    // Combine reps with values
    const combined = salesPerformanceData.map((rep) => {
      return {
        email: rep.rep_email,
        value: getMetricValue(rep),
      };
    });

    // Sort descending based on raw value
    combined.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    const labels = combined.map((item) => item.email);
    const rawValues = combined.map((item) => item.value);
    const values = rawValues.map((val) => Math.abs(val));
    const colors = rawValues.map((val) =>
      val >= 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(239,68,68,0.6)"
    );

    setChartData({
      labels,
      rawValues,
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

  const getChartTitle = (metric) =>
    metric === "lastLogin"
      ? "Days Since Last Login"
      : metricLabelMap[selectedMetric];

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
        anchor: "end",
        align: "end",
        color: "#000",
        font: { weight: "light", size: 12 },
        formatter: (value, context) => {
          const rawValue = chartData?.rawValues?.[context.dataIndex] ?? value;
          if (rawValue === 0) return "";
          if (selectedMetric === "lastLogin") {
            return `${Math.abs(rawValue)} Days`;
          }
          return rawValue < 0
            ? `-${Math.abs(rawValue)}`
            : `${Math.abs(rawValue)}`;
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
    <div className="hidden md:block w-full relative">
      <div className="overflow-y-auto h-[500px] cursor-all-scroll">
        <div
          className="min-w-[600px] min-h-[500px] md:max-w-[950px] mx-auto"
          style={{
            height: chartData?.labels?.length
              ? `${chartData.labels.length * 50}px`
              : "500px",
          }}
        >
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
