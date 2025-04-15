import Navbar from '@/components/LandingPage-components/Navbar';
import SplineComponent from '@/components/LandingPage-components/SplineComponent';
import GetButton from '@/components/LandingPage-components/GetButton';
import BgLight from '@/components/LandingPage-components/Bg-Light';
import { AuroraBackground } from '@/components/ui/aurora-background';
//https://prod.spline.design/XAMw-bPTlleYGM07/scene.splinecode
export default function Home() {
  return (
    <>
      <main>
        {/* <BgLight blur={true} /> */}

        <div className="w-full h-[100vh] absolute top-0 z-[20] overflow-hidden bg-black ">
        <div></div>
        
          <SplineComponent />
          <Navbar />
          <div className=" flex flex-col justify-center items-center h-screen ">
            <h1 className="text-[85px] md:text-[230px] font-[sans-serif] font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-600 to-white">
                Codegen
              </span>
            </h1>
            <p className="text-[20px] md:text-[24px] text-gray-300 mb-2">
              AI Powered Coding Workspace
            </p>
            <p className="text-[20px] md:text-[24px] text-gray-300 mb-12">
              Build Landing Pages, Web Apps, and more with AI
            </p>
            <GetButton />
          </div>
        </div>
      </main>
    </>
  );
}
