import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div>{children}</div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
