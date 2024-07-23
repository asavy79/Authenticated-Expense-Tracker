"use client";

import { ExpenseType } from "@/actions/expenseActions";
import { useEffect, useContext, useState } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";
import Image from "next/image";

export const ExpenseList = () => {
  const expenseContext = useContext(ExpenseContext);

  useEffect(() => {
    if (!expenseContext) {
      setExpenses([]);
    } else if (expenses.length === 0) {
      fetchExpenses();
    }
  }, [expenseContext]);

  if (!expenseContext) return null;
  const {
    fetchExpenses,
    deleteExpense,
    filteredExpenses,
    setExpenses,
    expenses,
  } = expenseContext;

  const handleDelete = async (expenseId: number) => {
    await deleteExpense(expenseId);
  };

  return (
    <div className="flex space-x-6 p-6">
      <div className="flex-grow max-h-96 overflow-y-auto shadow-lg bg-white rounded-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3" scope="col">
                User
              </th>
              <th className="px-6 py-3" scope="col">
                Amount
              </th>
              <th className="px-6 py-3" scope="col">
                Name
              </th>
              <th className="px-6 py-3" scope="col">
                Category
              </th>
              <th className="px-6 py-3" scope="col">
                Date
              </th>
              <th className="px-6 py-3" scope="col">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses
              ?.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((expense: ExpenseType) => (
                <tr
                  key={expense.id}
                  className="bg-white border-b border-gray-200"
                >
                  <td className="px-6 py-4 flex items-center">
                    <Image
                      width={40}
                      height={40}
                      src={
                        expense.user.image !== null
                          ? `/${expense.user.image}`
                          : "/defaultProfile.png"
                      }
                      alt="User"
                      className="rounded-full w-8 h-8 mr-2"
                    />

                    {expense.user.name}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      expense.type === "Expense"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {expense.type === "Expense" ? "-" : ""}${expense.value}
                  </td>
                  <td className="px-6 py-4">{expense.name}</td>
                  <td className="px-6 py-4">{expense.category}</td>
                  <td className="px-6 py-4">
                    {(() => {
                      const dateObj = new Date(expense.date);
                      const day = String(dateObj.getUTCDate()).padStart(2, "0");
                      const month = String(dateObj.getUTCMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const year = dateObj.getUTCFullYear();
                      return `${month}/${day}/${year}`;
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-black px-5 py-1 rounded focus:outline-none"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
