"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HeroSection: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = () => {
    setIsLoading(true);
    if (session.status === "unauthenticated") {
      router.push("/auth/login");
    } else {
      router.push("/workspace");
    }
  };

  return (
    <div className="w-full flex flex-col justify-between items-center">
      <div className="text-center font-bold text-[40px] md:text-[55px] mt-5 md:mt-0 flex flex-col justify-between items-center text-white ">
        <div className="py-12 space-y-2">
          <h1>
            Your{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-green-300 text-transparent bg-clip-text">
              AI Powered
            </span>
          </h1>
          <h1>
            <span className="bg-gradient-to-r from-cyan-300 to-green-300 text-transparent bg-clip-text">
              Coding{" "}
            </span>
            Workspace
          </h1>
        </div>

        <div className="h-fit flex justify-center items-center flex-col max-w-3xl px-4">
          <p className="text-center font-sans font-light text-[20px] md:text-[23px] text-gray-200">
            Experience the future of coding with our AI-powered platform.
          </p>
          <p className="text-center font-sans font-light text-[20px] md:text-[23px] text-gray-200">
            Write, deploy, and collaborate in real-time with integrated AI
            assistance.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={onClick}
              className="px-6 text-black h-12 flex justify-center items-center text-center font-sans font-medium text-[18px] bg-white/90 rounded-[20px] cursor-pointer hover:bg-white transition"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Start Coding"
              )}
            </button>

            <button
              onClick={() => router.push("/features")}
              className="px-6 h-12 flex justify-center items-center text-center font-sans font-medium text-[18px] border-2 border-white/20 text-white rounded-[20px] cursor-pointer hover:bg-white/10 transition"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
