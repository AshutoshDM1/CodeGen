import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CodeGen",
  description:
    "CodeGen is a Modern Web Based Coding Platefrom which use make you code less and develop fast",
  icons:
    "https://res.cloudinary.com/dnvl8mqba/image/upload/v1733239329/CodeGen/codegen_kf1lk0.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
