"use client";

import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading")
    return (
      <div className="text-center mt-5">
        <BeatLoader />
      </div>
    );

  const onClick = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-cover bg-center">
      <div className="flex flex-col items-center justify-center h-full py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <div className="mb-4">
            <img
              src={
                session.data?.user?.image !== null
                  ? session.data?.user?.image
                  : "defaultProfile.png"
              }
              alt="Profile Picture"
              className="w-24 h-24 rounded-full mx-auto shadow-md"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {session?.data?.user?.name}
          </h3>
          <p className="text-gray-600">{session?.data?.user?.email}</p>
          <p className="text-gray-600"></p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/settings")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={onClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Sign Out
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push("/expenses")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Expenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
