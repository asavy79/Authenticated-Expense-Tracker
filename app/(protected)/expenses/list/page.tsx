"use client";
import { ExpenseListFull } from "../ExpenseListFull";
import { AddExpense } from "../AddExpense";
import { ExpenseFilters } from "../ExpenseFilters";
import { useState } from "react";
import Modal from "../Modal";

const ExpenseListPage = () => {
  const [addingExpense, setAddingExpense] = useState(false);

  const handleClick = () => {
    setAddingExpense(!addingExpense);
  };

  return (
    <div>
      <div>
        <ExpenseFilters width="lg" />
        <div className="text-center">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            onClick={handleClick}
          >
            Add Transaction
          </button>
        </div>

        <ExpenseListFull />
      </div>
      {addingExpense && (
        <Modal onClose={() => setAddingExpense(false)}>
          <AddExpense
            onAdd={() => {
              setAddingExpense(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ExpenseListPage;
