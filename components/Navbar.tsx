'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = () => {
    setIsLoading(true);
    if (session?.user?.name) {
      router.push('/workspace');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <>
      <div className="h-[4vh] w-full flex justify-center items-center select-none mt-[1vh] relative z-[10]  ">
        <div className="h-full max-w-[43rem] mx-auto w-full flex justify-between items-center px-1 py-1  text-white rounded-[25px] backdrop-blur-sm ">
          <div className="font-[500] text-[20px] font-[Mona Sans] flex justify-center items-center gap-1 pl-2  cursor-pointer">
            <Image
              className="object-cover w-[33px] mb-1 "
              src="/codegen.png"
              alt="logo"
              width={33}
              height={33}
            />
            CodeGen
          </div>
          <div className="font-[100] letter- text-[15px] text-[#fff] hidden md:flex justify-evenly w-[45vh] ">
            <h1 className="cursor-pointer ">Explore</h1>
            <h1 className="cursor-pointer ">Features</h1>
            <h1 className="cursor-pointer ">Github</h1>
            <h2 className="cursor-pointer">Docs</h2>
          </div>
          <div className="h-full flex justify-center items-center ">
            <button
              onClick={onClick}
              disabled={isLoading}
              className="h-full w-32 font-[500] text-[15px] text-[#000] cursor-pointer bg-slate-50 px-[17px]  rounded-[30px] flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
              ) : session?.user?.name ? (
                'Get Started'
              ) : (
                'Login'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
