import { Spotlight } from '../ui/spotlight-new';
import GetButton from './GetButton';
import Navbar from './Navbar';
import SplineComponent from './SplineComponent';

const MainPage = () => {
  return (
    <>
      <div className="w-full h-[100vh] relative z-10  overflow-hidden bg-black ">
        <Spotlight />
        <SplineComponent />
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-[50px] sm:text-[85px] md:text-[100px] lg:text-[230px] font-[sans-serif] font-bold mb-2 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-600 via-white to-gray-600 ">
              Codegen
            </span>
          </h1>
          <p className="text-[20px] md:text-[24px] text-center text-gray-300 mb-2 px-2">
            AI Powered Coding Workspace
          </p>
          <p className="text-[20px] md:text-[24px] text-center text-gray-300 mb-12 px-2">
            Build Landing Pages, Web Apps, and more with AI
          </p>
          <GetButton />
        </div>
      </div>
    </>
  );
};

export default MainPage;
