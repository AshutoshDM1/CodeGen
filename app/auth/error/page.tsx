"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred";
  if (error === "CredentialsSignin") {
    errorMessage = "Invalid email or password";
  } else if (error === "Email already exists") {
    errorMessage = "An account with this email already exists";
  } else if (error === "Missing fields") {
    errorMessage = "Please fill in all required fields";
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Authentication Error
        </h1>
        <p className="text-red-500">{errorMessage}</p>
        <Link className="hover:underline" href="/auth/login">
          Go back to login
        </Link>
      </div>
    </div>
  );
}
