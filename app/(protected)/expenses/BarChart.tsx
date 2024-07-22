import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export const BarChart = () => {
  const context = useContext(ExpenseContext);
  const transactions = context ? context.filteredExpenses : [];

  const monthlyData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === "Revenue") {
        acc[month].income += transaction.value;
      } else if (transaction.type === "Expense") {
        acc[month].expense += transaction.value;
      }

      return acc;
    }, {});

  const labels = Object.keys(monthlyData);
  const incomeData = labels.map((label) => monthlyData[label].income);
  const expenseData = labels.map((label) => monthlyData[label].expense);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(0, 0, 204, 0.6)",
        borderColor: "rgba(0, 0, 204, 1)",
        borderWidth: 1,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(103, 0, 204, 0.6)",
        borderColor: "rgba(103, 0, 204, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Income & Expense Comparison",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full md:h-96">
      <Bar data={data} options={options} />
    </div>
  );
};
