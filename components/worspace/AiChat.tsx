import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import NavbarAiChat from "./aiChat/Navbar.aiChat";

const AiChat = () => {
  return (
    <>
      <ResizablePanel defaultSize={47} minSize={27} maxSize={67}>
        <div className="flex flex-col h-full items-center px-6 py-4">
          <NavbarAiChat />
        </div>
        {/* the ai chat section */}
       
      </ResizablePanel>
      <ResizableHandle />
    </>
  );
};

export default AiChat;
