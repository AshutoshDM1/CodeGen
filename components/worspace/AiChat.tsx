import { useState } from "react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import NavbarAiChat from "./aiChat/Navbar.aiChat";
import ChatInput from "./aiChat/chat-input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "ai";
  content: string;
}

const AiChat = () => {
  const [messages] = useState<Message[]>([
    {
      role: "user",
      content: "Explain me this code and output the result",
    },
    {
      role: "ai",
      content: `
## **Output**
The \`CodeEditor\` component renders a code editor interface with:
1. A **header** (navbar) at the top.
2. A horizontally **split view**:
   - Left panel: **File Explorer**.
   - Right panel: **Code Editor** (with Monaco Editor).
3. Fully **resizable layout**:
   - Users can adjust the sizes of the File Explorer and Editor panels.`,
    },
  ]);
  // const [input, setInput] = useState<string>("");

  // const handleSend = () => {
  //   if (input.trim()) {
  //     setMessages([...messages, { role: "user", content: input.trim() }]);
  //     setInput("");
  //   }
  // };

  return (
    <>
      <ResizablePanel defaultSize={47} minSize={27} maxSize={67}>
        <div className="flex flex-col h-full items-center px-6 py-4">
          <NavbarAiChat />
          <div className="h-full w-full flex flex-col text-white justify-between overflow-y-auto">
            <div className="flex-1 space-y-4 mt-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5 pl-5 py-5 bg-foreground/5 rounded-lg"
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        message.role === "user"
                          ? "https://github.com/shadcn.png"
                          : "/logo.png"
                      }
                    />
                    <AvatarFallback>
                      {message.role === "user" ? "CN" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  {message.role === "ai" ? (
                    <div className="mt-5 prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-100 mt-3 ">
                      {message.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <ChatInput />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </>
  );
};

export default AiChat;
