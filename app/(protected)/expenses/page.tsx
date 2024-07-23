"use client";
import { ExpenseList } from "./ExpenseList";
import { DoughnutChart } from "./DoughnutChart";
import { BarChart } from "./BarChart";
import { ExpenseTotal } from "./ExpenseTotal";
import { ExpenseFilters } from "./ExpenseFilters";

export type ExpenseSubmitType = {
  name: string;
  category: string;
  date: Date;
  value: number;
  type: string;
};

const ExpensePage = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <ExpenseTotal />
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <ExpenseFilters width="sm" />
          </div>
          <div className="w-full md:w-1/2">
            <ExpenseList />
          </div>
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <DoughnutChart />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
