"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};
