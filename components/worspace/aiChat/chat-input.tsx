"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, ArrowUp } from "lucide-react";
import { X } from "lucide-react";
import { messageuser } from "@/services/api";
import { useChatStore } from "@/store/chatStore";
import { useState } from "react";

interface AIMessage {
  beforeMsg: string;
  boltArtifact: {
    title: string;
    fileActions: Array<{
      type: "file";
      filePath?: string;
      content: string;
    }>;
    shellActions: Array<{
      type: "shell";
      content: string;
    }>;
  };
  afterMsg: string;
}

export default function ChatInput() {
  const {
    // messages,
    addMessage,
    isLoading,
    setIsLoading,
    addAIbeforeMsg,
    addAIafterMsg,
  } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  let buffer = "";
  let buferAfter = "";
  const fetchData = async () => {
    try {
      const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const response = await fetch(`${URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageuser),
      });

      if (!response.body) throw new Error("No response body");
      const message: AIMessage = {
        beforeMsg: "",
        boltArtifact: {
          title: "",
          fileActions: [],
          shellActions: [],
        },
        afterMsg: "",
      };
      addMessage({
        role: "assistant",
        content: {
          startingContent: "",
          projectFiles: {},
          endingContent: "",
        },
      });

      const reader = response.body.getReader();
      let isBefore = false;
      let isInsideArtifact = false;
      let isInsideFileAction = false;
      let isInsideShellAction = false;
      let currentFileAction = {
        type: "file" as const,
        filePath: "",
        content: "",
      };
      let currentShellAction = { type: "shell" as const, content: "" };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        buffer += chunk;
        if (chunk.includes("<")) {
          isBefore = true;
        }

        if (!isInsideArtifact && !isBefore) {
          addAIbeforeMsg(chunk);
        }

        if (buffer.includes("<boltArtifact")) {
          const artifactMatch = buffer.match(
            /<boltArtifact id="([^"]*)" title="([^"]*)">/
          );
          if (artifactMatch) {
            isInsideArtifact = true;
            message.boltArtifact.title = artifactMatch[2];
            message.beforeMsg = buffer.split("<boltArtifact")[0];
            buffer = buffer.substring(buffer.indexOf(">") + 1);
          }
        }

        if (isInsideArtifact && buffer.includes('<boltAction type="file"')) {
          isInsideFileAction = true;
          currentFileAction = { type: "file", filePath: "", content: "" };
          const filePathMatch = buffer.match(/filePath="([^"]*)"/);
          if (filePathMatch) {
            currentFileAction.filePath = filePathMatch[1];
            buffer = buffer.substring(buffer.indexOf(">") + 1);
          }
        }

        if (isInsideArtifact && buffer.includes('<boltAction type="shell"')) {
          isInsideShellAction = true;
          currentShellAction = { type: "shell", content: "" };
          buffer = buffer.substring(buffer.indexOf(">") + 1);
        }

        if (isInsideFileAction) {
          currentFileAction.content += chunk;
        }

        if (isInsideFileAction && buffer.includes("</boltAction>")) {
          currentFileAction.content = buffer.split("</boltAction>")[0].trim();
          message.boltArtifact.fileActions.push({ ...currentFileAction });
          isInsideFileAction = false;
          buffer = buffer.substring(buffer.indexOf("</boltAction>") + 13);
        }

        if (isInsideShellAction && buffer.includes("</boltAction>")) {
          currentShellAction.content = buffer.split("</boltAction>")[0].trim();
          message.boltArtifact.shellActions.push({ ...currentShellAction });
          isInsideShellAction = false;
          buffer = buffer.substring(buffer.indexOf("</boltAction>") + 13);
        }

        if (buffer.includes("</boltArtifact>")) {
          buferAfter = buffer.split("</boltArtifact>")[1] || "";
          buferAfter = buferAfter.replace(/^[>\s]+/, "").trim();
          if (buferAfter) {
            addAIafterMsg(chunk);
          }
        }
      }
      console.log(message);
      return message;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    addMessage({ role: "user", content: inputValue });
    setInputValue("");

    try {
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg pt-1">
      {/* Premium Banner */}
      <div className="flex items-center justify-between px-4 pt-2 mb-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-sm text-zinc-100">
          Need more messages? Get higher limits with Premium.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="h-7 bg-emerald-400 hover:bg-emerald-500"
          >
            Upgrade Plan
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Chat Input */}
      <Card className="border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col items-start px-1 py-2">
          <div className="flex items-center gap-2 w-full">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSubmit();
                }
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Ask CodeGen AI a question..."
            />
            <div className="flex items-center gap-2">
              <Button
                disabled={isLoading}
                variant="ghost"
                className="h-8 bg-zinc-900 hover:bg-zinc-800"
                onClick={handleSubmit}
              >
                {isLoading ? "Sending..." : "Submit"}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="h-5 w-5 flex items-center justify-center font-bold">
                ⌘
              </span>
              <span className="sr-only">Command</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
