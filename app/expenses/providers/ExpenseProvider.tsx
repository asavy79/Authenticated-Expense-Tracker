"use client";
import { ExpenseType } from "@/actions/expenseActions";
import { ExpenseSubmitType } from "../page";
import React, { createContext, useState, useEffect } from "react";

type ExpenseContextType = {
  expenses: ExpenseType[];
  fetchExpenses: () => Promise<void>;
  addExpense: (
    expense: ExpenseSubmitType
  ) => Promise<{ success: string; error: null } | { error: string }>;
  deleteExpense: (expenseId: number) => Promise<void>;
};

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export const ExpenseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

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

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, fetchExpenses, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
