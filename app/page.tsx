"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const session = useSession();
  console.log(session);

  return (
    <div className="flex min-h-screen items-center justify-center text-white ">
      <button
        onClick={() => signOut()}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Sign Out
      </button>
    </div>
  );
}
