"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Alert from "@/components/workspace-components/Alert";
import AiChat from "@/components/workspace-components/AiChat";
import CodeEditor from "@/components/workspace-components/codeEditor";
import SidebarMain from "@/components/workspace-components/SidebarMain";
import { useFullPreview } from "@/store/chatStore";
import { useEffect, useCallback } from "react";
import { useWebContainer } from "@/hooks/useWebContainer";
import { useEditorCode } from "@/store/chatStore";
import { useTerminalStore } from "@/store/chatStore";
import { useShowPreview } from "@/store/chatStore";
import { useRef } from "react";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { cleanTerminalOutput } from "@/components/workspace-components/webContainer";
import { ArrowLeftIcon } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";
import { AnimatePresence } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const Dashboard = () => {
  const { fullPreview, setFullPreview } = useFullPreview();
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const { url, setUrl, setIsSavingFiles } = useTerminalStore();
  const setIsLoading = useTerminalStore(
    (state) => state.setIsLoadingWebContainer
  );
  const { EditorCode } = useEditorCode();
  const addCommand = useTerminalStore((state) => state.addCommand);
  const { showWorkspace, setShowWorkspace } = useShowPreview();
  const isInitialized = useRef(false);
  const prevEditorCode = useRef(EditorCode);
  const devProcessRef = useRef<{
    kill: () => void;
    output: ReadableStream<string>;
    exit: Promise<number>;
  } | null>(null);
  const serverReadyRef = useRef(false);

  // Define startDevServer with useCallback
  const startDevServer = useCallback(
    async (container: WebContainer) => {
      if (!container) return;

      console.log("Starting dev server...");
      const devProcess = await container.spawn("npm", ["run", "dev"]);
      devProcessRef.current = devProcess;

      // Set up server-ready listener only once
      if (!serverReadyRef.current) {
        container.on("server-ready", (port: number, serverUrl: string) => {
          const cleanUrl = `Server is ready at: ${serverUrl}`;
          console.log("Server ready at port:", port);
          addCommand(cleanUrl);
          setUrl(serverUrl);
          setIsLoading(false);
          serverReadyRef.current = true;
          setIsSavingFiles(false);
        });
      }

      // Handle process output
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            const cleanedOutput = cleanTerminalOutput(chunk);
            if (cleanedOutput) {
              addCommand(cleanedOutput);
            }
            if (chunk.includes("Error")) {
              setIsLoading(false);
            }
          },
        })
      );
    },
    [addCommand, setIsLoading, setIsSavingFiles, setUrl]
  );

  // Function to remount files
  const remountFiles = useCallback(async () => {
    if (!webcontainer) return;

    try {
      console.log("Remounting files...");
      addCommand("> 📦 Remounting files...");

      // Kill the current dev server if it exists
      if (devProcessRef.current) {
        await devProcessRef.current.kill();
      }

      // Reset server ready state
      serverReadyRef.current = false;

      // Mount the files
      const files = EditorCode as unknown as FileSystemTree;
      await webcontainer.mount(files);
      addCommand("> ✅ Files remounted successfully");

      const installProcess = await webcontainer.spawn("npm", ["install"]);
      const installExitCode = await installProcess.exit;
      console.log("Install exit code:", installExitCode);
      console.log("hi ");
      console.log("Mounted files:", Object.keys(files).join(", "));
      if (installExitCode !== 0) {
        throw new Error("Installation failed");
      }
      // Restart the dev server
      await startDevServer(webcontainer);
      addCommand("> 🚀 Restarting development server...");
    } catch (error) {
      console.error("Remount failed:", error);
      addCommand("> ❌ Error remounting files: " + (error as Error).message);
      setIsLoading(false);
      setIsSavingFiles(false);
    }
  }, [
    EditorCode,
    addCommand,
    setIsLoading,
    setIsSavingFiles,
    startDevServer,
    webcontainer,
  ]);

  // Initial setup - only runs once when the WebContainer is first available
  useEffect(() => {
    const setupWebContainer = async () => {
      if (!webcontainer || isInitialized.current) return;

      try {
        console.log("Initial WebContainer setup...");
        setIsLoading(true);

        const files = EditorCode as unknown as FileSystemTree;
        await webcontainer.mount(files);

        const installProcess = await webcontainer.spawn("npm", ["install"]);
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error("Installation failed");
        }

        await startDevServer(webcontainer);
        isInitialized.current = true;
        prevEditorCode.current = EditorCode;
      } catch (error) {
        console.error("Setup failed:", error);
        setIsLoading(false);
      }
    };

    if (!webcontainerLoading && !isInitialized.current) {
      setupWebContainer();
    }
  }, [
    webcontainer,
    webcontainerLoading,
    EditorCode,
    setIsLoading,
    startDevServer,
  ]);

  // Listen for remount events
  useEffect(() => {
    const handleRemount = () => {
      remountFiles();
    };

    window.addEventListener("remount-webcontainer", handleRemount);
    return () => {
      window.removeEventListener("remount-webcontainer", handleRemount);
    };
  }, [webcontainer, remountFiles]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (devProcessRef.current) {
        console.log("Cleaning up dev server...");
        devProcessRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {fullPreview ? (
          <div className="h-screen w-full" key="fullPreview">
            <HoverButton
              onClick={() => setFullPreview(false)}
              className="absolute top-2 right-5 flex items-center gap-2 bg-black-500/50 backdrop-blur-sm mix-blend-hard-light"
            >
              <ArrowLeftIcon className="w-6 h-6 text-white" />
              <h1 className="text-white text-md">Back to Workspace</h1>
            </HoverButton>

            <iframe
              width="100%"
              height="100%"
              src={url}
              allow="cross-origin-isolated"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        ) : (
          <div key="workspaceView" className="h-screen w-full">
            <Alert />
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-screen"
            >
              <SidebarMain />
              <AiChat />
              {showWorkspace === true ? (
                <CodeEditor />
              ) : (
                <div className="absolute w-fit top-2 right-14 flex items-center justify-center">
                  <InteractiveHoverButton
                    content="Show Workspace"
                    className="w-[222px] gap-10  flex items-center justify-center px-4 font-medium"
                    onClick={() => setShowWorkspace(true)}
                    arrow={true}
                  />
                </div>
              )}
            </ResizablePanelGroup>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
