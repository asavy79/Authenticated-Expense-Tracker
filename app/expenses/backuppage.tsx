"use client";
import { AddExpense } from "./AddExpense";
import { ExpenseList } from "./ExpenseList";
import { useState } from "react";
import { ExpenseContextProvider } from "./providers/ExpenseProvider";

export type ExpenseSubmitType = {
  name: string;
  category: string;
  date: Date;
  value: number;
  type: string;
};

const ExpensePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <ExpenseContextProvider>
      <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-2 md:grid-cols-2 gap-4 p-4">
        <AddExpense onAdd={handleAdd} />
        <ExpenseList key={refreshKey} />
      </div>
    </ExpenseContextProvider>
  );
};

export default ExpensePage;
