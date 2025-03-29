"use client";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useChatStore, Message, AIResponse } from "@/store/chatStore";
import NavbarAiChat from "./aiChat-components/Navbar.aiChat";
import ChatInput from "./aiChat-components/chat-input";
import AnimatedGradientBackground from "../ui/animated-gradient-background";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const AiChat = () => {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderContent = (message: Message) => {
    if (message.role === "user") {
      return (
        <p className="text-sm  text-zinc-100 mt-3">
          {message.content as string}
        </p>
      );
    }

    const content = message.content as AIResponse;
    return (
      <div className="space-y-4 rounded-lg  ">
        {content.startingContent && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.startingContent}
            </ReactMarkdown>
            <br />
          </div>
        )}

        {content.endingContent && (
          <div className="prose prose-invert max-w-none mt-4">
            <br />
            {content.endingContent}
            <br />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={true}>
        <ResizablePanel defaultSize={47} minSize={27} maxSize={67}>
          <div className="flex flex-col h-full items-center px-6 py-4 ease-in-out duration-300 overflow-x-hidden ">
            <AnimatedGradientBackground />
            <NavbarAiChat />
            <div className="h-full w-full flex flex-col text-white justify-between overflow-y-auto pr-5 ai-chat-scrollbar">
              <div className="flex-1 space-y-4 mt-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-5 p-5 rounded-lg ${
                      message.role === "assistant"
                        ? "backdrop-blur-md bg-zinc-900/20"
                        : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarImage
                        className="rounded-full h-8 w-9"
                        src={
                          message.role === "user" ? "/user.jpg" : "/codegen.png"
                        }
                        alt={message.role}
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "CN" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-sm  ">
                      {renderContent(message)}
                    </div>
                  </div>
                ))}
                {/* This empty div is used as a reference to scroll to */}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
      </AnimatePresence>
    </>
  );
};

export default AiChat;
