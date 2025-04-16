'use client';
import { Dot, Menu, X } from 'lucide-react';
import { useState } from 'react';

const HeroSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-[100vh] bg-black relative z-[0] overflow-hidden">
      <nav className="absolute top-0 w-full py-6 px-8 flex justify-center items-center">
        {/* Mobile hamburger */}
        <div className="md:hidden absolute right-6 top-6 z-30">
          <button
            onClick={toggleMenu}
            className="p-2 bg-[#1e1e1e80] border-[1px] border-[#3d3d3d8f] backdrop-blur-sm rounded-full"
          >
            {isMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-20 md:hidden">
            <div className="flex flex-col items-center gap-6">
              <NavItem text="Docs" />
              <NavItem text="Pricing" />
              <NavItem text="Github" />
              <NavItem text="About" />
              <NavItem text="Login" />
            </div>
          </div>
        )}

        {/* Desktop menu */}
        <div className="hidden md:flex items-center justify-center gap-2 border-[2px] border-[#3d3d3d8f] rounded-full p-2 px-3 backdrop-blur-sm">
          <NavItem text="Docs" />
          <NavItem text="Pricing" />
          <NavItem text="Github" />
          <NavItem text="About" />
          <NavItem text="Login" />
        </div>
      </nav>
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <h1 className="text-[85px] md:text-[230px] font-[sans-serif] font-bold mb-2">Codegen</h1>
        <p className="text-[20px] md:text-[24px] text-gray-300 mb-12">
          AI Powered Coding Workspace
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition">
          Try Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;

function NavItem({ text }: { text: string }) {
  return (
    <button className="flex items-center gap-0 border-[2px] border-transparent group hover:border-[#3b3b3bd5] transition-all duration-200 rounded-full py-1 pr-5">
      <span className="text-gray-500 text-2xl group-hover:text-green-500 transition-all duration-300 delay-100">
        <Dot size={36} />
      </span>
      <h1 className="text-gray-300 transition-all duration-300 group-hover:text-white font-medium font-[system-ui] hover:text-white text-[14px] line-height-[24px] flex items-start justify-start mb-1">
        {text}
      </h1>
    </button>
  );
}
