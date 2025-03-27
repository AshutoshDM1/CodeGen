"use client";

import LoadingAnimation from "@/components/LoadingAnimation";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#000000]">
      <LoadingAnimation size={120} />
    </div>
  );
}
