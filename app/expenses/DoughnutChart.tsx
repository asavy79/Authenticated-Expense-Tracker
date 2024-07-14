import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext, useState } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";
import { ExpenseType } from "@/actions/expenseActions";
import { userAgent } from "next/server";

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart: React.FC = () => {
  const context = useContext(ExpenseContext);
  const transactions = context ? context.expenses : [];

  const expenses = transactions.filter((expense) => expense.type === "Expense");

  const categoryTotals = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.value;
      return acc;
    },
    {}
  );

  const totalValue = expenses.reduce((acc: number, expense: ExpenseType) => {
    return acc + expense.value;
  }, 0);

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
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
        text: "Expenses by Category",
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
    <div className="flex flex-col items-center relate w-full h-64 md:h-50">
      <h3 className="mb-5">Expense Breakdown</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};
