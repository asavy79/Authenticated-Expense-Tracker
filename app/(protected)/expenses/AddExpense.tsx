"use client";

import { addExpense } from "@/actions/expenseActions";
import { useState, useContext } from "react";
import { ExpenseSubmitType } from "./page";
import { ExpenseContext } from "./providers/ExpenseProvider";

export const AddExpense: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const expenseContext = useContext(ExpenseContext);

  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [transactionType, setTransactionType] = useState("");

  if (!expenseContext) return null;

  const { addAnExpense } = expenseContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: ExpenseSubmitType = {
      date: new Date(date),
      value: parseFloat(amount),
      category,
      type: transactionType,
      name: name,
    };
    const result = await addAnExpense(newExpense);

    // const result = await addExpense()

    if (result.error) {
      return;
    } else {
      setDate("");
      setAmount("");
      setCategory("");
      setName("");
      setTransactionType("");
      onAdd();
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <form
        onSubmit={handleSubmit}
        action="submit"
        className="bg-white p-4 rounded shadow-md mb-4 mt-5"
      >
        <h3>Add a Transaction</h3>
        <select
          value={transactionType}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
          onChange={(e) => {
            setTransactionType(e.target.value);
          }}
        >
          <option value="">Select Transaction Type</option>
          <option value="Expense">Expense</option>
          <option value="Revenue">Revenue</option>
        </select>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          placeholder="Amount..."
          value={amount}
          type="number"
          required
        />
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Title..."
          value={name}
          type="text"
          required
        />
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            setDate(e.target.value);
          }}
          placeholder="date"
          value={date}
          type="date"
          required
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {transactionType === "Expense" && (
            <>
              <option value="Affiliate Payout">Affiliate Payout</option>
              <option value="Transportation">Transportation</option>
              <option value="Paid Post">Paid Post</option>
              <option value="Banking Fee">Banking Fee</option>
              <option value="Pullout">Pullout</option>
              <option value="Company Expenses">Company Expense</option>
              <option value="Signup">Singup</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </>
          )}
          {transactionType === "Revenue" && (
            <>
              <option value="Sports Book Payout">Sports Book Payout</option>
              <option value="Alcohol Revenue">Alcohol Revenue</option>
              <option value="Ticket Sales">Ticket Sales</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </>
          )}
        </select>
        <button
          className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          type="submit"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};
