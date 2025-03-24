"use client";
import { signOut } from "next-auth/react";

const Navbar = () => {
  return (
    <div className="h-[5vh] w-full bg-[#121212] flex justify-between px-4">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-[#121212]  text-[#fff] px-4 py-2 rounded-[5px]"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Navbar;
