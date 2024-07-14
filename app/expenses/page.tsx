"use client";
import { AddExpense } from "./AddExpense";
import { ExpenseList } from "./ExpenseList";
import { ExpenseContextProvider } from "./providers/ExpenseProvider";
import { DoughnutChart } from "./DoughnutChart";
import { BarChart } from "./BarChart";
import { ExpenseTotal } from "./ExpenseTotal";

export type ExpenseSubmitType = {
  name: string;
  category: string;
  date: Date;
  value: number;
  type: string;
};

const ExpensePage = () => {
  const onAdd = () => {};

  return (
    <ExpenseContextProvider>
      <div className="flex flex-col">
        <ExpenseTotal />
        <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-2 md:grid-cols-2 gap-4 p-4">
          <AddExpense onAdd={onAdd} />
          <ExpenseList />
          <DoughnutChart />
          <BarChart />
        </div>
      </div>
    </ExpenseContextProvider>
  );
};

export default ExpensePage;
