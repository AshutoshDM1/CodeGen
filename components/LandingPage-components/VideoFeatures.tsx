import { HoverBorderGradient } from '../ui/hover-border-gradient';

export default function VideoFeatures() {
  return (
    <section className="mt-20 w-full bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-blue-100 leading-tight">
            Feel the power of Gemini 2.5 pro in action with the help of CodeGen AI. This GenAI agent
            is capable of generating code with the help of your one prompt.
          </h2>
        </div>

        {/* Video placeholder - to be added manually */}
        <HoverBorderGradient
          containerClassName="rounded-md"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          <video className="rounded-md" src="/Jujutsu Kaisen AMV Cut.mp4" autoPlay muted loop />
        </HoverBorderGradient>
      </div>
    </section>
  );
}
