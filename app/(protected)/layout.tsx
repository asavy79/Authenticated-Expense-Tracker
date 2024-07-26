import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ExpenseContextProvider } from "./expenses/providers/ExpenseProvider";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <ExpenseContextProvider>
        <div>{children}</div>
      </ExpenseContextProvider>
    </SessionProvider>
  );
};

export default ProtectedLayout;
