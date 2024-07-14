import { SessionProvider } from "next-auth/react";
import React from "react";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <div className="flex flex-col">
        <div className="flex space-x-5 justify-center m-l-3 m-r-3">
          <form
            className="mt-5"
            action={async () => {
              "use server";
              await signOut({ redirect: false });
              return redirect("/auth/login");
            }}
          >
            <button
              className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white transition duratoin-65"
              type="submit"
            >
              Sign Out
            </button>
          </form>
          <form
            className="mt-5"
            action={async () => {
              "use server";
              return redirect("/expenses");
            }}
          >
            <button
              className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg text-white transition duratoin-65"
              type="submit"
            >
              Expenses
            </button>
          </form>
        </div>
        {children}
      </div>
    </SessionProvider>
  );
};

export default Layout;
