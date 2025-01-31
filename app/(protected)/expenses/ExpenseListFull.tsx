"use client";

import { ExpenseType } from "@/actions/expenseActions";
import React, { useState, useContext } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";
import Image from "next/image";
import { updateExpense } from "@/actions/expenseActions";
import { DownloadCSV } from "./DownloadCSV";

export const ExpenseListFull = () => {
  const [editableExpenseId, setEditableExpenseId] = useState<number | null>(
    null
  );
  const [editedExpense, setEditedExpense] = useState<ExpenseType | null>(null);

  const expenseContext = useContext(ExpenseContext);

  /*
  useEffect(() => {
    if (!expenseContext) {
      return setExpenses([]);
    } else if (expenses.length === 0) {
      fetchExpenses();
    }
  }, []);

  */

  if (!expenseContext) return null;
  const { setExpenses, expenses, deleteExpense, filteredExpenses } =
    expenseContext;

  const handleDoubleClick = (expense: ExpenseType) => {
    if (expense.id === editableExpenseId) {
      cancelEdit();
    } else {
      setEditableExpenseId(expense.id);
      setEditedExpense(expense);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editedExpense) {
      if (name === "value") {
        setEditedExpense({ ...editedExpense, [name]: parseFloat(value) });
      } else if (name === "date") {
        setEditedExpense({ ...editedExpense, [name]: new Date(value) });
      } else {
        setEditedExpense({ ...editedExpense, [name]: value });
      }
    }
  };

  const saveChanges = async () => {
    if (editedExpense) {
      const result = await updateExpense(editedExpense);
      if (result.error) {
        console.log(result.error);
        return;
      }

      if (editedExpense) {
        const updatedExpenses = expenses.map((expense: ExpenseType) => {
          return expense.id === editableExpenseId ? editedExpense : expense;
        });

        setExpenses(updatedExpenses);
        setEditableExpenseId(null);
        return;
      }
    }
  };

  const cancelEdit = () => {
    setEditableExpenseId(null);
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderExpenseRow = (expense: ExpenseType) => {
    if (editableExpenseId === expense.id && editedExpense) {
      return (
        <tr
          key={expense.id}
          className="bg-white border-b border-gray-200"
          onDoubleClick={() => handleDoubleClick(expense)}
        >
          <td className="px-6 py-4 flex items-center">
            <Image
              width={50}
              height={50}
              src={
                expense.user.image !== null
                  ? `/${expense.user.image}`
                  : "/defaultProfile.png"
              }
              alt="User"
              className="h-8 w-8 rounded-full mr-2"
            />{" "}
            {expense.user.name}
          </td>
          <td className="px-6 py04">
            <input
              type="number"
              name="value"
              value={editedExpense.value}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="text"
              name="name"
              value={editedExpense.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="text"
              name="category"
              value={editedExpense.category}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1"
            />
          </td>
          <td className="px-6 py-4">
            <input
              type="date"
              name="date"
              value={formatDate(editedExpense.date)}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-1"
            />
          </td>
          <td className="px-6 py-4 flex items-center space-x-2">
            <button
              onClick={saveChanges}
              className="bg-green-500 text-white p-1 rounded"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-red-500 text-white p-1 rounded"
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    }

    return (
      <tr
        key={expense.id}
        onDoubleClick={() => handleDoubleClick(expense)}
        className="bg-white border-b border-gray-200"
      >
        <td className="px-6 py-4 flex items-center">
          <Image
            width={50}
            height={50}
            src={
              expense.user.image !== null
                ? `/${expense.user.image}`
                : "/defaultProfile.png"
            }
            alt="User"
            className="h-8 w-8 rounded-full mr-2"
          />{" "}
          {expense.user.name}
        </td>
        <td
          className={`px-6 py-4 ${
            expense.type === "Expense" ? "text-red-500" : "text-green-500"
          }`}
        >
          {expense.type === "Expense" ? "-" : ""}$
          {expense.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </td>
        <td className="px-6 py-4">{expense.name}</td>
        <td className="px-6 py-4">{expense.category}</td>
        <td className="px-6 py-4">
          {(() => {
            const dateObj = new Date(expense.date);
            const day = String(dateObj.getUTCDate()).padStart(2, "0");
            const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
            const year = dateObj.getUTCFullYear();
            return `${month}/${day}/${year}`;
          })()}
        </td>
        <td className="px-6 py-4">
          {" "}
          <button
            onClick={() => handleDelete(expense.id)}
            className="text-black px-5 py-1 rounded focus:outline-none"
          >
            &times;
          </button>
        </td>
      </tr>
    );
  };

  const handleDelete = async (expenseId: number) => {
    await deleteExpense(expenseId);
  };

  return (
    <div className="flex-flex-col">
      <div className="mt-5 shadow-md flex flex-col p-3">
        <div className="flex flex-col items-center">
          <h3>Recent Transactions</h3>
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
              .map(renderExpenseRow)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col mt-10 mb-10">
        <DownloadCSV />
      </div>
    </div>
  );
};
