"use client";
import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useChatStore, Message, AIResponse } from "@/store/chatStore";
import NavbarAiChat from "./aiChat-components/Navbar.aiChat";
import ChatInput from "./aiChat-components/chat-input";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { MorphingText } from "../magicui/morphing-text";
import { AIMarkdownParser } from "../ui/ai-markdown-parser";
import { Switch } from "../ui/switch";

const AiChat = ({ projectId }: { projectId: string | null }) => {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [useCustomParser, setUseCustomParser] = useState(true);

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
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-zinc-100 mt-3 whitespace-pre-wrap"
        >
          {typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content)}
        </motion.p>
      );
    }

    const content = message.content as AIResponse;
    return (
      <div className="space-y-4 rounded-lg">
        {content.startingContent && (
          <div className="prose prose-invert">
            {useCustomParser ? (
              <AIMarkdownParser
                content={content.startingContent}
                animate={showTypewriter}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.startingContent}
              </ReactMarkdown>
            )}
          </div>
        )}

        {content.endingContent && (
          <div className="prose prose-invert max-w-none mt-4">
            {useCustomParser ? (
              <AIMarkdownParser
                content={content.endingContent}
                animate={showTypewriter}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.endingContent}
              </ReactMarkdown>
            )}
          </div>
        )}
      </div>
    );
  };

  const words = [
    {
      text: "Start",
    },
    {
      text: "the",
    },
    {
      text: "conversation",
    },
    {
      text: "with",
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait" initial={true}>
        <ResizablePanel
          defaultSize={47}
          minSize={27}
          maxSize={67}
          key="resizable-panel"
        >
          <div className="flex flex-col h-full items-center px-6 py-4 ease-in-out duration-300 overflow-x-hidden">
            <div className="w-full flex items-center justify-between">
              <NavbarAiChat projectId={projectId} />

              {/* Display options */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="custom-parser"
                    checked={useCustomParser}
                    onCheckedChange={setUseCustomParser}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <span className="text-xs text-zinc-300">Custom Parser</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="typewriter-mode"
                    checked={showTypewriter}
                    onCheckedChange={setShowTypewriter}
                    className="data-[state=checked]:bg-green-500"
                  />
                  <span className="text-xs text-zinc-300">Animations</span>
                </div>
              </div>
            </div>

            <div className="h-full w-full flex flex-col text-white justify-center overflow-y-auto pr-5 ai-chat-scrollbar">
              {projectId === null ? (
                <motion.div
                  key="welcome-screen"
                  className="flex flex-col items-center justify-center"
                >
                  <TypewriterEffectSmooth words={words} />
                  <MorphingText texts={["Codegen AI", "Your AI assistant"]} />
                </motion.div>
              ) : null}

              <div
                className={`${
                  projectId === null ? "hidden" : ""
                }  space-y-4 mt-5`}
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={`message-${index}-${message.role}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
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
                    <div className="flex-1 min-w-0 text-sm">
                      {renderContent(message)}
                    </div>
                  </motion.div>
                ))}
                {/* This empty div is used as a reference to scroll to */}
                <div ref={messagesEndRef} />
              </div>
              <ChatInput projectId={projectId} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle key="resizable-handle" />
      </AnimatePresence>
    </>
  );
};

export default AiChat;
