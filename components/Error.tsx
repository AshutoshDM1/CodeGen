"use client";
import { useSearchParams } from "next/dist/client/components/navigation";
import Link from "next/link";
import React from "react";

const ErrorComponent = () => {
  const error = useSearchParams().get("error");
  return (
    <div className="rounded-lg p-12 text-center backdrop-blur-[40px] border border-red-500/20 shadow-2xl shadow-red-500/20">
      <div className="mb-6  animate-pulse">
        <svg
          className="w-20 h-20 mx-auto text-red-500 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
        Authentication Error
      </h1>
      <p className="text-gray-300 pb-8 text-lg">
        {error || "An error occurred during authentication"}
      </p>
      <Link
        className="px-6 py-3 text-white font-medium bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity"
        href="/auth/login"
      >
        Return to Login
      </Link>
    </div>
  );
};

export default ErrorComponent;
