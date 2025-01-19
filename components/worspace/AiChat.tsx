"use client";
import { useState } from "react";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import NavbarAiChat from "./aiChat/Navbar.aiChat";
import ChatInput from "./aiChat/chat-input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useChatStore, Message, AIResponse } from "@/store/chatStore";

const AiChat = () => {
  const { messages } = useChatStore();

  const renderContent = (message: Message) => {
    if (message.role === "user") {
      return (
        <p className="text-sm text-zinc-100 mt-3">
          {message.content as string}
        </p>
      );
    }

    const content = message.content as AIResponse;
    return (
      <div className="space-y-4">
        {content.startingContent && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.startingContent}
            </ReactMarkdown>
          </div>
        )}

        {content.endingContent && (
          <div className="prose prose-invert max-w-none mt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.endingContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

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
                  className={`flex items-start gap-5 p-5 rounded-lg ${
                    message.role === "assistant" ? "bg-foreground/5" : ""
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
                  <div className="flex-1 min-w-0 text-sm ">{renderContent(message)}</div>
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
