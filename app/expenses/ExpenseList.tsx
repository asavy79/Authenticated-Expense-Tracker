"use client";

import { ExpenseType } from "@/actions/expenseActions";
import { DividerHorizontalIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useContext, useReducer } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";

type FilterState = {
  category: string;
  minCost: number;
  maxCost: number;
  startDate: string;
  endDate: string;
};

type FilterAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_MIN_COST"; payload: number }
  | { type: "SET_MAX_COST"; payload: number }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "RESET" };

const initialState: FilterState = {
  category: "",
  minCost: 0,
  maxCost: Infinity,
  startDate: "",
  endDate: "",
};

const filterReducer = (state: FilterState, action: FilterAction) => {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_MIN_COST":
      return { ...state, minCost: action.payload };
    case "SET_MAX_COST":
      return { ...state, maxCost: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const ExpenseList = () => {
  const expenseContext = useContext(ExpenseContext);
  if (!expenseContext) return null;
  const { fetchExpenses, expenses, deleteExpense } = expenseContext;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const [state, dispatch] = useReducer(filterReducer, initialState);

  const filteredExpenses = expenses.filter((expense) => {
    return (
      (state.category === "" || expense.category === state.category) &&
      expense.value >= state.minCost &&
      expense.value <= state.maxCost &&
      (state.startDate === "" ||
        new Date(expense.date) >= new Date(state.startDate)) &&
      (state.endDate === "" ||
        new Date(expense.date) <= new Date(state.endDate))
    );
  });

  const handleDelete = async (expenseId: number) => {
    await deleteExpense(expenseId);
  };

  const handleFilterReset = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "RESET" });
  };

  return (
    <div className="flex-flex-col">
      <div className="mb-10 shadow-md p-3">
        <h3 className="text-blue-500 mb-5 mt-5">Filters</h3>
        <select
          className="mr-2 border-b"
          value={state.category}
          onChange={(e) =>
            dispatch({ type: "SET_CATEGORY", payload: e.target.value })
          }
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Individual Meals">Individual Meals</option>
          <option value="Business Meals">Business Meals</option>
          <option value="Lodgin">Lodging</option>
        </select>
        <input
          type="number"
          value={state.minCost}
          onChange={(e) => {
            dispatch({ type: "SET_MIN_COST", payload: Number(e.target.value) });
          }}
          className="mr-2 border-b"
          placeholder="Min Cost"
        />
        <input
          type="number"
          value={state.maxCost}
          onChange={(e) => {
            dispatch({ type: "SET_MAX_COST", payload: Number(e.target.value) });
          }}
          className="mr-2 border-b"
          placeholder="Max Cost"
        />
        <input
          type="date"
          value={state.startDate}
          onChange={(e) => {
            dispatch({ type: "SET_START_DATE", payload: e.target.value });
          }}
          className="mr-2 border-b"
        />
        <input
          type="date"
          value={state.endDate}
          onChange={(e) => {
            dispatch({ type: "SET_END_DATE", payload: e.target.value });
          }}
          className="mr-2 border-b"
        />
        <button
          className="mt-2 w-100 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
          onClick={handleFilterReset}
        >
          Reset Filters
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto mt-5 shadow-md flex flex-col p-3">
        <div className="flex flex-col items-center">
          <h3>Recent Expenses</h3>
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
              .map((expense: ExpenseType, index: number) => (
                <tr
                  key={expense.id}
                  className="bg-white border-b border-gray-200"
                >
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src={
                        expense.user.image !== null
                          ? expense.user.image
                          : "defaultProfile.png"
                      }
                      alt="User"
                      className="h-8 w-8 rounded-full mr-2"
                    />{" "}
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
                    {" "}
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
