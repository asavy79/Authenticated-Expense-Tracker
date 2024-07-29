import React, { useContext } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";
import { ExpenseType } from "@/actions/expenseActions";

export const DownloadCSV = () => {
  const expenseContext = useContext(ExpenseContext);

  const downloadCSV = (data: ExpenseType[]) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const convertToCSV = (data: ExpenseType[]) => {
    const headers = ["Employee", "Type", "Amount", "Name", "Category", "Date"];
    const csv = [
      headers.join(","),
      ...data.map((transaction) =>
        [
          transaction.user.name,
          transaction.type,
          transaction.value,
          transaction.name,
          transaction.category,
          transaction.date.toISOString(),
        ].join(",")
      ),
    ];
    return csv.join("\n");
  };

  if (!expenseContext) return null;

  const { filteredExpenses } = expenseContext;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sortedExpenses = filteredExpenses.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    downloadCSV(sortedExpenses);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={(e) => handleSubmit(e)}
        className="text-white bg-blue-500 p-3 rounded-md"
      >
        Download Transactions
      </button>
    </div>
  );
};
