"use client";
import { useState } from "react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import NavbarAiChat from "./aiChat/Navbar.aiChat";
import ChatInput from "./aiChat/chat-input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useChatStore } from "@/store/chatStore";

const AiChat = () => {
  const { messages } = useChatStore();

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
                      className="rounded-full h-8 w-9"
                      src={
                        message.role === "user"
                          ? "/user.jpg"
                          : "/codegen.png"
                      }
                      // crossOrigin="anonymous"
                      alt={message.role}
                    />
                    <AvatarFallback>
                      {message.role === "user" ? "CN" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  {message.role === "assistant" ? (
                    <div className="mt-5 prose prose-invert max-w-none">
                      <p></p>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-100 mt-3 "></p>
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
