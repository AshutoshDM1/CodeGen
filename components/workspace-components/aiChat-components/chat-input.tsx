"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Paperclip, ArrowUp, Loader2 } from "lucide-react";
import { X } from "lucide-react";
import { messageuser } from "@/services/api";
import {
  useChatStore,
  useEditorCode,
  useFilePaths,
  useFileExplorer,
  findFileContent,
  useShowPreview,
  useTerminalStore,
  useUpdatingFiles,
} from "@/store/chatStore";
import { useState } from "react";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
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

export default function ChatInput({ projectId }: { projectId: string | null }) {
  const router = useRouter();
  const { setFileupdating } = useFilePaths();
  const { addMessage, isLoading, setIsLoading, addAIbeforeMsg, addAIafterMsg } =
    useChatStore();
  const { EditorCode, setEditorCode } = useEditorCode();
  const [inputValue, setInputValue] = useState("");
  const { setFilePaths } = useFilePaths();
  const { addFileByAI } = useFileExplorer();
  const { setShowWorkspace, setShowCode, setShowPreview } = useShowPreview();
  const { setIsLoadingWebContainerMessage, setIsLoadingWebContainer } =
    useTerminalStore((state) => state);
  const { addUpdatingFiles, setUpdatingFiles, setAiThinking } =
    useUpdatingFiles();
  let buffer = "";
  let buferAfter = "";
  const fetchData = async () => {
    try {
      const URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://codegen-server-yuxj.onrender.com";

      const Files = EditorCode;
      const CurrentFiles = JSON.stringify(Files);
      const prompt = inputValue;
      const messageToAI = {
        role: "user",
        content: `1. here all the current files which are present ${CurrentFiles} do the changes in the files 2. dont forget to update the package.json file otherwise it will not work in webcontainer.3. if user ask to make a app or website do changes in the files and make a that project currently the file have a basic Landing page so you can change that or if user ask to refine or edit the files then do the changes in the files and only in enhance the code dont change the whole project 4. ${prompt}`,
      };

      messageuser.messages.push(messageToAI);

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
      setAiThinking(false);
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
              console.log(currentFileAction.filePath);
              addUpdatingFiles([
                {
                  action: "Updating",
                  filePath: currentFileAction.filePath,
                },
              ]);
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
      return message;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingWebContainerMessage("Compiling the project...");
      setIsLoadingWebContainer(true);
      const event1 = new CustomEvent("updated-files");
      await window.dispatchEvent(event1);
      setUpdatingFiles([]);
      const event2 = new CustomEvent("remount-webcontainer");
      window.dispatchEvent(event2);
      setShowPreview();
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setAiThinking(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (projectId === null) {
      const newId = uuidv4();
      router.push(`/workspace/${newId}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    addMessage({ role: "user", content: inputValue });
    setInputValue("");
    setShowWorkspace(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowCode();
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
          return prev + chunk;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 1,
        }}
        className={`w-full ${
          projectId === null ? "max-w-3xl self-center" : ""
        } border rounded-lg pt-1 ease-in-out duration-300 backdrop-blur-lg bg-background/95 `}
      >
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
                className="w-full border-0  focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none   min-h-[52px] p-2"
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
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="sr-only">Loading...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
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
      </motion.div>
    </AnimatePresence>
  );
}
