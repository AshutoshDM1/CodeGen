"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Paperclip, ArrowUp } from "lucide-react";
import { X } from "lucide-react";
import { messageuser } from "@/services/api";
import {
  useChatStore,
  useEditorCode,
  useFilePaths,
  useFileExplorer,
  findFileContent,
} from "@/store/chatStore";
import { useState } from "react";
import { ShinyButton } from "@/components/magicui/shiny-button";

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
  const { setFileupdating } = useFilePaths();
  const { addMessage, isLoading, setIsLoading, addAIbeforeMsg, addAIafterMsg } =
    useChatStore();
  const { EditorCode, setEditorCode } = useEditorCode();
  const [inputValue, setInputValue] = useState("");
  const { setFilePaths } = useFilePaths();
  const { addFileByAI } = useFileExplorer();
  let buffer = "";
  let buferAfter = "";
  const fetchData = async () => {
    try {
      const URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://codegen-server-yuxj.onrender.com";
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

      setFileupdating(false);
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
      let accumulatedContent = "";

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
          accumulatedContent = ""; // Reset accumulated content
          const filePathMatch = buffer.match(/filePath="([^"]*)"/);
          if (filePathMatch) {
            currentFileAction.filePath = filePathMatch[1];

            // Check if file exists, if not create it
            const fileExists = findFileContent(
              EditorCode,
              currentFileAction.filePath
            );
            if (!fileExists && currentFileAction.filePath) {
              const filename =
                currentFileAction.filePath.split("/").pop() || "";
              // Create the file and open its parent folders
              addFileByAI(currentFileAction.filePath, filename);
              // Set the current file path
              setFilePaths(currentFileAction.filePath);
            }

            // Initialize with empty content
            if (currentFileAction.filePath) {
              setFilePaths(currentFileAction.filePath);
              setEditorCode(currentFileAction.filePath, "");
            }

            buffer = buffer.substring(buffer.indexOf(">") + 1);
          }
        }

        if (isInsideFileAction) {
          if (
            !chunk.includes("</boltAction>") &&
            !chunk.includes("<boltAction")
          ) {
            accumulatedContent += chunk;
            if (currentFileAction.filePath) {
              // First remove any XML tags at start and end
              const cleanContent = accumulatedContent
                .replace(/^>?\s*/, "") // Remove leading '>' and whitespace
                .replace(/\s*<\/boltAction>\s*$/, "") // Remove trailing boltAction tag
                // Then process HTML entities and escapes
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\([^\\])/g, "$1")
                .replace(/\\"/g, '"')
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;lt;/g, "<")
                .replace(/&amp;gt;/g, ">")
                .replace(/\{&gt;/g, "{>")
                .replace(/&lt;\}/g, "<}")
                .replace(/=&gt;/g, "=>")
                .trim();

              setEditorCode(currentFileAction.filePath, cleanContent);
            }
          }
        }

        if (isInsideFileAction && buffer.includes("</boltAction>")) {
          const cleanContent = accumulatedContent
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\([^\\])/g, "$1")
            .replace(/\\"/g, '"')
            .replace(/\/boltAction\s*$/, "")
            .trim();
          currentFileAction.content = cleanContent;
          message.boltArtifact.fileActions.push({ ...currentFileAction });
          isInsideFileAction = false;
          buffer = buffer.substring(buffer.indexOf("</boltAction>") + 13);
        }

        if (isInsideArtifact && buffer.includes('<boltAction type="shell"')) {
          isInsideShellAction = true;
          currentShellAction = { type: "shell", content: "" };
          buffer = buffer.substring(buffer.indexOf(">") + 1);
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
            setFileupdating(true);
            message.afterMsg += chunk;
          }
        }
      }
      console.log(EditorCode);
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

  const enhancePrompt = async (inputValue: string) => {
    try {
      const URL = "http://localhost:4000/api/refinePrompt";
      const response: Response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputValue }),
      });
      if (!response.body) throw new Error("No response body");
      setInputValue(""); // First clear the input
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        setInputValue((prev) => {
          console.log(prev);
          return prev + chunk;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg pt-1 ease-in-out duration-300 backdrop-blur-lg bg-background/95 ">
      {/* Premium Banner */}
      <div className="flex items-center justify-between px-4 pt-2 mb-2 flex-wrap gap-2 ">
        <p className="text-sm text-zinc-100">
          Need more messages? Get higher limits with Premium.
        </p>
        <div className="w-fit flex items-center gap-2">
          <ShinyButton
            onClick={() => enhancePrompt(inputValue)}
            className="h-fit flex min-w-fit text-black"
          >
            Enhance Prompt
          </ShinyButton>
          <Button
            variant="default"
            size="sm"
            className="h-fit py-2 bg-emerald-400 hover:bg-emerald-500"
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
      <Card className="border-0 bg-transparent">
        <div className="flex flex-col items-start px-1 py-2">
          <div className="flex items-center gap-2 w-full">
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border-0  focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none   min-h-[45px] p-2"
              placeholder="Ask CodeGen AI a question..."
              rows={1}
              style={{ overflow: "hidden" }}
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
