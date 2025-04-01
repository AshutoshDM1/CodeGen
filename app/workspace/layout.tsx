"use client";
import {
  useChatStore,
  useFullPreview,
  useProjectStore,
} from "@/store/chatStore";
import { useEffect, useCallback, ReactNode, useRef } from "react";
import { useWebContainer } from "@/hooks/useWebContainer";
import { useEditorCode } from "@/store/chatStore";
import { useTerminalStore } from "@/store/chatStore";
import { useShowPreview } from "@/store/chatStore";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { cleanTerminalOutput } from "@/components/workspace-components/webContainer";
import { useParams } from "next/navigation";
import JSZip from "jszip";
import SidebarMain from "@/components/workspace-components/SidebarMain";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

const Layout = ({ children }: { children: ReactNode }) => {
  const { fullPreview, setFullPreview } = useFullPreview();
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const { url, setUrl, setIsSavingFiles } = useTerminalStore();
  const setIsLoading = useTerminalStore(
    (state) => state.setIsLoadingWebContainer
  );
  const { EditorCode } = useEditorCode();
  const addCommand = useTerminalStore((state) => state.addCommand);
  const { showWorkspace, setShowWorkspace } = useShowPreview();
  const { setMessages } = useChatStore();
  const isInitialized = useRef(false);
  const prevEditorCode = useRef(EditorCode);
  const devProcessRef = useRef<{
    kill: () => void;
    output: ReadableStream<string>;
    exit: Promise<number>;
  } | null>(null);
  const serverReadyRef = useRef(false);
  const { project, setProject } = useProjectStore((state) => state);
  const { setCode } = useEditorCode((state) => state);
  const { workspaceId } = useParams();
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

  const npmRunDev = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);
      devProcessRef.current = devProcess;
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        })
      );
      addCommand("> 🚀 Running npm run dev...");
    } catch (error) {
      console.error("> ❌ Error running npm run dev:", error);
    }
  }, [webcontainer, addCommand]);

  const npmInstall = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const installProcess = await webcontainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        })
      );
      addCommand("> 🚀 Running npm install...");
    } catch (error) {
      console.error("> ❌ Error running npm install:", error);
    }
  }, [webcontainer, addCommand]);

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

  const handleExport = useCallback(async () => {
    if (!webcontainer) return;
    try {
      addCommand("> 📦 Preparing project for export...");
      addCommand("> 🔍 Excluding node_modules to reduce file size...");
      // Import JSZip dynamically
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default;
      const combinedZip = new JSZip();

      // Add each file and directory to the zip directly (except node_modules)
      addCommand("> 📄 Collecting project files...");

      // Function to recursively add files to zip
      const addToZip = async (path: string, zipTarget: JSZip) => {
        const entries = await webcontainer.fs.readdir(path, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = path === "." ? entry.name : `${path}/${entry.name}`;

          // Skip node_modules
          if (entry.name === "node_modules") {
            continue;
          }

          if (entry.isDirectory()) {
            // Recursively process directories
            await addToZip(fullPath, zipTarget);
          } else {
            // Add file directly to zip at the correct path
            const content = await webcontainer.fs.readFile(fullPath);
            zipTarget.file(fullPath, content);
          }
        }
      };

      // Start recursive process from root
      await addToZip(".", combinedZip);

      // Generate the combined zip file
      addCommand("> 🔒 Creating ZIP archive without node_modules...");
      const combinedZipBlob = await combinedZip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      console.log("Exporting project without node_modules...");
      addCommand("> ✅ Project export successful (without node_modules)");
      addCommand(
        "> 💡 Run 'npm install' after extracting to install dependencies"
      );

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(combinedZipBlob);
      link.download = "project-codebase.zip";

      // Trigger the download
      link.click();

      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      addCommand("> ✅ Export completed");
    } catch (error) {
      console.error("Export failed:", error);
      addCommand(`> ❌ Export failed: ${(error as Error).message}`);
      addCommand(
        "> 💡 Tip: Try a simple export with node_modules if this fails"
      );
    }
  }, [webcontainer, addCommand]);

  // Listen for remount events
  useEffect(() => {
    const handleRemount = () => {
      remountFiles();
    };
    const handleNpmRunDev = () => {
      npmRunDev();
    };
    const handleNpmInstall = () => {
      npmInstall();
    };
    const handleExportZip = () => {
      handleExport();
    };
    // Simple export fallback if the main export fails
    const handleSimpleExport = async () => {
      if (!webcontainer) return;
      try {
        addCommand("> 📦 Exporting project with simple method...");
        // Export only src directory which usually contains the source code
        let data;
        try {
          data = await webcontainer.export("src", { format: "zip" });
          addCommand("> ✅ Exported 'src' directory successfully");
        } catch (e) {
          // If no src directory, try to export everything except node_modules
          console.log(e);
          addCommand("> ℹ️ No 'src' directory found, trying root export");
          data = await webcontainer.export(".", { format: "zip" });
          addCommand(
            "> ⚠️ Warning: This includes node_modules and may be large"
          );
        }

        const zip = new Blob([data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zip);
        link.download = "project-export.zip";
        link.click();

        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 100);

        addCommand("> ✅ Simple export completed");
      } catch (error) {
        console.error("Simple export failed:", error);
        addCommand(`> ❌ Simple export failed: ${(error as Error).message}`);
      }
    };

    window.addEventListener("export-project", handleExportZip);
    window.addEventListener("simple-export", handleSimpleExport);
    window.addEventListener("remount-webcontainer", handleRemount);
    window.addEventListener("npm-run-dev", handleNpmRunDev);
    window.addEventListener("npm-install", handleNpmInstall);

    return () => {
      window.removeEventListener("remount-webcontainer", handleRemount);
      window.removeEventListener("npm-run-dev", handleNpmRunDev);
      window.removeEventListener("npm-install", handleNpmInstall);
      window.removeEventListener("export-project", handleExportZip);
      window.removeEventListener("simple-export", handleSimpleExport);
    };
  }, [
    webcontainer,
    remountFiles,
    npmRunDev,
    npmInstall,
    handleExport,
    addCommand,
  ]);

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
    <div className="h-[100vh] flex">
      {!fullPreview ? <SidebarMain /> : null}
      <AnimatedGradientBackground />
      {children}
    </div>
  );
};

export default Layout;
