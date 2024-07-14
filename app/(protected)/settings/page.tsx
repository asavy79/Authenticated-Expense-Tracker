import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth();

  return (
    <div className="flex flex-col items-center">
      {JSON.stringify(session)}
      <form
        className="mt-5"
        action={async () => {
          "use server";
          await signOut({ redirect: false });
          return redirect("/auth/login");
        }}
      >
        <button
          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white transition duratoin-65"
          type="submit"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
