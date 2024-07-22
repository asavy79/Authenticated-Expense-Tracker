import { useContext } from "react";
import { ExpenseContext } from "./providers/ExpenseProvider";

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

type ExpenseFilterProps = {
  width: "sm" | "lg";
};

export const ExpenseFilters = ({ width }: ExpenseFilterProps) => {
  const context = useContext(ExpenseContext);
  if (!context) return null;
  const { expenses, dispatch, filteredExpenses, state } = context;

  const handleFilterReset = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "RESET" });
  };

  const userMap = new Map<string, { userId: string; name: string }>();

  expenses.forEach((expense) => {
    const userId = expense.user.id;
    const userName = expense.user.name;

    if (!userMap.has(userId)) {
      userMap.set(userId, { userId, name: userName ? userName : "Name" });
    }
  });

  const userList = Array.from(userMap.values());

  return (
    <div className="mb-10 shadow-xl p-6 bg-white rounded-lg w-full mx-auto">
      <h3 className="text-blue-600 mb-4 text-xl font-semibold">Filters</h3>
      <div
        className={
          width === "sm"
            ? `grid grid-cols-1 md:grid-cols-2 gap-4`
            : `grid grid-cols-1 md:grid-cols-7 gap-4`
        }
      >
        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">Type</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.type}
            onChange={(e) =>
              dispatch({ type: "SET_TYPE", payload: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="Expense">Expenses</option>
            <option value="Revenue">Revenue</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">Category</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.category}
            onChange={(e) =>
              dispatch({ type: "SET_CATEGORY", payload: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {state.type === "Expense" && (
              <>
                <option value="Affiliate Payout">Affiliate Payout</option>
                <option value="Transportation">Transportation</option>
                <option value="Paid Post">Paid Post</option>
                <option value="Banking Fee">Banking Fee</option>
                <option value="Pullout">Pullout</option>
                <option value="Company Expense">Company Expense</option>
                <option value="Sign Up">Sign Up</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </>
            )}
            {state.type === "Revenue" && (
              <>
                <option value="Sports Book Payout">Sports Book Payout</option>
                <option value="Alcohol Revenue">Alcohol Revenue</option>
                <option value="Ticket Sales">Ticket Sales</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </>
            )}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">User</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={state.userId}
            onChange={(e) =>
              dispatch({ type: "SET_USER", payload: e.target.value })
            }
          >
            <option value="">Select User</option>
            {userList.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">Min Cost</label>
          <input
            type="number"
            value={state.minCost}
            onChange={(e) =>
              dispatch({
                type: "SET_MIN_COST",
                payload: Number(e.target.value),
              })
            }
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min Cost"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">Max Cost</label>
          <input
            type="number"
            value={state.maxCost}
            onChange={(e) =>
              dispatch({
                type: "SET_MAX_COST",
                payload: Number(e.target.value),
              })
            }
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max Cost"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">Start Date</label>
          <input
            type="date"
            value={state.startDate}
            onChange={(e) =>
              dispatch({ type: "SET_START_DATE", payload: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-800 mb-1 font-medium">End Date</label>
          <input
            type="date"
            value={state.endDate}
            onChange={(e) =>
              dispatch({ type: "SET_END_DATE", payload: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        className={`mt-4 ${
          width === "lg" ? "text-center" : "w-full"
        } bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold`}
        onClick={handleFilterReset}
      >
        Reset Filters
      </button>
    </div>
  );
};
