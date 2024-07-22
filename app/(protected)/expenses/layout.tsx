"use client";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { FaUser, FaTachometerAlt, FaLock, FaList } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, status } = useSession();

  const [sessionData, setSessionData] = useState(data);

  useEffect(() => {
    setSessionData(data);
  }, [data]);

  const router = useRouter();

  const loading = status === "loading";

  const user = sessionData?.user;

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="lg:fixed w-full lg:w-1/5 bg-gray-800 h-full text-white flex flex-col items-center p-4 space-y-4 lg:space-y-10">
        <img
          className="min-w-min mb-6"
          src="/astraLogo.webp"
          alt="Astra Logo"
        />
        <div className="w-full">
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center justify-center lg:justify-start"
            onClick={() => router.push("/profile")}
          >
            <FaUser className="mr-3" />
            Profile
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center justify-center lg:justify-start"
            onClick={() => router.push("/expenses")}
          >
            <FaTachometerAlt className="mr-3" />
            Dashboard
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center justify-center lg:justify-start"
            onClick={() => router.push("/expenses/list")}
          >
            <FaList className="mr-3" />
            Transactions
          </button>
        </div>
        <div className="w-full">
          <button
            className="w-full p-3 rounded-lg text-white transition duration-65 flex items-center justify-center lg:justify-start"
            onClick={() => signOut()}
          >
            <FaLock className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="lg:ml-1/5 flex flex-grow">
        <div className="flex flex-col w-full p-4 lg:p-6">
          <div className="flex p-5 justify-end">
            {loading ? (
              <div>Loading...</div>
            ) : user ? (
              <button
                className="flex items-center"
                onClick={() => {
                  router.push("/profile");
                }}
              >
                <img
                  src={user?.image ? `/${user.image}` : "baseProfile.webp"}
                  alt="Profile Picture"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <h3>{user?.name}</h3>
              </button>
            ) : (
              <div>Null</div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
