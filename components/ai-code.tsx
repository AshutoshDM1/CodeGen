"use client";
import { useChatStore } from "@/app/store/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const { messages, addMessage } = useChatStore();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/chat");
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to get reader from response");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        addMessage(chunk);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md"
        onClick={fetchData}
      >
        Start Chat
      </button>
      <div className="mt-4 space-y-2 text-white bg-gray-700 p-4 rounded-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {messages.join("")}
        </ReactMarkdown>
      </div>
    </div>
  );
}
