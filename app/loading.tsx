export default async function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#000000]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin" />
          <div className="w-20 h-20 border-4 border-l-transparent border-green-400 rounded-full  absolute top-0 animate-[spin_1.5s_linear_infinite]" />
          <div className="w-20 h-20 border-4 border-r-transparent border-white/50 rounded-full  absolute top-0 animate-[spin_2s_linear_infinite]" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className=" text-xl font-medium bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            Loading
          </div>
          <div className="flex gap-1">
            <div
              className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
