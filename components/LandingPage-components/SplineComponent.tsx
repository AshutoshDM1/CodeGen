import SplineNext from "@splinetool/react-spline/next";

const SplineComponent = () => {
  return (
    <main>
      <SplineNext
        className="min-h-[100vh] w-full absolute top-20 z-[-10] overflow-hidden"
        scene="https://prod.spline.design/XAMw-bPTlleYGM07/scene.splinecode"
      />
    </main>
  );
};

export default SplineComponent;
