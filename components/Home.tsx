import HeroSection from "./HeroSection";
import Navbar from "./Navbar";

const Home: React.FC = () => {
  return (
    <>
      <main
        style={{
          background:
            "linear-gradient(160deg, #000 0%, #00ffd5 20%, #000 40%, #000 60%, #00ff88 80%, #000 100%)",
        }}
        className="h-[100vh] w-full flex flex-col"
      >
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <HeroSection />
        </div>
      </main>
    </>
  );
};

export default Home;
