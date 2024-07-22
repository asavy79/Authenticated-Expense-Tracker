import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useState } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";
import { ExpenseType } from "@/actions/expenseActions";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart: React.FC = () => {
  const context = useContext(ExpenseContext);
  const transactions = context ? context.expenses : [];
  const filteredExpenses = context ? context.filteredExpenses : [];

  const [filterType, setFilterType] = useState("category");

  const expenses = filteredExpenses.filter(
    (expense) => expense.type === "Expense"
  );

  const revenue = filteredExpenses.filter(
    (expense) => expense.type === "Revenue"
  );

  const categoryTotals = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.value;
      return acc;
    },
    {}
  );

  const userTotals = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.user.name] = (acc[expense.user.name] || 0) + expense.value;
    return acc;
  }, {});

  const totalValue = expenses.reduce((acc: number, expense: ExpenseType) => {
    return acc + expense.value;
  }, 0);

  const data = {
    labels: Object.keys(
      filterType === "category" ? categoryTotals : userTotals
    ),
    datasets: [
      {
        label: `Expenses by ${filterType === "category" ? "Category" : "User"}`,
        data: Object.values(
          filterType === "category" ? categoryTotals : userTotals
        ),
        backgroundColor: [
          "rgba(0, 123, 255, 0.6)",
          "rgba(102, 16, 242, 0.6)",
          "rgba(0, 86, 179, 0.6)",
          "rgba(134, 84, 243, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(103, 58, 183, 0.6)",
        ],
        borderColor: [
          "rgba(0, 123, 255, 1)",
          "rgba(102, 16, 242, 1)",
          "rgba(0, 86, 179, 1)",
          "rgba(134, 84, 243, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(103, 58, 183, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Expenses by ${filterType === "category" ? "Category" : "User"}`,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const percentage = ((value / totalValue) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };
  return (
    <div className="flex flex-col items-center relative w-full md:h-96 space-y-4">
      <select
        onChange={(e) => {
          setFilterType(e.target.value);
        }}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="category">By Category</option>
        <option value="user">By User</option>
      </select>
      <div className="relative h-64 md:h-96">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
