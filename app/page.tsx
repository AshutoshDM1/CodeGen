import Scene from '@/components/3d-sence';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <main
        style={{
          background:
            'linear-gradient(160deg, rgba(0,255,252,1) 0%, rgba(0,157,155,1) 0%, rgba(0,59,58,1) 12%, rgba(0,0,0,1) 17%, rgba(0,0,0,1) 36%, rgba(0,0,0,1) 59%, rgba(0,0,0,1) 83%, rgba(20,112,60,1) 92%, rgba(23,128,68,1) 94%, rgba(29,164,87,1) 100%, rgba(45,253,135,1) 100%)',
        }}
        className="w-full flex flex-col bg-black"
      >
        <Navbar />
        <div className="h-[95vh] w-full flex justify-center items-center overflow-hidden relative z-[10]">
          <HeroSection />
          <Scene />
        </div>
      </main>
    </>
  );
}
