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

const metricKeyToDataArrayMap = {
  users_not_loggedin: "inactive_days",
  calls_not_logged: "calls_not_made_days",
  email_not_logged: "emails_not_sent_days",
  contacts_not_added: "contacts_not_added_days",
  deals_not_created: "deals_not_created_days",
  deals_not_owned: "deals_not_owned_days",
  meetings_not_logged: "meetings_not_logged_days",
  overdue_tasks: "users_with_high_overdue_tasks",
};

const UsageScorecardChart = ({ usageScorecardData, selectedMetric }) => {
  const [chartData, setChartData] = useState(null);

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

    const dataArrayKey = metricKeyToDataArrayMap[selectedMetric];
    if (!dataArrayKey) return;

    let users = [];
    let values = [];

    if (selectedMetric === "overdue_tasks") {
      const overdueArray = usageScorecardData[dataArrayKey] || [];
      const sorted = [...overdueArray].sort(
        (a, b) => (b.overdue_percentage || 0) - (a.overdue_percentage || 0)
      );

      users = sorted.map((item) => item.user_email);
      values = sorted.map((item) => item.overdue_percentage || 0);
    } else {
      const metricArray = usageScorecardData[dataArrayKey] || [];
      const sorted = [...metricArray].sort((a, b) => {
        const aDays = a.days === "None" ? 0 : Number(a.days || 0);
        const bDays = b.days === "None" ? 0 : Number(b.days || 0);
        return bDays - aDays;
      });

      users = sorted.map((item) => item.user_email);
      values = sorted.map((item) => {
        if (item.days === "None") return 0;
        return item.days ? Number(item.days) : 0;
      });
    }

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
        anchor: "end",
        align: "end",
        // offset: 16,
        color: "#000",
        font: {
          weight: "light",
          size: 12,
        },
        formatter: (value, context) => {
          const label = context.chart.data.datasets[context.datasetIndex].label;
          return label.includes("%") ? `${value}%` : `${value} Days`;
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
          className="min-w-[600px] md:max-w-[950px] mx-auto"
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

export default UsageScorecardChart;
