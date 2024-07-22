"use client";

import { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";

export const ExpenseTotal = () => {
  const context = useContext(ExpenseContext);
  const expenses = context ? context.filteredExpenses : [];

  const [expenseTotal, setExpenseTotal] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);

  const [displayExpenseTotal, setDisplayExpenseTotal] = useState(0);
  const [displayRevenueTotal, setDisplayRevenueTotal] = useState(0);

  useEffect(() => {
    const newExpenseTotal = expenses.reduce((acc, expense) => {
      if (expense.type === "Expense") {
        acc = acc + expense.value;
      }
      return acc;
    }, 0);

    const newRevenueTotal = expenses.reduce((acc, expense) => {
      if (expense.type === "Revenue") {
        acc = acc + expense.value;
      }
      return acc;
    }, 0);

    setExpenseTotal(newExpenseTotal);
    setRevenueTotal(newRevenueTotal);
  }, [expenses]);

  useEffect(() => {
    const updateTotal = (
      targetTotal: number,
      setDisplayTotal: React.Dispatch<React.SetStateAction<number>>,
      displayTotal: number
    ) => {
      const increment = Math.ceil(Math.abs(targetTotal - displayTotal) / 20);
      const interval = setInterval(() => {
        setDisplayTotal((prev) => {
          if (prev === targetTotal) {
            clearInterval(interval);
            return prev;
          }

          if (prev < targetTotal) {
            const next = prev + increment;
            return next >= targetTotal ? targetTotal : next;
          } else {
            const next = prev - increment;
            return next <= targetTotal ? targetTotal : next;
          }
        });
      }, 30);

      return interval;
    };

    const expenseInterval = updateTotal(
      expenseTotal,
      setDisplayExpenseTotal,
      displayExpenseTotal
    );

    const revenueInterval = updateTotal(
      revenueTotal,
      setDisplayRevenueTotal,
      displayRevenueTotal
    );

    return () => {
      clearInterval(expenseInterval);
      clearInterval(revenueInterval);
    };
  }, [expenseTotal, revenueTotal]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Transaction Breakdown
      </h1>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Expenses
          </h3>
          <p className="text-3xl text-red-500 font-bold">
            ${displayExpenseTotal.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl text-green-500 font-bold">
            ${displayRevenueTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
