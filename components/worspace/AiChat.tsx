import { useState } from "react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import NavbarAiChat from "./aiChat/Navbar.aiChat";

const AiChat = () => {
  const [messages, setMessages] = useState<string[]>(["CodeGen - Hi HelloHow are you?"]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };
  return (
    <>
      <ResizablePanel defaultSize={47} minSize={27} maxSize={67}>
        <div className="flex flex-col h-full items-center px-6 py-4">
          <NavbarAiChat />
              {/* the ai chat section */}
          <div className="h-full w-full  flex flex-col text-white justify-between">
            
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2 p-2 rounded shadow">
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex items-center p-2">
              <input
                type="text"
                className="flex-grow p-2 border rounded focus:outline-none "
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </>
  );
};

export default AiChat;
