import React from "react";
import { signOut, auth } from "@/auth";
import { redirect } from "next/navigation";
import { FaUser, FaTachometerAlt, FaLock } from "react-icons/fa";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = session?.user ? session.user : null;

  return (
    <div className="flex h-screen">
      <div className="fixed w-1/5 bg-gray-800 h-full text-white flex flex-col items-center p-4 space-y-10">
        <img
          className="min-w-min mb-6"
          src="/astraLogo.webp"
          alt="Astra Logo"
        />
        <form
          className="w-full"
          action={async () => {
            "use server";
            return redirect("/profile");
          }}
        >
          <button
            className="p-3 rounded-lg text-white transition duration-65 flex items-center"
            type="submit"
          >
            <FaUser className="mr-2" />
            Profile
          </button>
        </form>
        <form
          className="w-full"
          action={async () => {
            "use server";
            return redirect("/expenses");
          }}
        >
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center"
            type="submit"
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </button>
        </form>
        <form
          className="mb-4 w-full"
          action={async () => {
            "use server";
            await signOut({ redirect: false });
            return redirect("/auth/login");
          }}
        >
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center"
            type="submit"
          >
            <FaLock className="mr-3" />
            Sign Out
          </button>
        </form>
      </div>

      <div className="ml-1/5 flex">
        <div className="flex flex-col w-full p-6">
          <div className="flex p-5 justify-end">
            <form
              action={async () => {
                "use server";
                return redirect("/profile");
              }}
            >
              <button className="flex items-center" type="submit">
                <img
                  src={user?.image ? user.image : "baseProfile.webp"}
                  alt="Profile Picture"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <h3>{user?.name}</h3>
              </button>
            </form>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
