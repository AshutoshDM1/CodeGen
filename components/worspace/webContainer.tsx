import { useEffect } from "react";

import { useWebContainer } from "@/hooks/useWebContainer";
import { useState } from "react";
import { useEditorCode } from "@/store/chatStore";
import { FileSystemTree } from "@webcontainer/api";

const WebContainer = () => {
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { EditorCode } = useEditorCode();

  useEffect(() => {
    const setupWebContainer = async () => {
      try {
        setIsLoading(true);
        if (!webcontainer) return;

        // console.log(EditorCode);

        // Mount the files
        const files = EditorCode as unknown as FileSystemTree;
        await webcontainer.mount(files);

        // Install dependencies
        const installProcess = await webcontainer.spawn("npm", ["install"]);
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error("Installation failed");
        }

        // Start the development server
        const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);

        // Listen for server-ready event
        webcontainer.on("server-ready", (port, url) => {
          console.log("Server is ready at:", url);
          setUrl(url);
          setIsLoading(false);
        });

        // Change the output handling
        devProcess.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log(chunk);
              if (chunk.includes("Error")) {
                setIsLoading(false);
              }
            },
          })
        );
      } catch (error) {
        console.error("Setup failed:", error);
        setIsLoading(false);
      }
    };

    if (!webcontainerLoading) {
      setupWebContainer();
    }
  }, [webcontainer, webcontainerLoading]);

  return (
    <div className="h-full w-full">
      {isLoading || webcontainerLoading ? (
        <div className="flex items-center justify-center w-full">
          <p>Loading preview...</p>
        </div>
      ) : url ? (
        <iframe
          width="100%"
          height="100%"
          src={url}
          allow="cross-origin-isolated"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      ) : (
        <div className="flex items-center justify-center w-full">
          <p>Failed to load preview</p>
        </div>
      )}
    </div>
  );
};

export default WebContainer;
