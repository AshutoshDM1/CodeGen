import Link from 'next/link';

const GetButton = () => {
  return (
    <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 pointer-events-auto">
      <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white dark:bg-gray-950 text-xs font-medium backdrop-blur-3xl">
          <Link
            href="/workspace"
            className="text-xl inline-flex rounded-full text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 text-gray-900 dark:text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 transition-all sm:w-auto py-4 px-10"
          >
            Try Now
          </Link>
        </div>
      </span>
    </div>
  );
};

export default GetButton;
