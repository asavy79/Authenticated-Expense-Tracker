"use client";
import { ExpenseType } from "@/actions/expenseActions";
import { ExpenseSubmitType } from "../page";
import React, { createContext, useState, useReducer, useEffect } from "react";
import { getExpenses } from "@/actions/expenseActions";

type FilterState = {
  category: string;
  minCost: number;
  maxCost: number;
  startDate: string;
  endDate: string;
  type: string;
  userId: string;
};

type FilterAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_MIN_COST"; payload: number }
  | { type: "SET_MAX_COST"; payload: number }
  | { type: "SET_START_DATE"; payload: string }
  | { type: "SET_END_DATE"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_USER"; payload: string }
  | { type: "RESET" };

type ExpenseContextType = {
  expenses: ExpenseType[];
  fetchExpenses: () => Promise<void>;
  addExpense: (
    expense: ExpenseSubmitType
  ) => Promise<{ success: string; error: null } | { error: string }>;
  deleteExpense: (expenseId: number) => Promise<void>;
  setExpenses: (expenses: ExpenseType[]) => void;
  filteredExpenses: ExpenseType[];
  dispatch: React.Dispatch<FilterAction>;
  state: FilterState;
};

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  console.log("Mounted");

  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  const [expensesFetched, setExpensesFetched] = useState(false);

  /*
  const fetchExpenses = async () => {
    const fetchedExpenses = await getExpenses();
    if (fetchedExpenses.data) {
      setExpenses(fetchedExpenses.data);
    }
  };

  */

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.error) {
        return console.log("Couldn't fetch expenses: ", result.error);
      }

      const fetchedExpenses = result.data;
      setExpenses(fetchedExpenses);
      setExpensesFetched(true);
    } catch (error) {
      console.log(error);
    }
  };

  const addExpense = async (expense: ExpenseSubmitType) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      const result = await response.json();

      if (result.error) {
        console.log("Couldn't add expense", result.error);
        return { error: "Couldn't add expense" };
      } else {
        await fetchExpenses();
        return { success: "Expense added", error: null };
      }
    } catch (error) {
      console.log(error);
      return { error: "Couldn't add expense" };
    }
  };

  useEffect(() => {
    if (!expensesFetched) fetchExpenses();
  }, []);

  const deleteExpense = async (expenseId: number) => {
    const data = {
      expenseId: expenseId,
    };
    try {
      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.error) {
        console.log("Couldn't delete expense", result.error);
      } else {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id != expenseId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialState: FilterState = {
    category: "",
    minCost: 0,
    maxCost: Infinity,
    startDate: "",
    endDate: "",
    type: "",
    userId: "",
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
      case "SET_TYPE":
        return { ...state, type: action.payload };
      case "SET_USER":
        return { ...state, userId: action.payload };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(filterReducer, initialState);

  const filteredExpenses = expenses.filter((expense) => {
    return (
      ((state.category === "" || expense.category === state.category) &&
        (state.type === "" || expense.type === state.type) &&
        state.userId === "") ||
      (expense.userId === state.userId &&
        (state.type === "" || expense.type === state.type) &&
        expense.value >= state.minCost &&
        expense.value <= state.maxCost &&
        (state.startDate === "" ||
          new Date(expense.date) >= new Date(state.startDate)) &&
        (state.endDate === "" ||
          new Date(expense.date) <= new Date(state.endDate)))
    );
  });

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        fetchExpenses,
        deleteExpense,
        setExpenses,
        filteredExpenses,
        dispatch,
        state,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
